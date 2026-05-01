package com.dogandbonephone.launcher

import android.content.Context
import org.json.JSONObject
import java.io.File

/**
 * Represents the launcher configuration loaded from app-config.json.
 *
 * The config file can live in two places (checked in order):
 *  1. /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json
 *     — pushed by the ADB setup script, overrides the bundled default.
 *  2. assets/app-config.json — the default bundled at build time.
 */
data class AppConfig(
    val profile: String,
    val apps: List<String>,
    val showEmergencyButton: Boolean,
    val pinEnabled: Boolean,
    val emergencyNumber: String,
    val largeText: Boolean = false,
) {
    companion object {

        fun load(context: Context): AppConfig {
            // Try multiple config sources in priority order
            val json = readExternalFilesConfig(context)
                ?: readExternalStorageConfig()
                ?: readBundledConfig(context)

            android.util.Log.d("DogAndBone", "Loaded config: ${json.take(150)}")
            return parseJson(json)
        }

        /** Reads from app-specific external files directory (no permission needed, best option). */
        private fun readExternalFilesConfig(context: Context): String? {
            return try {
                val file = File(context.getExternalFilesDir(null), "app-config.json")
                android.util.Log.d("DogAndBone", "Checking app files config at: ${file.absolutePath}")
                if (file.exists() && file.canRead()) {
                    val content = file.readText()
                    android.util.Log.d("DogAndBone", "✅ External app files config loaded")
                    content
                } else {
                    android.util.Log.d("DogAndBone", "App files config not found")
                    null
                }
            } catch (e: Exception) {
                android.util.Log.e("DogAndBone", "Error reading app files config", e)
                null
            }
        }

        /** Reads from legacy external storage path (requires permission on Android 11+). */
        private fun readExternalStorageConfig(): String? {
            return try {
                val file = File(
                    android.os.Environment.getExternalStorageDirectory(),
                    "Android/data/com.dogandbonephone.launcher/files/app-config.json"
                )
                android.util.Log.d("DogAndBone", "Checking legacy external storage at: ${file.absolutePath}")
                if (file.exists() && file.canRead()) {
                    val content = file.readText()
                    android.util.Log.d("DogAndBone", "✅ External storage config loaded")
                    content
                } else {
                    android.util.Log.d("DogAndBone", "Legacy config not found or not readable")
                    null
                }
            } catch (e: Exception) {
                android.util.Log.e("DogAndBone", "Error reading external storage config", e)
                null
            }
        }

        /** Reads the config bundled inside the APK assets. */
        private fun readBundledConfig(context: Context): String {
            return context.assets.open("app-config.json").bufferedReader().readText()
        }

        private fun parseJson(json: String): AppConfig {
            val obj = JSONObject(json)
            val appsArray = obj.getJSONArray("apps")
            val apps = buildList {
                for (i in 0 until appsArray.length()) {
                    add(appsArray.getString(i))
                }
            }
            return AppConfig(
                profile = obj.optString("profile", "essential"),
                apps = apps,
                showEmergencyButton = obj.optBoolean("showEmergencyButton", false),
                pinEnabled = obj.optBoolean("pinEnabled", false),
                emergencyNumber = obj.optString("emergencyNumber", ""),
                largeText = obj.optBoolean("largeText", false),
            )
        }
    }
}
