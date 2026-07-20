"use client";

import React, { useRef, useEffect } from "react";

interface SoftAuroraProps {
  speed?: number;
  scale?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  noiseFrequency?: number;
  noiseAmplitude?: number;
  bandHeight?: number;
  bandSpread?: number;
  octaveDecay?: number;
  layerOffset?: number;
  colorSpeed?: number;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
}

export default function SoftAurora({
  speed = 0.6,
  scale = 1.5,
  brightness = 1,
  color1 = "#f7f7f7",
  color2 = "#e100ff",
  noiseFrequency = 2.5,
  noiseAmplitude = 1,
  bandHeight = 0.5,
  bandSpread = 1,
  octaveDecay = 0.1,
  layerOffset = 0,
  colorSpeed = 1,
  enableMouseInteraction = true,
  mouseInfluence = 0.25,
}: SoftAuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableMouseInteraction) return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      time += 0.01 * speed;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === 0 || h === 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Smooth mouse interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw base color
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      
      // Apply scale
      ctx.translate(w / 2, h / 2);
      ctx.scale(scale, scale);
      ctx.translate(-w / 2, -h / 2);

      // We draw 3 overlapping organic wave layers to simulate multi-octave aurora noise
      const layersCount = 3;
      for (let layer = 0; layer < layersCount; layer++) {
        const offsetMultiplier = layer * layerOffset + 1;
        const layerSpeed = time * colorSpeed * offsetMultiplier;

        // Wave center point perturbed by noise/sine
        const waveX =
          w * (0.5 + Math.sin(layerSpeed * 0.7 + layer) * 0.2 * noiseAmplitude) +
          (mouse.x - 0.5) * w * mouseInfluence * (enableMouseInteraction ? 1 : 0);
        
        const baseHeight = h * bandHeight;
        const waveY =
          baseHeight +
          Math.cos(layerSpeed * 0.5 + layer) * h * 0.15 * bandSpread * noiseAmplitude +
          (mouse.y - 0.5) * h * mouseInfluence * (enableMouseInteraction ? 1 : 0);

        // Gradient radius
        const r1 = 0;
        const r2 = Math.max(w, h) * 0.5 * (1 + layer * octaveDecay) * noiseFrequency;

        const grad = ctx.createRadialGradient(waveX, waveY, r1, waveX, waveY, r2);

        // Interpolate colors
        const alpha = 0.45 * brightness * (1 - layer * 0.1);
        grad.addColorStop(0, hexToRgba(color2, alpha));
        grad.addColorStop(0.4, hexToRgba(color1, alpha * 0.6));
        grad.addColorStop(1, "rgba(5, 5, 5, 0)");

        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = "screen";
        ctx.fillRect(0, 0, w, h);
      }

      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [
    speed,
    scale,
    brightness,
    color1,
    color2,
    noiseFrequency,
    noiseAmplitude,
    bandHeight,
    bandSpread,
    octaveDecay,
    layerOffset,
    colorSpeed,
    enableMouseInteraction,
    mouseInfluence,
  ]);

  // Utility to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const cleanHex = hex.replace("#", "");
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
