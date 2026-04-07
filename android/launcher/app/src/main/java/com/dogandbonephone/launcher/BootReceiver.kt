package com.dogandbonephone.launcher

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Ensures the Dog and Bone launcher is started automatically after
 * the device reboots. Combined with the HOME intent filter in
 * AndroidManifest.xml this keeps our launcher as the active home screen.
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            val launchIntent = Intent(context, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(launchIntent)
        }
    }
}
