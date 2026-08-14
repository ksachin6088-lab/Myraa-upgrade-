package com.myraa.ai.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.PowerSettingsNew
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.myraa.ai.ui.theme.MyraaCardBg
import com.myraa.ai.ui.theme.MyraaPinkGf
import com.myraa.ai.ui.theme.MyraaRedPrimary
import com.myraa.ai.viewmodel.AssistantState
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun HudTopBar(
    assistantState: AssistantState,
    isGfMode: Boolean,
    onOpenGfHub: () -> Unit,
    onOpenPhoneControl: () -> Unit,
    onTogglePower: () -> Unit,
    modifier: Modifier = Modifier
) {
    var currentTime by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        while (true) {
            val formatter = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
            currentTime = formatter.format(Date())
            kotlinx.coroutines.delay(1000)
        }
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(MyraaCardBg.copy(alpha = 0.9f))
            .border(1.dp, if (isGfMode) MyraaPinkGf.copy(alpha = 0.5f) else MyraaRedPrimary.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
            .padding(horizontal = 12.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left: App Name & Status Indicator
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(10.dp)
                    .background(
                        color = when (assistantState) {
                            AssistantState.LISTENING -> Color.Green
                            AssistantState.SPEAKING -> if (isGfMode) MyraaPinkGf else MyraaRedPrimary
                            AssistantState.CONNECTING -> Color.Yellow
                            AssistantState.ERROR -> Color.Red
                            else -> Color.Gray
                        },
                        shape = RoundedCornerShape(50)
                    )
            )

            Text(
                text = "MYRAA v3.7",
                color = Color.White,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Monospace
            )
        }

        // Center: Clock
        Text(
            text = currentTime,
            color = if (isGfMode) MyraaPinkGf else MyraaRedPrimary,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )

        // Right: Control Buttons
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            // Girlfriend Mode Trigger Button
            Box(
                modifier = Modifier
                    .background(MyraaPinkGf.copy(alpha = 0.2f), RoundedCornerShape(8.dp))
                    .border(1.dp, MyraaPinkGf, RoundedCornerShape(8.dp))
                    .clickable { onOpenGfHub() }
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Favorite,
                        contentDescription = "GF Mode",
                        tint = MyraaPinkGf,
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = "GF MODE",
                        color = MyraaPinkGf,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // Remote Phone Control
            IconButton(
                onClick = onOpenPhoneControl,
                modifier = Modifier.size(28.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.PhoneAndroid,
                    contentDescription = "Phone Control",
                    tint = Color.White,
                    modifier = Modifier.size(16.dp)
                )
            }

            // Power Toggle
            IconButton(
                onClick = onTogglePower,
                modifier = Modifier.size(28.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.PowerSettingsNew,
                    contentDescription = "Power",
                    tint = if (assistantState != AssistantState.DISCONNECTED) MyraaRedPrimary else Color.Gray,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}
