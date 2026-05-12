package com.dogandbonephone.launcher

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller
import android.util.Log

/**
 * Receives the outcome of the PackageInstaller session for our self-update.
 *
 * PackageInstaller posts to the pending intent we handed to session.commit() once
 * the OS has decided whether the install can proceed. Three outcomes:
 *  - STATUS_PENDING_USER_ACTION: on non-Device-Owner devices the OS wants to show
 *    a confirmation dialog. Since we're Device Owner, this shouldn't normally fire,
 *    but if it does we launch the dialog.
 *  - STATUS_SUCCESS: install completed. The APK has been replaced; on next launch
 *    we'll be running the new version. Clear the pending manifest.
 *  - STATUS_FAILURE (and variants): log and keep the pending manifest so the user
 *    can retry from the banner.
 */
class InstallResultReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, -1)
        val message = intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE) ?: "(no message)"

        when (status) {
            PackageInstaller.STATUS_PENDING_USER_ACTION -> {
                val userAction = intent.getParcelableExtra<Intent>(Intent.EXTRA_INTENT)
                if (userAction != null) {
                    userAction.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    context.startActivity(userAction)
                    Log.d(TAG, "Install needs user confirmation — launching dialog")
                } else {
                    Log.w(TAG, "STATUS_PENDING_USER_ACTION but no EXTRA_INTENT")
                }
            }
            PackageInstaller.STATUS_SUCCESS -> {
                Log.d(TAG, "Install succeeded")
                UpdateChecker.clearPendingManifest(context)
            }
            else -> {
                Log.e(TAG, "Install failed: status=$status message=$message")
            }
        }
    }

    companion object {
        private const val TAG = "DogAndBone"
    }
}
