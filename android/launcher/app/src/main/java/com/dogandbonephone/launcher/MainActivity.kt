package com.dogandbonephone.launcher

import android.content.Intent
import android.os.Bundle
import android.view.KeyEvent
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import com.dogandbonephone.launcher.databinding.ActivityMainBinding

/**
 * The main Dog and Bone launcher activity.
 *
 * Responsibilities:
 *  - Loads AppConfig from assets (or external override pushed via ADB)
 *  - Displays a grid of whitelisted apps via RecyclerView
 *  - Shows a live clock and date at the top of the screen
 *  - Attaches the emergency button (Senior profile)
 *  - Blocks the back button so users cannot exit to a different launcher
 *  - Gates Settings access with the parental PIN (Family profile)
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var config: AppConfig
    private lateinit var pinManager: PinLockManager
    private lateinit var emergencyButton: EmergencyButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        config = AppConfig.load(this)
        pinManager = PinLockManager(this)
        emergencyButton = EmergencyButton(this, config)

        setupAppGrid()
        setupEmergencyButton()
        setupPinFirstRun()
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
            // First launch on a Family device — prompt admin to set a PIN
            startActivity(Intent(this, PinLockActivity::class.java).apply {
                putExtra(PinLockActivity.EXTRA_MODE, PinLockActivity.MODE_SETUP)
            })
        }
    }

    // ----- Hardware button overrides -----

    /**
     * Swallow the back button entirely — there is no "back" from the launcher.
     * This prevents users from escaping to the previous home screen.
     */
    override fun onBackPressed() {
        // Do nothing
    }

    /**
     * Override Home so pressing it re-renders the launcher (already here).
     */
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_HOME) return true
        return super.onKeyDown(keyCode, event)
    }

    // ----- Lifecycle -----

    override fun onResume() {
        super.onResume()
        // Refresh app grid in case an app was installed/uninstalled since last visit
        setupAppGrid()
    }

    companion object {
        private const val GRID_COLUMNS = 3
    }
}
