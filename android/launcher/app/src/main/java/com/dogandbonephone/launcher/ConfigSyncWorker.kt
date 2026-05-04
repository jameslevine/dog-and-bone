package com.dogandbonephone.launcher

import android.content.Context
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

/**
 * ConfigSyncWorker - Periodically checks for remote configuration updates
 * Runs every hour to fetch latest config from AWS and apply changes
 */
class ConfigSyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        try {
            // Check for remote config updates
            val newConfig = DeviceRegistration.checkForConfigUpdates(applicationContext)

            if (newConfig != null) {
                // Save new config to external storage
                val file = File(
                    applicationContext.getExternalFilesDir(null),
                    "app-config.json"
                )
                file.writeText(newConfig)

                Log.d("DogAndBone", "Remote config updated - will apply on next launcher restart")
                Result.success()
            } else {
                // No updates available
                Log.d("DogAndBone", "No remote config updates")
                Result.success()
            }
        } catch (e: Exception) {
            Log.e("DogAndBone", "Config sync error", e)
            // Retry on failure (internet might be down)
            Result.retry()
        }
    }
}
