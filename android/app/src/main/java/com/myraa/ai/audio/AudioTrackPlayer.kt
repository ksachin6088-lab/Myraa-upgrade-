package com.myraa.ai.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.util.concurrent.LinkedBlockingQueue
import kotlin.math.sqrt

/**
 * AudioTrackPlayer streams PCM 16-bit 24kHz/16kHz audio received from Gemini Live API
 * in real time with minimal latency.
 */
class AudioTrackPlayer {

    private val sampleRate = 24000 // Gemini default audio output is 24kHz PCM16
    private var audioTrack: AudioTrack? = null
    private val audioQueue = LinkedBlockingQueue<ByteArray>()
    private var playbackJob: Job? = null

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying

    private val _outputLevel = MutableStateFlow(0f)
    val outputLevel: StateFlow<Float> = _outputLevel

    fun startPlayback(scope: CoroutineScope) {
        if (_isPlaying.value) return

        val minBufferSize = AudioTrack.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_OUT_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        )

        try {
            audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                        .build()
                )
                .setBufferSizeInBytes(maxOf(minBufferSize, 4096))
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()

            audioTrack?.play()
            _isPlaying.value = true

            playbackJob = scope.launch(Dispatchers.IO) {
                while (isActive && _isPlaying.value) {
                    val chunk = audioQueue.poll()
                    if (chunk != null) {
                        audioTrack?.write(chunk, 0, chunk.size)

                        // Calculate RMS level
                        val rms = calculateRms(chunk)
                        _outputLevel.value = (rms / 32768f).coerceIn(0f, 1f)
                    } else {
                        _outputLevel.value = 0f
                        Thread.sleep(10)
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("AudioTrackPlayer", "Error initializing AudioTrack: ${e.message}", e)
        }
    }

    fun playChunk(pcmData: ByteArray) {
        audioQueue.offer(pcmData)
    }

    fun stopPlayback() {
        _isPlaying.value = false
        audioQueue.clear()
        playbackJob?.cancel()
        playbackJob = null

        try {
            audioTrack?.stop()
            audioTrack?.release()
        } catch (e: Exception) {
            Log.e("AudioTrackPlayer", "Error stopping AudioTrack", e)
        } finally {
            audioTrack = null
            _outputLevel.value = 0f
        }
    }

    fun clearQueue() {
        audioQueue.clear()
        _outputLevel.value = 0f
    }

    private fun calculateRms(buffer: ByteArray): Float {
        var sum = 0.0
        var i = 0
        while (i < buffer.size - 1) {
            val sample = (buffer[i].toInt() and 0xFF) or (buffer[i + 1].toInt() shl 8)
            val shortSample = sample.toShort()
            sum += shortSample * shortSample
            i += 2
        }
        val count = buffer.size / 2
        return if (count > 0) sqrt(sum / count).toFloat() else 0f
    }
}
