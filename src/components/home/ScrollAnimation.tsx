"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 300;

function getFramePath(index: number): string {
  const num = String(index + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${num}.jpg`;
}

export default function ScrollAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Draw frame on canvas
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const img = imagesRef.current[frameIndex];
      if (!canvas || !ctx || !img) return;

      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;

      let drawW: number, drawH: number, drawX: number, drawY: number;
      if (imgRatio > canvasRatio) {
        drawH = canvas.height;
        drawW = drawH * imgRatio;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = canvas.width;
        drawH = drawW / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    },
    []
  );

  // Preload all frames for desktop
  useEffect(() => {
    if (isMobile) {
      requestAnimationFrame(() => setLoaded(true));
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      const img = new Image();
      img.src = getFramePath(150);
      img.onload = () => {
        imagesRef.current[150] = img;
        setLoaded(true);
        drawFrame(150);
      };
      return;
    }

    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      imagesRef.current = images;
      drawFrame(0);
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        images[i] = img;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
        }
      };
    }
  }, [isMobile, drawFrame]);

  // GSAP ScrollTrigger for desktop frame scrubbing
  useEffect(() => {
    if (!loaded || isMobile) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(self.progress * TOTAL_FRAMES)
        );
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }
      },
    });

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [loaded, isMobile, drawFrame]);

  // Mobile: scroll-triggered video playback
  useEffect(() => {
    if (!isMobile || !loaded) return;

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const setupScrollVideo = () => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration;
          }
        },
      });

      return () => trigger.kill();
    };

    if (video.readyState >= 2) {
      const cleanup = setupScrollVideo();
      return cleanup;
    }

    const onLoaded = () => {
      const cleanup = setupScrollVideo();
      video.removeEventListener("loadeddata", onLoaded);
      return cleanup;
    };

    video.addEventListener("loadeddata", onLoaded);
    return () => video.removeEventListener("loadeddata", onLoaded);
  }, [isMobile, loaded]);

  return (
    <section
      id="scroll-animation"
      ref={sectionRef}
      className="relative bg-v-cream"
      style={{ height: isMobile ? "250vh" : "350vh" }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        {!loaded && !isMobile && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-v-cream">
            <div className="w-48 h-[2px] bg-v-border rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-v-gold transition-all duration-300 rounded-full"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="text-[11px] tracking-[3px] text-v-muted uppercase font-[family-name:var(--font-accent)]">
              Loading experience {loadProgress}%
            </span>
          </div>
        )}

        {!isMobile && (
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />
        )}

        {isMobile && (
          <video
            ref={videoRef}
            src="/videos/hero-animation.mp4"
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-contain"
            style={{ opacity: loaded ? 1 : 0 }}
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-v-cream to-transparent z-10 pointer-events-none" />
    </section>
  );
}
