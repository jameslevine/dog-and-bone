import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const CONFIG_BUCKET = process.env.CONFIG_BUCKET
if (!CONFIG_BUCKET) throw new Error('CONFIG_BUCKET env var is required')

const s3 = new S3Client({})

const jsonResponse = (statusCode, payload) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})

export const handler = async () => {
  try {
    const manifestResp = await s3.send(
      new GetObjectCommand({
        Bucket: CONFIG_BUCKET,
        Key: 'releases/latest.json',
      }),
    )
    const manifest = JSON.parse(await manifestResp.Body.transformToString())

    // Manifest stores the APK's S3 key; we generate a presigned URL at request time
    // so the bucket stays private and the link is short-lived (1 hour).
    if (manifest.apkKey) {
      const presigned = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: CONFIG_BUCKET, Key: manifest.apkKey }),
        { expiresIn: 3600 },
      )
      manifest.apkUrl = presigned
      delete manifest.apkKey
    }

    return jsonResponse(200, manifest)
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return jsonResponse(404, { error: 'No release manifest published' })
    }
    console.error('get-latest-release: failed', error)
    return jsonResponse(500, { error: 'Failed to fetch release manifest' })
  }
}
