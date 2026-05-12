# Releasing the Android Launcher

The launcher's release pipeline lives in [.github/workflows/launcher-release.yml](../.github/workflows/launcher-release.yml). It builds, signs, uploads to S3, updates the remote manifest, and creates a GitHub Release — all triggered by pushing a git tag.

## Cutting a release

```bash
# Ensure main is clean and tests pass.
git checkout main && git pull
npm test

# Tag and push. Format is strict: vMAJOR.MINOR (no patch segment).
git tag v1.2
git push origin v1.2
```

That's it. Within ~10 minutes the pipeline will:

1. Derive `versionCode` (MAJOR × 100 + MINOR, so `v1.2` → `102`) and `versionName` (`1.2`) from the tag.
2. Build and sign the APK using the production keystore stored in GitHub secrets.
3. Compute its SHA-256.
4. Generate release notes from commits between the previous `vMAJOR.MINOR` tag and this one.
5. Upload:
   - APK → `s3://dog-and-bone-configs-dev/releases/dog-and-bone-launcher-${version}.apk`
   - Manifest → `s3://dog-and-bone-configs-dev/releases/latest.json`
6. Create a GitHub Release at `Releases/v1.2` with the APK attached and the changelog as the body.

Already-deployed devices pick the release up on their next cold-start (~1s) or hourly `ConfigSyncWorker` run, show the "Update available" banner, and install when the user taps.

## Version numbering

- Tag format: `vMAJOR.MINOR` only. `v1.2.3`, `v1.2-rc1`, etc. are rejected by the workflow trigger.
- Increment `MINOR` for anything you can ship today. Bump `MAJOR` only when you change behaviour that a customer would notice (e.g. a new profile, a dramatic UI shift).
- Tags must be monotonic: every new tag's derived `versionCode` must exceed all published devices' installed codes, or Android refuses the self-install with `INSTALL_FAILED_VERSION_DOWNGRADE`.

## One-time secrets setup

Set these eight values once under **Repo → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | How to populate |
|--------|-----------------|
| `LAUNCHER_KEYSTORE_BASE64` | `base64 < android/dog-and-bone-release.keystore \| pbcopy` then paste. |
| `LAUNCHER_KEYSTORE_PASSWORD` | Value of `storePassword=` in `android/keystore.properties`. |
| `LAUNCHER_KEY_ALIAS` | Value of `keyAlias=`. |
| `LAUNCHER_KEY_PASSWORD` | Value of `keyPassword=`. |
| `AWS_DEVICE_API_URL` | The API Gateway URL currently in `android/launcher/local.properties`. |
| `AWS_DEVICE_API_KEY` | The API key currently in `android/launcher/local.properties`. |
| `AWS_ACCESS_KEY_ID` | IAM user with scoped S3 access (see below). |
| `AWS_SECRET_ACCESS_KEY` | Partner secret for the access key. |

### IAM user for S3 publishing

In the AWS console, create an IAM user `dog-and-bone-launcher-ci` with programmatic access and this inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::dog-and-bone-configs-dev/releases/*"
      ]
    }
  ]
}
```

Nothing broader. The CI job only needs to write release artefacts — it should not read or write device configs.

## Rolling back a bad release

Because the self-update flow trusts `releases/latest.json`, a rollback is essentially "make that file point at an older APK":

```bash
# List what's in S3.
aws s3 ls s3://dog-and-bone-configs-dev/releases/ --region eu-west-2

# Pull the old manifest (if one exists somewhere) or craft by hand.
# Fastest: tag + push the older commit as a new, higher version number.
#   e.g. if v1.2 is broken and v1.1 was good,
#   tag the last-good commit as v1.3:
git tag v1.3 <sha-of-v1.1>
git push origin v1.3
```

Android rejects downgrades by versionCode, so you can't just re-push `v1.1`. You have to advance the version even when going back to old code.

## Troubleshooting

**`INSTALL_FAILED_VERSION_DOWNGRADE` on-device:** the manifest's `versionCode` is lower than the device's installed code. Happens if you re-tag old code at a lower version. Fix by publishing a higher version.

**`INSTALL_FAILED_UPDATE_INCOMPATIBLE`:** the APK was signed with a different keystore. The workflow is keystore-pinned, so this shouldn't happen unless someone rotated `LAUNCHER_KEYSTORE_BASE64`. If you rotate the keystore, every already-deployed device needs a factory reset — the old and new keystores cannot interoperate.

**Workflow fails at the S3 upload step:** usually a stale `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`, or the IAM policy is scoped too tightly. Verify by running `aws s3 cp` locally with the CI user's credentials.

**Workflow fails at "derive version":** the tag doesn't match `v[0-9]+.[0-9]+`. Delete the tag (`git tag -d v1.2.3 && git push origin :refs/tags/v1.2.3`) and re-tag in the right format.

## Related

- Rotation runbook for `AWS_DEVICE_API_KEY`: [infrastructure/DEVICE_TRACKING.md](../infrastructure/DEVICE_TRACKING.md).
- Self-update design: see commit `95a6e89` and [android/launcher/app/src/main/java/com/dogandbonephone/launcher/UpdateChecker.kt](../android/launcher/app/src/main/java/com/dogandbonephone/launcher/UpdateChecker.kt).
- ADR on API-key auth (and why rotation is heavier than it looks): ADR-011 in [docs/DECISIONS.md](DECISIONS.md).
