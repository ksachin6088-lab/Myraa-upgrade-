package com.myraa.ai.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.unit.dp
import com.myraa.ai.ui.theme.MyraaPinkGf
import com.myraa.ai.ui.theme.MyraaRedGlow
import com.myraa.ai.ui.theme.MyraaRedPrimary
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun MyraaCoreReactor(
    inputLevel: Float,
    outputLevel: Float,
    isGfMode: Boolean,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "reactor")

    val outerRotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(20000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "outer"
    )

    val innerRotation by infiniteTransition.animateFloat(
        initialValue = 360f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(12000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "inner"
    )

    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(1500, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    val primaryColor = if (isGfMode) MyraaPinkGf else MyraaRedPrimary
    val secondaryColor = if (isGfMode) Color(0xFFFF66B2) else MyraaRedGlow

    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val center = Offset(size.width / 2f, size.height / 2f)
            val radius = minOf(size.width, size.height) / 2f * 0.85f

            // Audio level amplification
            val activeAudioLevel = maxOf(inputLevel, outputLevel)
            val dynamicRadius = radius * (1f + activeAudioLevel * 0.35f) * pulseScale

            // 1. Ambient Glow Fill
            drawCircle(
                color = primaryColor.copy(alpha = 0.15f + activeAudioLevel * 0.3f),
                radius = dynamicRadius,
                center = center
            )

            // 2. Outer Tick Ring
            rotate(outerRotation, pivot = center) {
                val numTicks = 60
                val tickLength = 12.dp.toPx()
                for (i in 0 until numTicks) {
                    val angle = (i * (360f / numTicks)) * (Math.PI / 180f)
                    val isMajor = i % 5 == 0
                    val currentTickLen = if (isMajor) tickLength * 1.5f else tickLength

                    val startX = center.x + (radius * cos(angle)).toFloat()
                    val startY = center.y + (radius * sin(angle)).toFloat()
                    val endX = center.x + ((radius - currentTickLen) * cos(angle)).toFloat()
                    val endY = center.y + ((radius - currentTickLen) * sin(angle)).toFloat()

                    drawLine(
                        color = if (isMajor) primaryColor else secondaryColor.copy(alpha = 0.6f),
                        start = Offset(startX, startY),
                        end = Offset(endX, endY),
                        strokeWidth = if (isMajor) 3.dp.toPx() else 1.5.dp.toPx()
                    )
                }
            }

            // 3. Counter-rotating inner dashed ring
            rotate(innerRotation, pivot = center) {
                drawCircle(
                    color = secondaryColor.copy(alpha = 0.8f),
                    radius = radius * 0.72f,
                    center = center,
                    style = Stroke(
                        width = 2.dp.toPx(),
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(20f, 15f), 0f)
                    )
                )
            }

            // 4. Central Reactor Core Orb
            drawCircle(
                color = primaryColor,
                radius = radius * 0.35f * (1f + activeAudioLevel * 0.25f),
                center = center
            )
            drawCircle(
                color = Color.White.copy(alpha = 0.8f),
                radius = radius * 0.18f,
                center = center
            )
        }
    }
}
