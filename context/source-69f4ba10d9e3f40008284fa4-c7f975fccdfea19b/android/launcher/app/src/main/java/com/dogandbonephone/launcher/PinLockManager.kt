package com.dogandbonephone.launcher

import android.content.Context
import android.content.SharedPreferences
import java.security.MessageDigest

/**
 * Manages the parental PIN for the Family profile.
 *
 * The PIN is stored as a SHA-256 hash in SharedPreferences — never in plaintext.
 * Used to gate access to Settings or app changes from within the launcher.
 */
class PinLockManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(
        PREFS_NAME,
        Context.MODE_PRIVATE,
    )

    /** Returns true if a PIN has been configured and the profile has pinEnabled. */
    fun isPinEnabled(): Boolean = prefs.getString(KEY_PIN_HASH, null) != null

    /**
     * Sets up the parental PIN.
     * Call this the first time a Family device is configured.
     */
    fun setupPin(pin: String) {
        require(pin.length >= MIN_PIN_LENGTH) {
            "PIN must be at least $MIN_PIN_LENGTH digits"
        }
        prefs.edit().putString(KEY_PIN_HASH, hash(pin)).apply()
    }

    /**
     * Verifies the entered PIN against the stored hash.
     * Returns true if the PIN matches.
     */
    fun verifyPin(input: String): Boolean {
        val storedHash = prefs.getString(KEY_PIN_HASH, null) ?: return false
        return hash(input) == storedHash
    }

    /** Removes the PIN — only call after verifying the existing PIN first. */
    fun clearPin() {
        prefs.edit().remove(KEY_PIN_HASH).apply()
    }

    /** SHA-256 hash of the PIN string, returned as a lowercase hex string. */
    private fun hash(input: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val bytes = digest.digest(input.toByteArray(Charsets.UTF_8))
        return bytes.joinToString("") { "%02x".format(it) }
    }

    companion object {
        private const val PREFS_NAME = "dog_and_bone_pin"
        private const val KEY_PIN_HASH = "pin_hash"
        const val MIN_PIN_LENGTH = 4
    }
}
