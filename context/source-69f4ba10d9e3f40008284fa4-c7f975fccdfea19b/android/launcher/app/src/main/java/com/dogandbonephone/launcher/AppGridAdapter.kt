package com.dogandbonephone.launcher

import android.content.Context
import android.content.pm.PackageManager
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

/**
 * Displays the whitelisted apps as a grid of icon + label tiles.
 *
 * Long-press is intentionally disabled — users cannot rearrange or
 * remove apps from the launcher.
 */
class AppGridAdapter(
    private val context: Context,
    private val items: List<AppItem>,
) : RecyclerView.Adapter<AppGridAdapter.AppViewHolder>() {

    data class AppItem(
        val packageName: String,
        val label: String,
    )

    inner class AppViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val icon: ImageView = itemView.findViewById(R.id.appIcon)
        val label: TextView = itemView.findViewById(R.id.appLabel)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AppViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_app, parent, false)
        return AppViewHolder(view)
    }

    override fun onBindViewHolder(holder: AppViewHolder, position: Int) {
        val app = items[position]
        holder.label.text = app.label

        // Load icon from PackageManager — no external image loading needed
        try {
            val pm = context.packageManager
            holder.icon.setImageDrawable(pm.getApplicationIcon(app.packageName))
        } catch (e: PackageManager.NameNotFoundException) {
            holder.icon.setImageResource(android.R.drawable.sym_def_app_icon)
        }

        // Launch the app on tap
        holder.itemView.setOnClickListener {
            val launchIntent = context.packageManager
                .getLaunchIntentForPackage(app.packageName)
            if (launchIntent != null) {
                context.startActivity(launchIntent)
            }
        }

        // Long-press disabled — no app management from launcher
        holder.itemView.setOnLongClickListener { true }
    }

    override fun getItemCount(): Int = items.size

    companion object {
        /**
         * Builds the item list from a package whitelist.
         * Packages that are not installed (or disabled) are silently excluded.
         */
        fun buildItems(context: Context, packageNames: List<String>): List<AppItem> {
            val pm = context.packageManager
            return packageNames.mapNotNull { pkg ->
                try {
                    val info = pm.getApplicationInfo(pkg, 0)
                    AppItem(
                        packageName = pkg,
                        label = pm.getApplicationLabel(info).toString(),
                    )
                } catch (e: PackageManager.NameNotFoundException) {
                    null // package not installed — skip silently
                }
            }
        }
    }
}
