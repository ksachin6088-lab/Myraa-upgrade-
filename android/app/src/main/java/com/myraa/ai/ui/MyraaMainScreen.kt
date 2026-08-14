package com.myraa.ai.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.myraa.ai.ui.components.*
import com.myraa.ai.ui.theme.MyraaBlack
import com.myraa.ai.ui.theme.MyraaPinkGf
import com.myraa.ai.ui.theme.MyraaRedGlow
import com.myraa.ai.ui.theme.MyraaRedPrimary
import com.myraa.ai.viewmodel.AssistantState
import com.myraa.ai.viewmodel.MyraaViewModel

@Composable
fun MyraaMainScreen(
    viewModel: MyraaViewModel,
    modifier: Modifier = Modifier
) {
    val assistantState by viewModel.assistantState.collectAsState()
    val gfSettings by viewModel.gfSettings.collectAsState()
    val inputLevel by viewModel.inputAudioLevel.collectAsState()
    val outputLevel by viewModel.outputAudioLevel.collectAsState()
    val transcript by viewModel.transcript.collectAsState()
    val torchEnabled by viewModel.torchEnabled.collectAsState()

    var showPhoneControl by remember { mutableStateOf(false) }
    var activeViewMode by remember { mutableStateOf("core") } // "core" or "avatar"

    val isGfMode = gfSettings.enabled
    val primaryColor = if (isGfMode) MyraaPinkGf else MyraaRedPrimary

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MyraaBlack)
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // 1. HUD Top Bar
            HudTopBar(
                assistantState = assistantState,
                isGfMode = isGfMode,
                onOpenGfHub = { },
                onOpenPhoneControl = { showPhoneControl = true },
                onTogglePower = { viewModel.toggleSession() }
            )

            // 2. Central Reactor Core or Avatar
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                if (activeViewMode == "core") {
                    MyraaCoreReactor(
                        inputLevel = inputLevel,
                        outputLevel = outputLevel,
                        isGfMode = isGfMode,
                        modifier = Modifier
                            .size(280.dp)
                            .clickable { activeViewMode = "avatar" }
                    )
                } else {
                    MyraaAvatarCompose(
                        outputAudioLevel = outputLevel,
                        isGfMode = isGfMode,
                        modifier = Modifier
                            .size(280.dp)
                            .clickable { activeViewMode = "core" }
                    )
                }
            }

            // 3. Girlfriend Widget Card
            if (isGfMode) {
                GirlfriendWidgetCompose(
                    settings = gfSettings,
                    onGiveHeadpat = { viewModel.giveHeadpat() },
                    onSendGift = { viewModel.sendVirtualGift(it) },
                    modifier = Modifier.padding(bottom = 12.dp)
                )
            }

            // 4. Real-Time Audio Waveform Visualizer
            AudioWaveformVisualizer(
                level = maxOf(inputLevel, outputLevel),
                isGfMode = isGfMode,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            // 5. Recent Voice Transcript Log
            if (transcript.isNotEmpty()) {
                val latest = transcript.first()
                Surface(
                    color = Color(0xFF10050E),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                ) {
                    Text(
                        text = "${latest.first}: ${latest.second}",
                        color = Color.White.copy(alpha = 0.9f),
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        modifier = Modifier.padding(8.dp),
                        maxLines = 2
                    )
                }
            }

            // 6. Floating Microphone Dock Button
            Button(
                onClick = { viewModel.toggleSession() },
                modifier = Modifier
                    .size(72.dp),
                shape = CircleShape,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (assistantState != AssistantState.DISCONNECTED) primaryColor else Color(0xFF220A14)
                )
            ) {
                Icon(
                    imageVector = if (assistantState != AssistantState.DISCONNECTED) Icons.Default.Mic else Icons.Default.MicOff,
                    contentDescription = "Microphone",
                    tint = Color.White,
                    modifier = Modifier.size(32.dp)
                )
            }
        }

        // Phone Control Sheet
        PhoneControlSheet(
            isOpen = showPhoneControl,
            torchEnabled = torchEnabled,
            onToggleTorch = { viewModel.toggleTorch() },
            onDismiss = { showPhoneControl = false }
        )
    }
}
