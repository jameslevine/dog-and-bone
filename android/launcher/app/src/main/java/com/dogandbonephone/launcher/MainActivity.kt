package com.dogandbonephone.launcher

import android.app.admin.DevicePolicyManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.lifecycle.lifecycleScope
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.dogandbonephone.launcher.databinding.ActivityMainBinding
import kotlinx.coroutines.launch
import java.util.concurrent.TimeUnit

/**
 * The main Dog and Bone launcher activity.
 *
 * Lock-down behaviour:
 *  - Registered as HOME so it is the default launcher after "Always" is chosen
 *  - Back button swallowed — no exit
 *  - Recents (app switcher) button swallowed — no task switching
 *  - Immersive sticky fullscreen — system bars auto-hide on touch
 *  - onWindowFocusChanged re-applies immersive mode when notification shade closes
 *  - BootReceiver launches us on every device restart
 *  - FLAG_KEEP_SCREEN_ON keeps display active on home screen
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var config: AppConfig
    private lateinit var pinManager: PinLockManager
    private lateinit var emergencyButton: EmergencyButton

    // Receiver to re-assert our window when the notification shade is dismissed
    private val systemDialogReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (intent.action == Intent.ACTION_CLOSE_SYSTEM_DIALOGS) {
                hideSystemUI()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Keep screen on while on the home screen
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Load config FIRST (needed for lock-task whitelist)
        config = AppConfig.load(this)
        pinManager = PinLockManager(this)
        emergencyButton = EmergencyButton(this, config)

        // If we are Device Owner, enable full lock-task kiosk mode.
        // This completely blocks the notification shade, status bar, and recents.
        enableLockTaskIfDeviceOwner()

        setupAppGrid()
        setupEmergencyButton()
        setupPinFirstRun()

        // Apply large text mode for senior profile
        if (config.largeText) {
            applyLargeTextMode()
        }

        // Register device with AWS backend (async, fails silently if no internet).
        // Also do a one-shot config fetch at cold-start so the first pull doesn't
        // have to wait for the hourly worker. Subsequent fetches happen in
        // ConfigSyncWorker; the onResume path picks up whichever write landed most
        // recently (either from this call or the worker).
        lifecycleScope.launch {
            DeviceRegistration.registerDevice(this@MainActivity, config)
            val fetched = DeviceRegistration.checkForConfigUpdates(this@MainActivity)
            if (fetched != null) {
                java.io.File(getExternalFilesDir(null), "app-config.json").writeText(fetched)
            }
            // Check for launcher self-updates. If a newer manifest exists we refresh the
            // banner immediately — otherwise the user would have to background+foreground
            // the app (triggering onResume) before seeing it.
            UpdateChecker.checkForUpdate(this@MainActivity)
            refreshUpdateBanner()
        }

        // Schedule periodic config sync (interval comes from AppConfig, default 60 min)
        scheduleConfigSync(config.configSyncIntervalMinutes, ExistingPeriodicWorkPolicy.KEEP)

        // Banner tap -> show install confirmation dialog
        binding.updateBanner.setOnClickListener { showUpdateDialog() }

        // Populate the version tag shown below the date
        binding.versionTag.text = "v${BuildConfig.VERSION_NAME}"
    }

    // Config sync strategy:
    //   1. Cold-start fetch in onCreate() — pulls latest config within ~1s of launch
    //   2. onResume reload — picks up any config written to disk without a restart
    //   3. This periodic worker — background pull at AppConfig.configSyncIntervalMinutes
    //      (default 60 min). onResume also re-enqueues this worker with UPDATE policy
    //      when the interval in the config changes, so an operator can remotely dial
    //      the cadence up or down (bench device: 15 min, shipped device: 24 h).
    //
    // Testing note: `adb shell cmd jobscheduler run -f com.dogandbonephone.launcher <id>`
    // does NOT trigger the worker early. The -f flag overrides battery/connectivity
    // constraints but not TIMING_DELAY, and periodic jobs persist their next-run
    // timestamp across cancel/re-enqueue. To test the worker path, either wait for
    // the natural hourly cycle, or invoke DeviceRegistration.checkForConfigUpdates()
    // directly (as onCreate already does).
    private fun scheduleConfigSync(
        intervalMinutes: Long,
        policy: ExistingPeriodicWorkPolicy,
    ) {
        val syncWorkRequest = PeriodicWorkRequestBuilder<ConfigSyncWorker>(
            intervalMinutes, TimeUnit.MINUTES
        ).build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "config-sync",
            policy,
            syncWorkRequest,
        )
    }

    private fun applyLargeTextMode() {
        // Increase system font scale for this activity (app labels)
        val configuration = resources.configuration
        configuration.fontScale = 1.5f  // 1.5x larger text for senior profile
        @Suppress("DEPRECATION")
        resources.updateConfiguration(configuration, resources.displayMetrics)

        // Also increase clock and date text size
        binding.clock.textSize = 52f * 1.5f  // Time: 78sp
        binding.date.textSize = 16f * 1.5f   // Date: 24sp
    }

    override fun onResume() {
        super.onResume()
        hideSystemUI()

        // Re-read config on every resume so remote-config updates written by
        // ConfigSyncWorker become visible without requiring a restart.
        val updated = AppConfig.load(this)
        if (updated != config) {
            val intervalChanged = updated.configSyncIntervalMinutes != config.configSyncIntervalMinutes
            config = updated
            if (config.largeText) applyLargeTextMode()
            if (intervalChanged) {
                android.util.Log.d(
                    "DogAndBone",
                    "Config sync interval changed to ${config.configSyncIntervalMinutes} min — rescheduling worker",
                )
                scheduleConfigSync(config.configSyncIntervalMinutes, ExistingPeriodicWorkPolicy.UPDATE)
            }
        }

        setupAppGrid()
        refreshUpdateBanner()

        @Suppress("DEPRECATION")
        registerReceiver(systemDialogReceiver, IntentFilter(Intent.ACTION_CLOSE_SYSTEM_DIALOGS))
    }

    private fun refreshUpdateBanner() {
        val manifest = UpdateChecker.getPendingManifest(this)
        if (manifest == null) {
            binding.updateBanner.visibility = View.GONE
        } else {
            binding.updateBanner.visibility = View.VISIBLE
            binding.updateBannerVersion.text = getString(
                R.string.update_banner_version_format,
                manifest.versionName,
            )
        }
    }

    private fun showUpdateDialog() {
        val manifest = UpdateChecker.getPendingManifest(this) ?: return
        val message = buildString {
            append("Version ${manifest.versionName}")
            if (manifest.releaseNotes.isNotBlank()) {
                append("\n\n")
                append(manifest.releaseNotes)
            }
        }
        AlertDialog.Builder(this)
            .setTitle(R.string.update_dialog_title)
            .setMessage(message)
            .setPositiveButton(R.string.update_dialog_install) { _, _ ->
                startInstall(manifest)
            }
            .setNegativeButton(R.string.update_dialog_later, null)
            .show()
    }

    private fun startInstall(manifest: UpdateChecker.ReleaseManifest) {
        binding.updateBannerVersion.setText(R.string.update_downloading)
        lifecycleScope.launch {
            val success = UpdateChecker.downloadAndInstall(this@MainActivity, manifest)
            if (!success) {
                binding.updateBannerVersion.setText(R.string.update_failed)
            }
            // On success, InstallResultReceiver clears the pending manifest; the banner
            // goes away on next onResume (which fires when the install finishes because
            // the activity is recreated with the new APK).
        }
    }

    override fun onPause() {
        super.onPause()
        try { unregisterReceiver(systemDialogReceiver) } catch (_: Exception) {}
    }

    // ----- Device Owner / Lock Task -----

    private fun enableLockTaskIfDeviceOwner() {
        val dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val adminComponent = ComponentName(this, AdminReceiver::class.java)
        if (dpm.isDeviceOwnerApp(packageName)) {
            // Whitelist our package AND all configured apps for lock task mode
            // This allows users to launch and use the whitelisted apps
            // Also include system packages for calls, SMS, contacts
            val systemPackages = listOf(
                "com.android.server.telecom",  // Emergency call handling
                "com.android.incallui",        // In-call UI
                "com.android.dialer",          // Dialer
                "com.android.contacts",        // Contacts picker
                "com.android.phone",           // Phone system
                "com.android.mms",             // MMS/SMS system
                "com.android.settings"         // Settings (for emergency access)
            )
            val whitelistedPackages = listOf(packageName) + config.apps + systemPackages
            dpm.setLockTaskPackages(adminComponent, whitelistedPackages.distinct().toTypedArray())

            // Disable key guard (removes navigation bar entirely if possible)
            dpm.setKeyguardDisabled(adminComponent, true)

            startLockTask()
        }
    }

    // ----- Immersive fullscreen -----

    private fun hideSystemUI() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.let { ctrl ->
                ctrl.hide(WindowInsets.Type.systemBars())
                ctrl.systemBarsBehavior =
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = (
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                or View.SYSTEM_UI_FLAG_FULLSCREEN
            )
        }
    }

    // Re-hide system bars whenever our window regains focus
    // (e.g. after notification shade is dismissed)
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) hideSystemUI()
    }

    // ----- App grid -----

    private fun setupAppGrid() {
        val items = AppGridAdapter.buildItems(this, config.apps)
        val adapter = AppGridAdapter(this, items)
        binding.appGrid.apply {
            layoutManager = GridLayoutManager(this@MainActivity, GRID_COLUMNS)
            this.adapter = adapter
        }
    }

    // ----- Emergency button -----

    private fun setupEmergencyButton() {
        emergencyButton.attachTo(binding.emergencyButton)
    }

    // ----- PIN first-run (Family profile) -----

    private fun setupPinFirstRun() {
        if (config.pinEnabled && !pinManager.isPinEnabled()) {
            startActivity(Intent(this, PinLockActivity::class.java).apply {
                putExtra(PinLockActivity.EXTRA_MODE, PinLockActivity.MODE_SETUP)
            })
        }
    }

    // ----- Hardware button overrides -----

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // Swallow back — no exit from the launcher
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        return when (keyCode) {
            KeyEvent.KEYCODE_HOME -> true           // Already handled as HOME app, belt-and-braces
            KeyEvent.KEYCODE_APP_SWITCH -> true     // Block recents / task switcher
            KeyEvent.KEYCODE_MENU -> true           // Block overflow menu
            else -> super.onKeyDown(keyCode, event)
        }
    }

    companion object {
        private const val GRID_COLUMNS = 3
    }
}
