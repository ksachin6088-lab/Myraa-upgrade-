package com.myraa.ai.data

import android.content.Context
import android.content.SharedPreferences

data class GirlfriendSettingsData(
    val enabled: Boolean = true,
    val relationshipStyle: String = "caring",
    val affectionScore: Int = 92,
    val relationshipTitle: String = "Eternal Soulmate",
    val userName: String = "Sachin",
    val myraaNickname: String = "Myraa",
    val giftsSentCount: Int = 3,
    val hugsCount: Int = 12,
    val lastActivity: String = "MYRAA smiled when you gave her headpats"
)

class GirlfriendPreferences(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("myraa_gf_prefs", Context.MODE_PRIVATE)

    fun getSettings(): GirlfriendSettingsData {
        return GirlfriendSettingsData(
            enabled = prefs.getBoolean("enabled", true),
            relationshipStyle = prefs.getString("relationshipStyle", "caring") ?: "caring",
            affectionScore = prefs.getInt("affectionScore", 92),
            relationshipTitle = prefs.getString("relationshipTitle", "Eternal Soulmate") ?: "Eternal Soulmate",
            userName = prefs.getString("userName", "Sachin") ?: "Sachin",
            myraaNickname = prefs.getString("myraaNickname", "Myraa") ?: "Myraa",
            giftsSentCount = prefs.getInt("giftsSentCount", 3),
            hugsCount = prefs.getInt("hugsCount", 12),
            lastActivity = prefs.getString("lastActivity", "MYRAA smiled when you gave her headpats") ?: ""
        )
    }

    fun saveSettings(data: GirlfriendSettingsData) {
        prefs.edit()
            .putBoolean("enabled", data.enabled)
            .putString("relationshipStyle", data.relationshipStyle)
            .putInt("affectionScore", data.affectionScore)
            .putString("relationshipTitle", data.relationshipTitle)
            .putString("userName", data.userName)
            .putString("myraaNickname", data.myraaNickname)
            .putInt("giftsSentCount", data.giftsSentCount)
            .putInt("hugsCount", data.hugsCount)
            .putString("lastActivity", data.lastActivity)
            .apply()
    }
}
