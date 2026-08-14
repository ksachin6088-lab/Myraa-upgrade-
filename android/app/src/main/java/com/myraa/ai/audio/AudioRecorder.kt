package com.myraa.ai.audio

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlin.math.sqrt

/**
 * AudioRecorder captures 16kHz PCM 16-bit mono audio from the microphone
 * and streams it in real time for Gemini Live API WebSocket input.
 */
class AudioRecorder {

    private val sampleRate = 16000
    private val channelConfig = AudioFormat.CHANNEL_IN_MONO
    private val audioFormat = AudioFormat.ENCODING_PCM_16BIT

    private var audioRecord: AudioRecord? = null
    private var recordingJob: Job? = null

    private val _audioFlow = MutableSharedFlow<ByteArray>(extraBufferCapacity = 64)
    val audioFlow: SharedFlow<ByteArray> = _audioFlow

    private val _audioLevel = MutableStateFlow(0f)
    val audioLevel: StateFlow<Float> = _audioLevel

    private val _isRecording = MutableStateFlow(false)
    val isRecording: StateFlow<Boolean> = _isRecording

    @SuppressLint("MissingPermission")
    fun startRecording(scope: CoroutineScope) {
        if (_isRecording.value) return

        val minBufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)
        val bufferSize = maxOf(minBufferSize, 2048)

        try {
            audioRecord = AudioRecord(
                MediaRecorder.AudioSource.MIC,
                sampleRate,
                channelConfig,
                audioFormat,
                bufferSize
            )

            if (audioRecord?.state != AudioRecord.STATE_INITIALIZED) {
                Log.e("AudioRecorder", "AudioRecord initialization failed")
                return
            }

            audioRecord?.startRecording()
            _isRecording.value = true

            recordingJob = scope.launch(Dispatchers.IO) {
                val buffer = ByteArray(1024)
                while (isActive && _isRecording.value) {
                    val readBytes = audioRecord?.read(buffer, 0, buffer.size) ?: 0
                    if (readBytes > 0) {
                        val chunk = buffer.copyOf(readBytes)
                        _audioFlow.emit(chunk)

                        // Calculate RMS for audio level visualizer
                        val rms = calculateRms(chunk, readBytes)
                        _audioLevel.value = (rms / 32768f).coerceIn(0f, 1f)
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("AudioRecorder", "Error starting recording: ${e.message}", e)
            stopRecording()
        }
    }

    fun stopRecording() {
        _isRecording.value = false
        recordingJob?.cancel()
        recordingJob = null

        try {
            audioRecord?.stop()
            audioRecord?.release()
        } catch (e: Exception) {
            Log.e("AudioRecorder", "Error stopping AudioRecord", e)
        } finally {
            audioRecord = null
            _audioLevel.value = 0f
        }
    }

    private fun calculateRms(buffer: ByteArray, size: Int): Float {
        var sum = 0.0
        var i = 0
        while (i < size - 1) {
            val sample = (buffer[i].toInt() and 0xFF) or (buffer[i + 1].toInt() shl 8)
            val shortSample = sample.toShort()
            sum += shortSample * shortSample
            i += 2
        }
        val count = size / 2
        return if (count > 0) sqrt(sum / count).toFloat() else 0f
    }
}
