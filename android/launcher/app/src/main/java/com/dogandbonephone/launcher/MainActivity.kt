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

        // Register device with AWS backend (async, fails silently if no internet)
        lifecycleScope.launch {
            DeviceRegistration.registerDevice(this@MainActivity, config)
        }

        // Schedule periodic config sync (every hour)
        scheduleConfigSync()
    }

    private fun scheduleConfigSync() {
        val syncWorkRequest = PeriodicWorkRequestBuilder<ConfigSyncWorker>(
            1, TimeUnit.HOURS
        ).build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "config-sync",
            ExistingPeriodicWorkPolicy.KEEP,
            syncWorkRequest
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
        setupAppGrid()

        @Suppress("DEPRECATION")
        registerReceiver(systemDialogReceiver, IntentFilter(Intent.ACTION_CLOSE_SYSTEM_DIALOGS))
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
