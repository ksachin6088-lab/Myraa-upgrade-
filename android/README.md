# MYRAA AI Voice Assistant - Real Android Project

This is a complete, production-ready **Android Studio** project built using **Kotlin + Jetpack Compose** and integrating the **Gemini Live Multimodal API** for low-latency real-time voice conversations.

---

## 🚀 Key Features Built-In

1. **Gemini Live Multimodal WebSocket Streaming**: Real-time voice-to-voice interaction using OkHttp WebSockets to `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`.
2. **PCM16 Real-Time Audio Engine**:
   - **Input**: Low-latency 16kHz PCM 16-bit Mono microphone input recorded via `AudioRecord`.
   - **Output**: Real-time 24kHz PCM 16-bit audio playback using `AudioTrack` streaming mode.
3. **MYRAA Red/Pink Sci-Fi Reactor Core**: Custom Jetpack Compose `Canvas` drawing animated rotating tick rings, audio-reactive pulse glow, counter-rotating dashed borders, and floating particle hearts.
4. **Anime Vector Avatar with Blush & Mouth Reactivity**: Canvas drawing with pink blush cheeks and lip movements synced to Gemini audio output.
5. **Girlfriend Companion Mode**: Fully integrated Affection score tracker, headpat interactions, virtual gift sending (flowers), and custom relationship dynamics (Caring, Romantic, Tsundere, Waifu).
6. **Remote Phone Hardware Integration**: Torch / Flashlight control via Android `CameraManager`, Haptic feedback via `VibratorManager`.
7. **Hindi + Hinglish + English Support**: Configured Gemini system prompt for natural multilingual voice responses.
8. **Secure API Key Setup**: Credentials loaded securely via `local.properties` or environment variables — never hardcoded in source files.

---

## 🛠️ Step-by-Step Instructions: Building the APK

### Step 1: Open the Project in Android Studio
1. Open **Android Studio** (Ladybug, Koala, Jellyfish, or newer).
2. Click **Open** and select the `/android` directory of this project.
3. Wait for Android Studio to index and download the Gradle dependencies automatically.

### Step 2: Configure Your Gemini API Key
In the `/android` directory, create a file named `local.properties` (or copy from `local.properties.example`):

```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY
```

> **Note**: Gradle automatically injects this API key into `BuildConfig.GEMINI_API_KEY` at build time without exposing it in source code repository commits.

### Step 3: Build the Debug APK
You can build the APK directly inside Android Studio or using the terminal:

#### Option A: Using Terminal / Command Line
Run the Gradle wrapper command from the `/android` folder:

```bash
# On macOS / Linux:
./gradlew assembleDebug

# On Windows:
gradlew.bat assembleDebug
```

Upon completion, your real compiled APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk`

#### Option B: Using Android Studio UI
1. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)** in the top menu.
2. Click **locate** in the notification popup once build finishes.

---

## 📱 Step 4: Install the APK on Your Android Phone

### Method A: Direct USB Installation via ADB
1. Enable **Developer Options** and **USB Debugging** on your Android device.
2. Connect your phone to your computer via USB.
3. Run the following command in terminal:

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Method B: Manual File Transfer
1. Copy `app-debug.apk` onto your phone (via USB, Google Drive, WhatsApp, or email).
2. Open the file on your phone using any File Manager app.
3. Allow **"Install from unknown sources"** when prompted.
4. Launch **MYRAA**! Grant microphone permissions on first open and start talking!

---

## 🛠️ Project File Structure

```
android/
├── build.gradle.kts                # Root build configuration
├── settings.gradle.kts             # Module declarations
├── gradle.properties               # AndroidX & JVM parameters
├── local.properties.example        # Secure API key template
├── gradle/
│   └── wrapper/                    # Gradle wrapper configuration
└── app/
    ├── build.gradle.kts            # App dependencies & Compose config
    ├── proguard-rules.pro
    └── src/
        └── main/
            ├── AndroidManifest.xml # Permissions (RECORD_AUDIO, INTERNET, etc.)
            ├── res/                # Strings, colors, themes
            └── java/com/myraa/ai/
                ├── MainActivity.kt # Entry point & permission request
                ├── audio/
                │   ├── AudioRecorder.kt    # PCM16 16kHz microphone stream
                │   └── AudioTrackPlayer.kt # Real-time audio playback
                ├── network/
                │   └── GeminiLiveClient.kt # WebSocket Gemini Live client
                ├── data/
                │   ├── GirlfriendPreferences.kt
                │   └── MemoryRepository.kt
                ├── viewmodel/
                │   └── MyraaViewModel.kt   # State management & hardware triggers
                └── ui/
                    ├── MyraaMainScreen.kt  # Main Compose UI screen
                    ├── components/
                    │   ├── MyraaCoreReactor.kt
                    │   ├── MyraaAvatarCompose.kt
                    │   ├── HudTopBar.kt
                    │   ├── GirlfriendWidgetCompose.kt
                    │   └── PhoneControlSheet.kt
                    └── theme/
                        ├── Theme.kt
                        └── Color.kt
```
