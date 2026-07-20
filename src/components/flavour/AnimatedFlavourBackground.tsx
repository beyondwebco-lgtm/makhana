"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SoftAurora from "@/components/ui/SoftAurora";
import type { ProductTheme } from "@/lib/productThemes";

interface StoryScene {
  text: string;
  effect: string;
}

const FLAVOUR_STORIES: Record<string, StoryScene[]> = {
  "love-bite": [
    { text: "Rich, golden cheese melting over slow-roasted makhanas.", effect: "cheese" },
    { text: "Crafted with love, seasoned to perfection.", effect: "glow" },
    { text: "A premium crunch that captures your heart.", effect: "celebrate" },
  ],
  "blush": [
    { text: "Tangy tomato vines ripening in the warm summer sun.", effect: "tomato" },
    { text: "A blush of rich spices and deep flavour.", effect: "glow" },
    { text: "Addictive tanginess that leaves you wanting more.", effect: "celebrate" },
  ],
  "green-flag": [
    { text: "Cool, herby mint leaves floating gently in the breeze.", effect: "leaves" },
    { text: "A wave of refreshing crisp herbs.", effect: "breeze" },
    { text: "Mindful snacking that waves the ultimate green flag.", effect: "celebrate" },
  ],
  "red-flag": [
    { text: "Fiery peri-peri peppers glowing with hot energy.", effect: "spicy" },
    { text: "Spicy enough to steal your heart.", effect: "fire" },
    { text: "An intense, premium burst of roasted crunch.", effect: "celebrate" },
  ],
  "crush-me": [
    { text: "Classic sea salt crystals sparkling like stars.", effect: "salt" },
    { text: "Pure, elegant, simple ingredients.", effect: "glow" },
    { text: "The perfect timeless crunch.", effect: "celebrate" },
  ],
  "soulmate": [
    { text: "Sweet caramel and premium butter blending into one.", effect: "sweet" },
    { text: "A rich, indulgent connection.", effect: "glow" },
    { text: "Snacking's true perfect match.", effect: "celebrate" },
  ],
};

export default function AnimatedFlavourBackground({
  theme,
  slug,
}: {
  theme: ProductTheme;
  slug: string;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);

      const video = videoRef.current;
      if (video && video.duration) {
        targetTimeRef.current = video.duration * progress;
      }

      // Map progress to scenes
      const scenesCount = FLAVOUR_STORIES[slug]?.length || 3;
      const idx = Math.min(Math.floor(progress * (scenesCount + 1)), scenesCount - 1);
      setActiveSceneIdx(Math.max(0, idx));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  // Smooth video scrubbing loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log("Video diagnostic: Initializing video listener", {
      src: video.src,
      readyState: video.readyState,
      networkState: video.networkState,
      paused: video.paused
    });

    const handleLoadedMetadata = () => {
      if (video) {
        console.log("Video diagnostic: Metadata loaded", {
          duration: video.duration,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight
        });
        targetTimeRef.current = video.duration * scrollProgress;
      }
    };

    const handlePlay = () => console.log("Video diagnostic: Play event fired");
    const handlePause = () => console.log("Video diagnostic: Pause event fired");
    const handleWaiting = () => console.log("Video diagnostic: Video waiting for frames");
    const handlePlaying = () => console.log("Video diagnostic: Video playing");
    const handleCanPlay = () => console.log("Video diagnostic: Can play video", { readyState: video.readyState });
    
    const handleError = (e: any) => {
      console.error("Video diagnostic: Load error occurred!", {
        error: video.error,
        networkState: video.networkState,
        readyState: video.readyState
      });
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    let rafId: number;
    let logCounter = 0;
    const updateVideoTime = () => {
      if (video && video.duration) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.005) {
          currentTimeRef.current += diff * 0.08; // smooth lerp
          currentTimeRef.current = Math.max(0, Math.min(video.duration, currentTimeRef.current));
          video.currentTime = currentTimeRef.current;
        }

        // Log status every 120 frames to avoid flooding
        logCounter++;
        if (logCounter % 120 === 0) {
          console.log("Video loop diagnostic:", {
            currentTime: video.currentTime,
            targetTime: targetTimeRef.current,
            readyState: video.readyState,
            networkState: video.networkState
          });
        }
      }
      rafId = requestAnimationFrame(updateVideoTime);
    };

    rafId = requestAnimationFrame(updateVideoTime);

    return () => {
      if (video) {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("waiting", handleWaiting);
        video.removeEventListener("playing", handlePlaying);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("error", handleError);
      }
      cancelAnimationFrame(rafId);
    };
  }, [scrollProgress]);

  const scenes = FLAVOUR_STORIES[slug] || FLAVOUR_STORIES["love-bite"];
  const currentScene = scenes[activeSceneIdx];

  // Derive layout transformations based on progress
  const particleY = scrollProgress * -150;
  const opacitySceneText = scrollProgress > 0.05 && scrollProgress < 0.85 ? 1 : 0;

  return (
    <div ref={bgRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ background: theme.bgSolid }}>
      {/* Base radial color gradient container */}
      <div className="absolute inset-0 bg-cover transition-opacity duration-1000" style={{ background: theme.bg, opacity: 0.8 + scrollProgress * 0.2 }} />

      {/* Scroll-Driven Video Story Backdrop (Green Flag & Red Flag specific) */}
      {(slug === "green-flag" || slug === "red-flag") && (
        <video
          ref={videoRef}
          src="/videos/red-flag-green-flag.mp4"
          preload="auto"
          muted
          playsInline
          style={{
            filter: `blur(${Math.max(0, 24 - scrollProgress * 48)}px) brightness(${0.65 + scrollProgress * 0.35})`,
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-75 pointer-events-none z-0 transition-all duration-300 ease-out"
        />
      )}

      {/* Dynamic SoftAurora Background (Smooth scrub) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] mix-blend-screen pointer-events-none transition-all duration-700"
        style={{
          opacity: (slug === "green-flag" || slug === "red-flag") ? 0.35 : 0.6 + scrollProgress * 0.3,
          transform: `translate(-50%, -50%) scale(${1.3 + scrollProgress * 0.4})`,
        }}
      >
        <SoftAurora
          speed={0.4 + scrollProgress * 0.4}
          scale={1.4 + scrollProgress * 0.2}
          brightness={0.85 + scrollProgress * 0.15}
          color1={theme.color1}
          color2={theme.color2}
          noiseFrequency={2.2 + scrollProgress * 0.6}
          noiseAmplitude={0.8 + scrollProgress * 0.4}
          bandHeight={0.5}
          bandSpread={1.2}
          octaveDecay={0.1}
          layerOffset={0.1}
          colorSpeed={0.5 + scrollProgress * 0.5}
          enableMouseInteraction={true}
          mouseInfluence={0.3}
        />
      </div>

      {/* Cinematic overlay story text (Only visible on scroll) */}
      <div 
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 max-w-xl text-center px-6 transition-all duration-500"
        style={{ opacity: opacitySceneText, transform: `translate(-50%, ${scrollProgress * -30}px)` }}
      >
        <p className="font-[family-name:var(--font-accent)] text-[10px] uppercase tracking-[4px] font-bold mb-2" style={{ color: theme.accent }}>
          The Story of {theme.particles[0] || "✦"}
        </p>
        <h3 className="font-[family-name:var(--font-body)] text-xl md:text-2xl font-black text-white leading-relaxed tracking-wide drop-shadow-md">
          {currentScene?.text}
        </h3>
      </div>

      {/* Floating particles - dynamic speed based on scroll scrubbing */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {theme.particles.map((char, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl filter blur-[1px] select-none"
            style={{
              top: `${15 + (i * 25) % 70}%`,
              left: `${10 + (i * 35) % 80}%`,
              opacity: 0.15 + scrollProgress * 0.35,
            }}
            animate={{
              y: [0, particleY - (i * 20), 0],
              rotate: [0, 360 * scrollProgress, 0],
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {char}
          </motion.div>
        ))}
      </div>

      {/* Flavour specific overlay effects (Mint leaves, spicy breeze, etc.) */}
      {slug === "green-flag" && currentScene?.effect === "leaves" && (
        <div className="absolute inset-0 bg-green-500/5 mix-blend-color-dodge blur-[8px] animate-pulse pointer-events-none" />
      )}
      {slug === "red-flag" && currentScene?.effect === "fire" && (
        <div className="absolute inset-0 bg-red-600/5 mix-blend-color-dodge blur-[12px] animate-pulse pointer-events-none" />
      )}

      {/* Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-85" style={{ backgroundImage: `linear-gradient(to top, ${theme.bgSolid}, transparent, ${theme.bgSolid})` }} />
      <div className="absolute inset-0 pointer-events-none opacity-85" style={{ backgroundImage: `linear-gradient(to right, ${theme.bgSolid}, transparent, ${theme.bgSolid})` }} />

      {/* Film Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
