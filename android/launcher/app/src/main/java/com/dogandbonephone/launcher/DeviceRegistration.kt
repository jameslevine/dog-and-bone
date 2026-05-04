package com.dogandbonephone.launcher

import android.content.Context
import android.os.Build
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * Device Registration - Registers device with AWS backend
 * Sends device serial, order info, and checks for remote config updates
 */
object DeviceRegistration {

    private const val API_URL = "https://9ces4tqpq8.execute-api.eu-west-2.amazonaws.com/dev"
    private const val API_KEY = "ACmh8yUtjE6mxVuRKMOYG7PjrwoBSa336tIqTd8w"
    private const val TAG = "DogAndBone"

    /**
     * Register this device with the backend
     * Call this on first launch or periodically
     */
    suspend fun registerDevice(context: Context, config: AppConfig) {
        withContext(Dispatchers.IO) {
            try {
                val serial = getDeviceSerial()
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
                    put("launcherVersion", "1.0.0")
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
        return withContext(Dispatchers.IO) {
            try {
                val serial = getDeviceSerial()
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

    private fun getDeviceSerial(): String {
        return try {
            Build.getSerial()
        } catch (e: SecurityException) {
            Build.SERIAL
        }
    }
}
