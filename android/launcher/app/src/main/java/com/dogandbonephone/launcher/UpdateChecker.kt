package com.dogandbonephone.launcher

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

/**
 * Self-update mechanism for the launcher APK.
 *
 * Flow:
 *  1. checkForUpdate() hits GET /releases/latest, compares versionCode to BuildConfig.VERSION_CODE.
 *     If newer, persists the manifest in SharedPreferences so the UI can show a banner.
 *  2. downloadAndInstall() downloads the APK from the presigned URL in the manifest,
 *     verifies the SHA-256, and hands off to PackageInstaller. Triggered only after the
 *     user taps "Install" in the banner.
 *
 * Requires REQUEST_INSTALL_PACKAGES permission in the manifest. Device Owner grants it
 * automatically (no user prompt).
 */
object UpdateChecker {

    private val API_URL = BuildConfig.AWS_DEVICE_API_URL
    private val API_KEY = BuildConfig.AWS_DEVICE_API_KEY
    private const val TAG = "DogAndBone"
    private const val PREFS_NAME = "update_checker"
    private const val KEY_PENDING_MANIFEST = "pending_manifest"
    private const val INSTALL_ACTION = "com.dogandbonephone.launcher.INSTALL_RESULT"

    data class ReleaseManifest(
        val versionCode: Int,
        val versionName: String,
        val apkUrl: String,
        val sha256: String,
        val releaseNotes: String,
    ) {
        companion object {
            fun fromJson(json: String): ReleaseManifest {
                val obj = JSONObject(json)
                return ReleaseManifest(
                    versionCode = obj.getInt("versionCode"),
                    versionName = obj.getString("versionName"),
                    apkUrl = obj.getString("apkUrl"),
                    sha256 = obj.getString("sha256"),
                    releaseNotes = obj.optString("releaseNotes", ""),
                )
            }
        }

        fun toJson(): String = JSONObject().apply {
            put("versionCode", versionCode)
            put("versionName", versionName)
            put("apkUrl", apkUrl)
            put("sha256", sha256)
            put("releaseNotes", releaseNotes)
        }.toString()
    }

    /**
     * Fetch the latest release manifest. If newer than us, persist it and return it.
     * Returns null if no update is available or the check failed.
     */
    suspend fun checkForUpdate(context: Context): ReleaseManifest? {
        if (API_URL.isBlank() || API_KEY.isBlank()) return null

        return withContext(Dispatchers.IO) {
            try {
                val url = URL("$API_URL/releases/latest")
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                connection.setRequestProperty("x-api-key", API_KEY)
                connection.connectTimeout = 10_000
                connection.readTimeout = 10_000

                when (connection.responseCode) {
                    200 -> {
                        val body = connection.inputStream.bufferedReader().readText()
                        val manifest = ReleaseManifest.fromJson(body)
                        if (manifest.versionCode > BuildConfig.VERSION_CODE) {
                            Log.d(TAG, "Update available: ${manifest.versionName} (${manifest.versionCode})")
                            savePendingManifest(context, manifest)
                            manifest
                        } else {
                            Log.d(TAG, "No update (installed=${BuildConfig.VERSION_CODE}, latest=${manifest.versionCode})")
                            clearPendingManifest(context)
                            null
                        }
                    }
                    404 -> {
                        Log.d(TAG, "No release manifest published")
                        null
                    }
                    else -> {
                        Log.w(TAG, "Update check failed: HTTP ${connection.responseCode}")
                        null
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Update check error", e)
                null
            }
        }
    }

    fun getPendingManifest(context: Context): ReleaseManifest? {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(KEY_PENDING_MANIFEST, null) ?: return null
        val manifest = try {
            ReleaseManifest.fromJson(json)
        } catch (e: Exception) {
            Log.w(TAG, "Corrupt pending manifest, clearing", e)
            clearPendingManifest(context)
            return null
        }
        // Self-heal: if the installed version already meets or exceeds the pending
        // manifest, clear it. Handles the case where InstallResultReceiver fires in
        // the old process (pre-update) and its clear doesn't survive to the new one,
        // or the user sideloaded the update via adb.
        if (BuildConfig.VERSION_CODE >= manifest.versionCode) {
            Log.d(TAG, "Pending manifest (${manifest.versionCode}) already satisfied by installed (${BuildConfig.VERSION_CODE}) — clearing")
            clearPendingManifest(context)
            return null
        }
        return manifest
    }

    private fun savePendingManifest(context: Context, manifest: ReleaseManifest) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_PENDING_MANIFEST, manifest.toJson())
            .apply()
    }

    fun clearPendingManifest(context: Context) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .remove(KEY_PENDING_MANIFEST)
            .apply()
    }

    /**
     * Download the APK from the manifest's presigned URL, verify SHA-256, and invoke
     * PackageInstaller. Call from the UI thread's lifecycleScope after the user confirms.
     *
     * Returns true if the install session was successfully committed (the OS then handles
     * the actual replacement). Returns false on download/verification failure.
     */
    suspend fun downloadAndInstall(context: Context, manifest: ReleaseManifest): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                val apkFile = File(context.cacheDir, "update-${manifest.versionCode}.apk")
                apkFile.delete() // clear any partial download

                Log.d(TAG, "Downloading APK for v${manifest.versionName}")
                val connection = URL(manifest.apkUrl).openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                connection.connectTimeout = 30_000
                connection.readTimeout = 60_000

                if (connection.responseCode != 200) {
                    Log.e(TAG, "APK download failed: HTTP ${connection.responseCode}")
                    return@withContext false
                }

                connection.inputStream.use { input ->
                    apkFile.outputStream().use { output ->
                        input.copyTo(output)
                    }
                }
                Log.d(TAG, "APK downloaded: ${apkFile.length()} bytes")

                // Verify SHA-256
                val actualHash = sha256(apkFile)
                if (!actualHash.equals(manifest.sha256, ignoreCase = true)) {
                    Log.e(TAG, "APK hash mismatch: expected=${manifest.sha256} actual=$actualHash")
                    apkFile.delete()
                    return@withContext false
                }
                Log.d(TAG, "APK hash verified")

                commitInstall(context, apkFile, manifest.versionCode)
                true
            } catch (e: Exception) {
                Log.e(TAG, "APK install error", e)
                false
            }
        }
    }

    private fun commitInstall(context: Context, apkFile: File, versionCode: Int) {
        val installer = context.packageManager.packageInstaller
        val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
        params.setAppPackageName(context.packageName)

        val sessionId = installer.createSession(params)
        val session = installer.openSession(sessionId)

        apkFile.inputStream().use { input ->
            session.openWrite("launcher-$versionCode.apk", 0, apkFile.length()).use { output ->
                input.copyTo(output)
                session.fsync(output)
            }
        }

        val intent = Intent(INSTALL_ACTION).setPackage(context.packageName)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            sessionId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE,
        )

        session.commit(pendingIntent.intentSender)
        session.close()
        Log.d(TAG, "Install session committed (id=$sessionId)")
    }

    private fun sha256(file: File): String {
        val digest = MessageDigest.getInstance("SHA-256")
        file.inputStream().use { input ->
            val buffer = ByteArray(8192)
            while (true) {
                val n = input.read(buffer)
                if (n <= 0) break
                digest.update(buffer, 0, n)
            }
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }
}
