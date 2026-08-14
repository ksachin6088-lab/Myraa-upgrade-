package com.myraa.ai.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import com.myraa.ai.ui.theme.MyraaCyan
import com.myraa.ai.ui.theme.MyraaPinkGf

@Composable
fun MyraaAvatarCompose(
    outputAudioLevel: Float,
    isGfMode: Boolean,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "avatar")
    val blushPulse by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "blush"
    )

    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val center = Offset(size.width / 2f, size.height / 2f)
            val scale = minOf(size.width, size.height) / 200f

            // 1. Anime Hair Base Outline Path
            val hairPath = Path().apply {
                moveTo(center.x - 60f * scale, center.y - 30f * scale)
                cubicTo(
                    center.x - 70f * scale, center.y - 80f * scale,
                    center.x + 70f * scale, center.y - 80f * scale,
                    center.x + 60f * scale, center.y - 30f * scale
                )
                close()
            }
            drawPath(
                path = hairPath,
                color = Color(0xFF2A0A20)
            )

            // 2. Face Silhouette
            val facePath = Path().apply {
                moveTo(center.x - 45f * scale, center.y - 35f * scale)
                lineTo(center.x + 45f * scale, center.y - 35f * scale)
                lineTo(center.x + 35f * scale, center.y + 25f * scale)
                lineTo(center.x, center.y + 55f * scale)
                lineTo(center.x - 35f * scale, center.y + 25f * scale)
                close()
            }
            drawPath(
                path = facePath,
                color = Color(0xFF1C0A18)
            )
            drawPath(
                path = facePath,
                color = MyraaPinkGf.copy(alpha = 0.8f),
                style = Stroke(width = 2f * scale)
            )

            // 3. Glowing Pink Blush Cheeks (Girlfriend Mode)
            if (isGfMode) {
                val blushAlpha = 0.4f * blushPulse
                drawCircle(
                    color = MyraaPinkGf.copy(alpha = blushAlpha),
                    radius = 12f * scale,
                    center = Offset(center.x - 25f * scale, center.y + 12f * scale)
                )
                drawCircle(
                    color = MyraaPinkGf.copy(alpha = blushAlpha),
                    radius = 12f * scale,
                    center = Offset(center.x + 25f * scale, center.y + 12f * scale)
                )
            }

            // 4. Eyes
            val eyeColor = if (isGfMode) MyraaPinkGf else MyraaCyan
            drawRoundRect(
                color = eyeColor,
                topLeft = Offset(center.x - 28f * scale, center.y - 12f * scale),
                size = Size(16f * scale, 6f * scale),
                cornerRadius = CornerRadius(4f * scale)
            )
            drawRoundRect(
                color = eyeColor,
                topLeft = Offset(center.x + 12f * scale, center.y - 12f * scale),
                size = Size(16f * scale, 6f * scale),
                cornerRadius = CornerRadius(4f * scale)
            )

            // 5. Lip Mouth Opening (Audio Reactive)
            val mouthHeight = (3f + outputAudioLevel * 25f) * scale
            drawRoundRect(
                color = if (isGfMode) MyraaPinkGf else Color.White,
                topLeft = Offset(center.x - 10f * scale, center.y + 30f * scale - mouthHeight / 2f),
                size = Size(20f * scale, mouthHeight),
                cornerRadius = CornerRadius(6f * scale)
            )
        }
    }
}
