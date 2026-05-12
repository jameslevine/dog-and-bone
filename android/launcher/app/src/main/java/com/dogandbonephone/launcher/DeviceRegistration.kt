package com.dogandbonephone.launcher

import android.content.Context
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.util.UUID

/**
 * Device Registration - Registers device with AWS backend
 * Sends device serial, order info, and checks for remote config updates
 */
object DeviceRegistration {

    private val API_URL = BuildConfig.AWS_DEVICE_API_URL
    private val API_KEY = BuildConfig.AWS_DEVICE_API_KEY
    private const val TAG = "DogAndBone"

    private fun isConfigured(): Boolean {
        if (API_URL.isBlank() || API_KEY.isBlank()) {
            Log.w(TAG, "Device API not configured — set AWS_DEVICE_API_URL and AWS_DEVICE_API_KEY in local.properties")
            return false
        }
        return true
    }

    /**
     * Register this device with the backend
     * Call this on first launch or periodically
     */
    suspend fun registerDevice(context: Context, config: AppConfig) {
        if (!isConfigured()) return
        val serial = getDeviceSerial(context)
        withContext(Dispatchers.IO) {
            try {
                val url = URL("$API_URL/device/register")
                val connection = url.openConnection() as HttpURLConnection

                connection.requestMethod = "POST"
                connection.setRequestProperty("Content-Type", "application/json")
                connection.setRequestProperty("x-api-key", API_KEY)
                connection.doOutput = true

                val payload = JSONObject().apply {
                    put("deviceSerial", serial)
                    put("orderId", "unknown") // Will be populated from setup script metadata later
                    put("profileId", config.profile)
                    put("appList", org.json.JSONArray(config.apps))
                    put("launcherVersion", BuildConfig.VERSION_NAME)
                }

                connection.outputStream.use { os ->
                    os.write(payload.toString().toByteArray())
                }

                val responseCode = connection.responseCode
                if (responseCode == 200) {
                    Log.d(TAG, "Device registered successfully: $serial")
                } else {
                    Log.w(TAG, "Device registration failed: $responseCode")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Device registration error", e)
                // Fail silently - device works offline
            }
        }
    }

    /**
     * Check for remote configuration updates
     * Returns new config if available, null if no updates
     */
    suspend fun checkForConfigUpdates(context: Context): String? {
        if (!isConfigured()) return null
        val serial = getDeviceSerial(context)
        return withContext(Dispatchers.IO) {
            try {
                val url = URL("$API_URL/device/config/$serial")
                val connection = url.openConnection() as HttpURLConnection

                connection.requestMethod = "GET"
                connection.setRequestProperty("x-api-key", API_KEY)

                if (connection.responseCode == 200) {
                    val config = connection.inputStream.bufferedReader().readText()
                    Log.d(TAG, "Remote config fetched for $serial")
                    config
                } else if (connection.responseCode == 404) {
                    Log.d(TAG, "No remote config for $serial")
                    null
                } else {
                    Log.w(TAG, "Config fetch failed: ${connection.responseCode}")
                    null
                }
            } catch (e: Exception) {
                Log.e(TAG, "Config fetch error", e)
                null
            }
        }
    }

    /**
     * Returns a stable per-install device identifier.
     *
     * Android apps can't read the hardware serial without privileged permissions,
     * so we generate a UUID on first launch and persist it in SharedPreferences.
     * Survives updates + reboots; does NOT survive factory reset (which is fine —
     * a reset means "start over" and should register as a new device).
     */
    private fun getDeviceSerial(context: Context): String {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        prefs.getString(KEY_DEVICE_ID, null)?.let { return it }
        val generated = UUID.randomUUID().toString()
        prefs.edit().putString(KEY_DEVICE_ID, generated).apply()
        return generated
    }

    private const val PREFS_NAME = "device_registration"
    private const val KEY_DEVICE_ID = "device_id"
}
