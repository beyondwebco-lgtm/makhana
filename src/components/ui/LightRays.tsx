"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Geometry, Program, Mesh, Transform } from "ogl";

interface LightRaysProps {
  raysOrigin?: "top-center" | "top-left" | "top-right" | "center" | "left" | "right";
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
}

export default function LightRays({
  raysOrigin = "top-center",
  raysColor = "#D4AF37",
  raysSpeed = 1.2,
  lightSpread = 0.75,
  rayLength = 1.4,
  pulsating = true,
  fadeDistance = 1.2,
  saturation = 0.9,
  followMouse = true,
  mouseInfluence = 0.08,
  noiseAmount = 0.08,
  distortion = 0.03,
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert hex to rgb normalised
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
      : [0.83, 0.68, 0.22];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Initialize OGL Renderer
    const renderer = new Renderer({ canvas, alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Create a full-screen quad geometry
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    // Vertex Shader
    const vertexShader = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader
    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uColor;
      uniform float uSpeed;
      uniform float uSpread;
      uniform float uLength;
      uniform float uFadeDistance;
      uniform float uSaturation;
      uniform float uNoiseAmount;
      uniform float uDistortion;
      uniform float uOriginX;
      uniform float uOriginY;

      // Simple pseudo-noise function
      float snoise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(snoise(i + vec2(0.0,0.0)), snoise(i + vec2(1.0,0.0)), u.x),
                   mix(snoise(i + vec2(0.0,1.0)), snoise(i + vec2(1.0,1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        
        // Origin configuration
        vec2 origin = vec2(uOriginX, uOriginY);
        
        // Mouse influence offset
        origin += uMouse * 0.12;

        vec2 toPixel = uv - origin;
        float dist = length(toPixel);
        float angle = atan(toPixel.y, toPixel.x);

        // Volumetric ray noise modulation
        float rayTime = uTime * uSpeed * 0.15;
        float n1 = noise(vec2(angle * 12.0 * uSpread + rayTime, rayTime * 0.5));
        float n2 = noise(vec2(angle * 26.0 * uSpread - rayTime * 0.8, rayTime * 0.2));
        
        // Distort and combine
        float rays = mix(n1, n2, 0.5);
        rays = smoothstep(0.3, 0.75, rays);

        // Falloff calculation
        float fade = smoothstep(uLength, 0.0, dist * uFadeDistance);
        
        // Volumetric brightness
        float brightness = rays * fade;
        
        // Add color saturation
        vec3 finalColor = uColor * brightness * uSaturation;

        gl_FragColor = vec4(finalColor, brightness * 0.8);
      }
    `;

    // Uniforms mapping
    const originCoords = {
      "top-center": [0.5, 1.0],
      "top-left": [0.0, 1.0],
      "top-right": [1.0, 1.0],
      "center": [0.5, 0.5],
      "left": [0.0, 0.5],
      "right": [1.0, 0.5],
    };
    const [origX, origY] = originCoords[raysOrigin] || [0.5, 1.0];

    const rgb = hexToRgb(raysColor);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        uMouse: { value: [0, 0] },
        uColor: { value: rgb },
        uSpeed: { value: raysSpeed },
        uSpread: { value: lightSpread },
        uLength: { value: rayLength },
        uFadeDistance: { value: fadeDistance },
        uSaturation: { value: saturation },
        uNoiseAmount: { value: noiseAmount },
        uDistortion: { value: distortion },
        uOriginX: { value: origX },
        uOriginY: { value: origY },
      },
    });

    const scene = new Transform();
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    // Handle mouse move tracking
    let targetMouse = [0, 0];
    let currentMouse = [0, 0];

    const handleMouseMove = (e: MouseEvent) => {
      if (!followMouse) return;
      // Normalise coordinates to range [-1, 1]
      targetMouse[0] = (e.clientX / window.innerWidth - 0.5) * 2.0 * mouseInfluence;
      targetMouse[1] = (0.5 - e.clientY / window.innerHeight) * 2.0 * mouseInfluence;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle resize
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();

    // Intersection observer to pause rendering when out of viewport
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    let animationFrameId = 0;
    let time = 0;

    const update = (t: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(update);
        return;
      }

      time = t * 0.001;
      
      // Interpolate mouse coordinates (lerp)
      currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.05;
      currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.05;

      program.uniforms.uTime.value = time;
      program.uniforms.uMouse.value = currentMouse;
      
      // Dynamic updates on props changing
      const freshRgb = hexToRgb(raysColor);
      program.uniforms.uColor.value = freshRgb;
      
      renderer.render({ scene });
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
