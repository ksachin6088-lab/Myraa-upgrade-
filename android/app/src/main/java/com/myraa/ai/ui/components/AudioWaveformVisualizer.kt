package com.myraa.ai.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.myraa.ai.ui.theme.MyraaPinkGf
import com.myraa.ai.ui.theme.MyraaRedPrimary
import kotlin.random.Random

@Composable
fun AudioWaveformVisualizer(
    level: Float,
    isGfMode: Boolean,
    modifier: Modifier = Modifier
) {
    val barColor = if (isGfMode) MyraaPinkGf else MyraaRedPrimary

    Canvas(
        modifier = modifier
            .fillMaxWidth()
            .height(36.dp)
    ) {
        val numBars = 32
        val spacing = 4.dp.toPx()
        val barWidth = (size.width - (spacing * (numBars - 1))) / numBars
        val center = size.height / 2f

        for (i in 0 until numBars) {
            val randomFactor = 0.3f + Random.nextFloat() * 0.7f
            val barHeight = maxOf(4.dp.toPx(), size.height * level * randomFactor)

            val x = i * (barWidth + spacing)
            val y = center - barHeight / 2f

            drawRoundRect(
                color = barColor.copy(alpha = 0.7f + level * 0.3f),
                topLeft = Offset(x, y),
                size = Size(barWidth, barHeight),
                cornerRadius = CornerRadius(2.dp.toPx())
            )
        }
    }
}
