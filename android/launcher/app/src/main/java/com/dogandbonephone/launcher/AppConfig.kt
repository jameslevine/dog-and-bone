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

        private const val EXTERNAL_CONFIG_PATH =
            "Android/data/com.dogandbonephone.launcher/files/app-config.json"

        fun load(context: Context): AppConfig {
            val json = readExternalConfig() ?: readBundledConfig(context)
            return parseJson(json)
        }

        /** Reads from external storage — allows ADB push to override bundled config. */
        private fun readExternalConfig(): String? {
            return try {
                val file = File(
                    android.os.Environment.getExternalStorageDirectory(),
                    EXTERNAL_CONFIG_PATH
                )
                if (file.exists()) file.readText() else null
            } catch (e: Exception) {
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
