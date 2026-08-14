package com.myraa.ai.data

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

data class NeuralMemory(
    val id: String,
    val key: String,
    val value: String,
    val category: String,
    val timestamp: Long = System.currentTimeMillis()
)

class MemoryRepository(context: Context) {
    private val prefs = context.getSharedPreferences("myraa_memories", Context.MODE_PRIVATE)
    private val gson = Gson()

    fun getMemories(): List<NeuralMemory> {
        val json = prefs.getString("memories_list", null) ?: return defaultMemories()
        val type = object : TypeToken<List<NeuralMemory>>() {}.type
        return try {
            gson.fromJson(json, type)
        } catch (e: Exception) {
            defaultMemories()
        }
    }

    fun addMemory(memory: NeuralMemory) {
        val list = getMemories().toMutableList()
        list.add(0, memory)
        prefs.edit().putString("memories_list", gson.toJson(list)).apply()
    }

    private fun defaultMemories(): List<NeuralMemory> {
        return listOf(
            NeuralMemory("1", "User Preferred Name", "Sachin", "preference"),
            NeuralMemory("2", "Primary Language", "Hindi / Hinglish / English", "preference"),
            NeuralMemory("3", "System Persona", "MYRAA Sci-Fi Voice Companion", "system")
        )
    }
}
