package com.dogandbonephone.launcher

import android.os.Bundle
import android.text.InputType
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

/**
 * PIN entry / setup screen for the Family profile.
 *
 * Modes:
 *  - MODE_SETUP   — shown on first launch; prompts admin to create a PIN.
 *  - MODE_VERIFY  — shown before opening Settings; validates existing PIN.
 */
class PinLockActivity : AppCompatActivity() {

    private lateinit var pinManager: PinLockManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pin_lock)

        pinManager = PinLockManager(this)

        val mode = intent.getStringExtra(EXTRA_MODE) ?: MODE_VERIFY
        val titleView = findViewById<TextView>(R.id.pinTitle)
        val pinInput = findViewById<EditText>(R.id.pinInput)
        val confirmButton = findViewById<Button>(R.id.pinConfirmButton)

        pinInput.inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_VARIATION_PASSWORD

        when (mode) {
            MODE_SETUP -> {
                titleView.text = getString(R.string.pin_setup_title)
                confirmButton.setOnClickListener {
                    val pin = pinInput.text.toString()
                    if (pin.length < PinLockManager.MIN_PIN_LENGTH) {
                        Toast.makeText(
                            this,
                            getString(R.string.pin_too_short, PinLockManager.MIN_PIN_LENGTH),
                            Toast.LENGTH_SHORT,
                        ).show()
                        return@setOnClickListener
                    }
                    pinManager.setupPin(pin)
                    Toast.makeText(this, getString(R.string.pin_set_success), Toast.LENGTH_SHORT).show()
                    finish()
                }
            }

            MODE_VERIFY -> {
                titleView.text = getString(R.string.pin_verify_title)
                confirmButton.setOnClickListener {
                    val pin = pinInput.text.toString()
                    if (pinManager.verifyPin(pin)) {
                        setResult(RESULT_OK)
                        finish()
                    } else {
                        pinInput.text.clear()
                        Toast.makeText(this, getString(R.string.pin_incorrect), Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    /** Block back button — admin must either enter the PIN or restart the device. */
    override fun onBackPressed() {
        // Do nothing
    }

    companion object {
        const val EXTRA_MODE = "mode"
        const val MODE_SETUP = "setup"
        const val MODE_VERIFY = "verify"
    }
}
