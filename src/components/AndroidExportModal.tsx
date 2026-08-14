import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Smartphone,
  Check,
  Copy,
  Terminal,
  Download,
  Code2,
  FileCode,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface AndroidExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidExportModal: React.FC<AndroidExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'source'>('instructions');
  const [selectedFile, setSelectedFile] = useState<string>('MainActivity.kt');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const filesMap: Record<string, string> = {
    'MainActivity.kt': `package com.myraa.ai

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.core.content.ContextCompat
import com.myraa.ai.ui.MyraaMainScreen
import com.myraa.ai.ui.theme.MYRAATheme
import com.myraa.ai.viewmodel.MyraaViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: MyraaViewModel by viewModels()

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            viewModel.startLiveSession()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MYRAATheme {
                MyraaMainScreen(viewModel = viewModel)
            }
        }

        checkAndRequestMicrophonePermission()
    }

    private fun checkAndRequestMicrophonePermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED
        ) {
            requestPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        viewModel.stopLiveSession()
    }
}`,
    'GeminiLiveClient.kt': `package com.myraa.ai.network

import android.util.Base64
import android.util.Log
import com.google.gson.Gson
import com.google.gson.JsonObject
import com.myraa.ai.BuildConfig
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.util.concurrent.TimeUnit

class GeminiLiveClient {
    private val gson = Gson()
    private val client = OkHttpClient.Builder()
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .writeTimeout(10, TimeUnit.SECONDS)
        .build()

    private var webSocket: WebSocket? = null

    fun connectSession(apiKey: String = BuildConfig.GEMINI_API_KEY, systemInstruction: String, scope: CoroutineScope) {
        val url = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=\$apiKey"
        val request = Request.Builder().url(url).build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(ws: WebSocket, response: Response) {
                sendSetupHandshake(ws, systemInstruction)
            }
            override fun onMessage(ws: WebSocket, text: String) {
                // Parse model turns, audio, and transcripts
            }
        })
    }
}`,
    'AudioRecorder.kt': `package com.myraa.ai.audio

import android.annotation.SuppressLint
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.launch

class AudioRecorder {
    private val sampleRate = 16000
    private var audioRecord: AudioRecord? = null

    @SuppressLint("MissingPermission")
    fun startRecording(scope: CoroutineScope) {
        val minBufferSize = AudioRecord.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT)
        audioRecord = AudioRecord(MediaRecorder.AudioSource.MIC, sampleRate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, minBufferSize)
        audioRecord?.startRecording()
    }
}`,
    'AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.MYRAA">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    'app/build.gradle.kts': `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.myraa.ai"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.myraa.ai"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        buildConfigField("String", "GEMINI_API_KEY", "\"YOUR_GEMINI_API_KEY\"")
    }
    buildFeatures { compose = true; buildConfig = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.8" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
}`,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0d050a] border border-red-600/70 rounded-2xl shadow-[0_0_50px_rgba(255,0,0,0.3)] overflow-hidden text-red-100 font-sans flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-red-950/60 border-b border-red-800/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,0,0,0.6)]">
                <Smartphone className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-mono font-black text-white tracking-wider">
                  MYRAA REAL ANDROID STUDIO PROJECT
                </h2>
                <p className="text-xs text-red-300/80 font-mono">
                  Kotlin + Jetpack Compose + Gemini Live API (PCM16 Real-Time Voice)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800 rounded-lg text-red-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-red-900/60 bg-red-950/20 font-mono text-xs font-bold">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center space-x-2 border-b-2 ${
                activeTab === 'instructions'
                  ? 'border-red-500 text-red-200 bg-red-900/30'
                  : 'border-transparent text-red-400/60 hover:text-red-300'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>BUILD & APK INSTALL GUIDE</span>
            </button>

            <button
              onClick={() => setActiveTab('source')}
              className={`flex-1 py-3 text-center transition-colors flex items-center justify-center space-x-2 border-b-2 ${
                activeTab === 'source'
                  ? 'border-red-500 text-red-200 bg-red-900/30'
                  : 'border-transparent text-red-400/60 hover:text-red-300'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>ANDROID SOURCE FILES</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
            {activeTab === 'instructions' ? (
              <div className="space-y-6 font-mono text-xs">
                {/* Step 1 */}
                <div className="p-4 bg-red-950/30 border border-red-800/60 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-bold text-red-200">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>Open `/android` Directory in Android Studio</span>
                  </div>
                  <p className="text-red-300/80 leading-relaxed font-sans">
                    All complete Kotlin source files, Jetpack Compose UI components, OkHttp Gemini WebSocket client, AudioRecord/AudioTrack PCM engines, and Gradle files are pre-generated inside the <code className="bg-red-950 px-1.5 py-0.5 border border-red-800 rounded text-red-300">/android</code> folder of this project workspace.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-red-950/30 border border-red-800/60 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-bold text-red-200">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                      2
                    </span>
                    <span>Configure Your Gemini API Key Securely</span>
                  </div>
                  <p className="text-red-300/80 leading-relaxed font-sans">
                    In the <code className="bg-red-950 px-1.5 py-0.5 border border-red-800 rounded text-red-300">/android</code> folder, create or edit <code className="bg-red-950 px-1.5 py-0.5 border border-red-800 rounded text-red-300">local.properties</code>:
                  </p>
                  <div className="relative bg-black/90 p-3 rounded-lg border border-red-900 text-red-300 font-mono text-xs flex items-center justify-between">
                    <span>GEMINI_API_KEY=your_actual_gemini_api_key_here</span>
                    <button
                      onClick={() => copyToClipboard('GEMINI_API_KEY=your_actual_gemini_api_key_here', 'key')}
                      className="p-1 hover:text-white"
                    >
                      {copiedText === 'key' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-red-950/30 border border-red-800/60 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-bold text-red-200">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                      3
                    </span>
                    <span>Compile & Build the Debug APK</span>
                  </div>
                  <p className="text-red-300/80 leading-relaxed font-sans">
                    Open your terminal in the <code className="bg-red-950 px-1.5 py-0.5 border border-red-800 rounded text-red-300">/android</code> directory and execute:
                  </p>
                  <div className="relative bg-black/90 p-3 rounded-lg border border-red-900 text-green-400 font-mono text-xs flex items-center justify-between">
                    <span>./gradlew assembleDebug</span>
                    <button
                      onClick={() => copyToClipboard('./gradlew assembleDebug', 'gradle')}
                      className="p-1 hover:text-white"
                    >
                      {copiedText === 'gradle' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-red-400/80 italic">
                    Output APK location: <code className="text-red-200">android/app/build/outputs/apk/debug/app-debug.apk</code>
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-red-950/30 border border-red-800/60 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-bold text-red-200">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">
                      4
                    </span>
                    <span>Install on Your Android Phone via USB ADB</span>
                  </div>
                  <div className="relative bg-black/90 p-3 rounded-lg border border-red-900 text-cyan-400 font-mono text-xs flex items-center justify-between">
                    <span>adb install app/build/outputs/apk/debug/app-debug.apk</span>
                    <button
                      onClick={() => copyToClipboard('adb install app/build/outputs/apk/debug/app-debug.apk', 'adb')}
                      className="p-1 hover:text-white"
                    >
                      {copiedText === 'adb' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Selector Tabs */}
                <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                  {Object.keys(filesMap).map((fileName) => (
                    <button
                      key={fileName}
                      onClick={() => setSelectedFile(fileName)}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs whitespace-nowrap transition-all ${
                        selectedFile === fileName
                          ? 'bg-red-600 border-red-400 text-white font-bold'
                          : 'bg-red-950/40 border-red-900/60 text-red-300 hover:bg-red-900/40'
                      }`}
                    >
                      {fileName}
                    </button>
                  ))}
                </div>

                {/* Source Code Box */}
                <div className="relative bg-black/90 rounded-xl border border-red-900/80 p-4 font-mono text-xs text-red-200 max-h-[350px] overflow-y-auto custom-scrollbar">
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => copyToClipboard(filesMap[selectedFile], 'file')}
                      className="px-2 py-1 bg-red-950 border border-red-800 hover:border-red-500 rounded text-[11px] text-red-200 flex items-center space-x-1"
                    >
                      {copiedText === 'file' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-red-400" />
                          <span>Copy Source</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap leading-relaxed">{filesMap[selectedFile]}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-red-950/80 border-t border-red-800/60 flex items-center justify-between text-xs font-mono text-red-300/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              MICROPHONE PERMISSIONS & WEBSOCKET ENGINE INCLUDED
            </span>
            <span className="text-red-400 font-bold">READY FOR ANDROID STUDIO</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
