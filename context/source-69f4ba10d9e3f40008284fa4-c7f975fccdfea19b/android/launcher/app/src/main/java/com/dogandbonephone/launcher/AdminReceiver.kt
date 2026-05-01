package com.dogandbonephone.launcher

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent

/**
 * Device Owner admin receiver.
 *
 * Once Dog and Bone is set as Device Owner (via ADB before accounts are added),
 * this enables full kiosk lock-task mode — the notification shade, status bar,
 * recents, and all system UI are completely blocked.
 *
 * To provision:
 *   adb shell dpm set-device-owner com.dogandbonephone.launcher/.AdminReceiver
 */
class AdminReceiver : DeviceAdminReceiver() {

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
    }
}
