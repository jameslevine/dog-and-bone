package com.dogandbonephone.launcher

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.view.View
import android.widget.Toast
import androidx.core.content.ContextCompat

/**
 * Manages the floating emergency button shown on the Senior profile.
 *
 * When pressed, the button either:
 *  - Dials a pre-configured emergency number directly, OR
 *  - Falls back to showing the dialler with the number pre-filled
 *    if the CALL_PHONE permission has not been granted.
 *
 * The emergency number is read from AppConfig.emergencyNumber.
 * If that is empty, the standard emergency number 999 is used.
 */
class EmergencyButton(
    private val context: Context,
    private val config: AppConfig,
) {

    private val emergencyNumber: String
        get() = config.emergencyNumber.ifBlank { DEFAULT_EMERGENCY_NUMBER }

    /**
     * Attaches tap behaviour to the provided button view.
     * Call this in MainActivity.onCreate() after inflating the layout.
     */
    fun attachTo(button: View) {
        button.visibility = if (config.showEmergencyButton) View.VISIBLE else View.GONE

        button.setOnClickListener {
            dialEmergency()
        }
    }

    private fun dialEmergency() {
        val hasCallPermission = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.CALL_PHONE,
        ) == PackageManager.PERMISSION_GRANTED

        val intent = if (hasCallPermission) {
            // Direct call — no confirmation dialog
            Intent(Intent.ACTION_CALL, Uri.parse("tel:$emergencyNumber"))
        } else {
            // Fallback: open dialler with number pre-filled
            Intent(Intent.ACTION_DIAL, Uri.parse("tel:$emergencyNumber"))
        }

        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK

        try {
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(
                context,
                context.getString(R.string.emergency_call_failed),
                Toast.LENGTH_LONG,
            ).show()
        }
    }

    companion object {
        private const val DEFAULT_EMERGENCY_NUMBER = "999"
    }
}
