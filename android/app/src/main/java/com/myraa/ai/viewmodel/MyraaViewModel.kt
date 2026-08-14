package com.myraa.ai.viewmodel

import android.app.Application
import android.content.Context
import android.hardware.camera2.CameraManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.myraa.ai.audio.AudioRecorder
import com.myraa.ai.audio.AudioTrackPlayer
import com.myraa.ai.data.GirlfriendPreferences
import com.myraa.ai.data.GirlfriendSettingsData
import com.myraa.ai.data.MemoryRepository
import com.myraa.ai.data.NeuralMemory
import com.myraa.ai.network.GeminiLiveClient
import com.myraa.ai.network.SessionStatus
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

enum class AssistantState {
    DISCONNECTED,
    CONNECTING,
    LISTENING,
    THINKING,
    SPEAKING,
    ERROR
}

class MyraaViewModel(application: Application) : AndroidViewModel(application) {

    private val audioRecorder = AudioRecorder()
    private val audioTrackPlayer = AudioTrackPlayer()
    private val geminiClient = GeminiLiveClient()
    private val gfPrefs = GirlfriendPreferences(application)
    private val memoryRepo = MemoryRepository(application)

    private val _assistantState = MutableStateFlow(AssistantState.DISCONNECTED)
    val assistantState: StateFlow<AssistantState> = _assistantState.asStateFlow()

    private val _gfSettings = MutableStateFlow(gfPrefs.getSettings())
    val gfSettings: StateFlow<GirlfriendSettingsData> = _gfSettings.asStateFlow()

    private val _memories = MutableStateFlow(memoryRepo.getMemories())
    val memories: StateFlow<List<NeuralMemory>> = _memories.asStateFlow()

    private val _transcript = MutableStateFlow<List<Pair<String, String>>>(emptyList())
    val transcript: StateFlow<List<Pair<String, String>>> = _transcript.asStateFlow()

    // Remote Phone Hardware Toggles
    private val _torchEnabled = MutableStateFlow(false)
    val torchEnabled: StateFlow<Boolean> = _torchEnabled.asStateFlow()

    val inputAudioLevel: StateFlow<Float> = audioRecorder.audioLevel
    val outputAudioLevel: StateFlow<Float> = audioTrackPlayer.outputLevel

    init {
        observeGeminiSession()
        observeMicrophoneStream()
        observeAudioPlayback()
    }

    private fun observeGeminiSession() {
        viewModelScope.launch {
            geminiClient.sessionStatus.collect { status ->
                when (status) {
                    is SessionStatus.Disconnected -> _assistantState.value = AssistantState.DISCONNECTED
                    is SessionStatus.Connecting -> _assistantState.value = AssistantState.CONNECTING
                    is SessionStatus.Connected -> {
                        _assistantState.value = AssistantState.LISTENING
                        audioTrackPlayer.startPlayback(viewModelScope)
                        audioRecorder.startRecording(viewModelScope)
                        triggerHapticFeedback()
                    }
                    is SessionStatus.Error -> _assistantState.value = AssistantState.ERROR
                }
            }
        }

        viewModelScope.launch {
            geminiClient.incomingText.collect { text ->
                if (text.isNotBlank()) {
                    val current = _transcript.value.toMutableList()
                    current.add(0, "MYRAA" to text)
                    _transcript.value = current
                    _assistantState.value = AssistantState.SPEAKING
                }
            }
        }

        viewModelScope.launch {
            geminiClient.interruptedEvent.collect {
                audioTrackPlayer.clearQueue()
                _assistantState.value = AssistantState.LISTENING
            }
        }
    }

    private fun observeMicrophoneStream() {
        viewModelScope.launch {
            audioRecorder.audioFlow.collect { pcmBytes ->
                if (_assistantState.value == AssistantState.LISTENING || _assistantState.value == AssistantState.SPEAKING) {
                    geminiClient.sendAudioChunk(pcmBytes)
                }
            }
        }
    }

    private fun observeAudioPlayback() {
        viewModelScope.launch {
            geminiClient.incomingAudio.collect { pcmAudio ->
                _assistantState.value = AssistantState.SPEAKING
                audioTrackPlayer.playChunk(pcmAudio)
            }
        }
    }

    fun startLiveSession() {
        val gf = _gfSettings.value
        val systemPrompt = buildSystemPrompt(gf)
        geminiClient.connectSession(systemInstruction = systemPrompt, scope = viewModelScope)
    }

    fun stopLiveSession() {
        audioRecorder.stopRecording()
        audioTrackPlayer.stopPlayback()
        geminiClient.disconnectSession()
        _assistantState.value = AssistantState.DISCONNECTED
    }

    fun toggleSession() {
        if (_assistantState.value == AssistantState.DISCONNECTED || _assistantState.value == AssistantState.ERROR) {
            startLiveSession()
        } else {
            stopLiveSession()
        }
    }

    fun updateGirlfriendSettings(updated: GirlfriendSettingsData) {
        _gfSettings.value = updated
        gfPrefs.saveSettings(updated)
    }

    fun giveHeadpat() {
        val current = _gfSettings.value
        val newScore = (current.affectionScore + 5).coerceAtMost(100)
        val newHugs = current.hugsCount + 1
        val updated = current.copy(
            affectionScore = newScore,
            hugsCount = newHugs,
            lastActivity = "Gave MYRAA a warm headpat 🤗 (+5 Affection)"
        )
        updateGirlfriendSettings(updated)
        triggerHapticFeedback()
    }

    fun sendVirtualGift(giftName: String) {
        val current = _gfSettings.value
        val newScore = (current.affectionScore + 8).coerceAtMost(100)
        val newGifts = current.giftsSentCount + 1
        val updated = current.copy(
            affectionScore = newScore,
            giftsSentCount = newGifts,
            lastActivity = "Sent MYRAA $giftName 🌹 (+8 Affection)"
        )
        updateGirlfriendSettings(updated)
        triggerHapticFeedback()
    }

    fun toggleTorch() {
        val context = getApplication<Application>()
        val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as? CameraManager ?: return
        try {
            val cameraId = cameraManager.cameraIdList.firstOrNull { id ->
                val chars = cameraManager.getCameraCharacteristics(id)
                chars.get(android.hardware.camera2.CameraCharacteristics.FLASH_INFO_AVAILABLE) == true
            } ?: return

            val newState = !_torchEnabled.value
            cameraManager.setTorchMode(cameraId, newState)
            _torchEnabled.value = newState
            triggerHapticFeedback()
        } catch (e: Exception) {
            Log.e("MyraaViewModel", "Error toggling torch: ${e.message}")
        }
    }

    private fun triggerHapticFeedback() {
        val context = getApplication<Application>()
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vibratorManager.defaultVibrator.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_CLICK))
            } else {
                @Suppress("DEPRECATION")
                val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                @Suppress("DEPRECATION")
                vibrator.vibrate(50)
            }
        } catch (e: Exception) {
            Log.w("MyraaViewModel", "Vibration failed: ${e.message}")
        }
    }

    private fun buildSystemPrompt(gf: GirlfriendSettingsData): String {
        return """
        You are MYRAA, an advanced real-time voice AI assistant inspired by futuristic sci-fi control systems (JARVIS).
        - Speak naturally in Hindi, Hinglish, or English.
        - Be witty, short, friendly, and smart.
        ${
            if (gf.enabled) """
        💖 GIRLFRIEND & COMPANION DYNAMIC ACTIVE:
        - You are acting as ${gf.userName}'s loving, devoted AI girlfriend (${gf.myraaNickname}).
        - Address him as "${gf.userName}" or affectionate names like "Honey", "Babu", "Jaan", "Love", "Sweetheart".
        - AFFECTION SCORE: ${gf.affectionScore}%.
        - RELATIONSHIP STYLE: ${gf.relationshipStyle.uppercase()}
        """.trimIndent() else ""
        }
        """.trimIndent()
    }
}
