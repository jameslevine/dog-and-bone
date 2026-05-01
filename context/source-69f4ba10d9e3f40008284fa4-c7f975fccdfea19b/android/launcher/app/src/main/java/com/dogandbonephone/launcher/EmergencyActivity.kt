package com.dogandbonephone.launcher

import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

/**
 * Full-screen emergency activity for the Senior profile.
 *
 * Shown when the user presses the floating emergency button.
 * Provides a large, clear "Call now" button so seniors can
 * confirm or cancel the emergency call.
 */
class EmergencyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_emergency)

        val config = AppConfig.load(this)
        val emergencyButton = EmergencyButton(this, config)

        val callButton = findViewById<Button>(R.id.emergencyCallButton)
        callButton.setOnClickListener {
            emergencyButton.attachTo(callButton) // re-use EmergencyButton dial logic
            callButton.performClick()
        }

        val cancelButton = findViewById<Button>(R.id.emergencyCancelButton)
        cancelButton.setOnClickListener {
            finish()
        }
    }
}
