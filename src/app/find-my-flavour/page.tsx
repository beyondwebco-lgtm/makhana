"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, SkipForward, ArrowRight, RefreshCw, Sparkles, Check, X, ShieldAlert, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { products } from "@/data/products";

// ----------------------------------------------------
// React Bits Circular Text (SVG textPath + speedUp on hover)
// ----------------------------------------------------
interface CircularTextProps {
  text?: string;
  spinDuration?: number;
  onHover?: "speedUp" | "slowDown" | "pause" | "none";
  className?: string;
  forceFast?: boolean;
}

function CircularText({
  text = "VELLARI • PREMIUM • MAKHANA • DISCOVER • YOUR • PERFECT • FLAVOUR • ",
  spinDuration = 18,
  onHover = "speedUp",
  className = "",
  forceFast = false,
}: CircularTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  let finalDuration = spinDuration;
  if (forceFast) {
    finalDuration = spinDuration * 0.15;
  } else if (isHovered && onHover === "speedUp") {
    finalDuration = spinDuration * 0.35;
  }

  return (
    <motion.div
      className={`select-none cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: finalDuration, ease: "linear" }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        <path
          id="textCirclePath"
          d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
          fill="none"
        />
        <text className="text-[9.5px] uppercase font-[family-name:var(--font-accent)] font-bold tracking-[3px]" fill="rgba(212, 184, 122, 0.45)">
          <textPath href="#textCirclePath" startOffset="0%">
            {text}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
}

// Configurable 5 Questions
interface QuestionOption {
  label: string;
  value: string;
  icon: string;
}

interface Question {
  id: number;
  title: string;
  options: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What's your mood today?",
    options: [
      { label: "Relaxed", value: "relaxed", icon: "😊" },
      { label: "Energetic", value: "energetic", icon: "🔥" },
      { label: "Happy", value: "happy", icon: "😄" },
      { label: "Confident", value: "confident", icon: "😎" },
      { label: "Calm", value: "calm", icon: "🌿" },
      { label: "Excited", value: "excited", icon: "🤩" },
      { label: "Tired", value: "tired", icon: "😴" },
    ],
  },
  {
    id: 2,
    title: "Which snack sounds best right now?",
    options: [
      { label: "Classic", value: "classic", icon: "🧂" },
      { label: "Spicy", value: "spicy", icon: "🌶️" },
      { label: "Cheesy", value: "cheesy", icon: "🧀" },
      { label: "Refreshing", value: "refreshing", icon: "🍃" },
      { label: "Tangy", value: "tangy", icon: "🍅" },
    ],
  },
  {
    id: 3,
    title: "Where are you eating today?",
    options: [
      { label: "Working", value: "working", icon: "💻" },
      { label: "Watching Movies", value: "movies", icon: "🎬" },
      { label: "Travelling", value: "travelling", icon: "✈️" },
      { label: "Gym", value: "gym", icon: "💪" },
      { label: "Office", value: "office", icon: "🏢" },
      { label: "Late Night Study", value: "study", icon: "📚" },
      { label: "Friends", value: "friends", icon: "👥" },
    ],
  },
  {
    id: 4,
    title: "Choose your vibe.",
    options: [
      { label: "Comfort Food", value: "comfort", icon: "🥣" },
      { label: "Adventure", value: "adventure", icon: "🧗" },
      { label: "Healthy Choice", value: "healthy", icon: "🥗" },
      { label: "Something Different", value: "different", icon: "🌀" },
      { label: "Refreshing", value: "refreshing", icon: "🍃" },
    ],
  },
  {
    id: 5,
    title: "Which colour attracts you the most?",
    options: [
      { label: "Green", value: "green", icon: "🟢" },
      { label: "Red", value: "red", icon: "🔴" },
      { label: "Yellow", value: "yellow", icon: "🟡" },
      { label: "Orange", value: "orange", icon: "🟠" },
      { label: "Cream", value: "cream", icon: "⚪" },
      { label: "Purple", value: "purple", icon: "🟣" },
    ],
  },
];

const FLAVOUR_SCORES: Record<string, Record<string, number>> = {
  "love-bite": { cheesy: 4, comfort: 3, relaxed: 2, happy: 2, yellow: 3, movies: 2 },
  "blush": { tangy: 4, adventure: 3, excited: 2, orange: 3, friends: 2 },
  "green-flag": { refreshing: 4, calm: 3, green: 4, healthy: 3, gym: 2 },
  "red-flag": { energetic: 4, spicy: 4, red: 4, excited: 2, confident: 3 },
  "crush-me": { classic: 4, tired: 3, cream: 4, study: 2, working: 2 },
  "soulmate": { social: 4, different: 3, purple: 4, happy: 2, office: 2 },
};

export default function FindMyFlavour() {
  const [step, setStep] = useState<"landing" | "camera" | "preview" | "questions" | "analyzing" | "result">("landing");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState("Initializing analysis engine...");
  const [recommendedSlug, setRecommendedSlug] = useState("green-flag");
  const [cameraError, setCameraError] = useState(false);
  
  // Camera simulation state for trust metrics
  const [faceDetected, setFaceDetected] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Mouse Interaction coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Camera Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Monitor mouse movements for subtle parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 35,
        y: (e.clientY / window.innerHeight - 0.5) * 35,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Stop camera stream helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start camera stream
  const startCamera = async () => {
    setCameraError(false);
    setFaceDetected(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // Simulate face detection feedback hook
      setTimeout(() => {
        setFaceDetected(true);
      }, 1500);
    } catch (err) {
      console.warn("Camera permission denied or unavailable, falling back.", err);
      setCameraError(true);
    }
  };

  // Handle step transitions with premium zoom transition delays
  const startJourney = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsModalOpen(true);
      setStep("camera");
      setIsTransitioning(false);
      setTimeout(() => {
        startCamera();
      }, 200);
    }, 1100);
  };

  // Capture Selfie Photo frame with simulated hardware camera flash
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    setFlashActive(true);
    setTimeout(() => {
      setFlashActive(false);
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUrl);
        stopCamera();
        setStep("preview");
      }
    }, 150); // Flash trigger latency
  };

  // Handle local file upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
        setStep("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setStep("camera");
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // Skip photo selection
  const skipPhoto = () => {
    stopCamera();
    setStep("questions");
  };

  // Select Option answer
  const selectOption = (val: string) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      computeRecommendation(newAnswers);
      setStep("analyzing");
    }
  };

  // Score mappings and select flavor slug
  const computeRecommendation = (finalAnswers: string[]) => {
    const scores: Record<string, number> = {
      "love-bite": 0,
      "blush": 0,
      "green-flag": 0,
      "red-flag": 0,
      "crush-me": 0,
      "soulmate": 0,
    };

    finalAnswers.forEach((answer) => {
      Object.keys(scores).forEach((slug) => {
        const weight = FLAVOUR_SCORES[slug]?.[answer] || 0;
        scores[slug] += weight;
      });
    });

    let bestSlug = "green-flag";
    let highestScore = -1;
    Object.keys(scores).forEach((slug) => {
      if (scores[slug] > highestScore) {
        highestScore = scores[slug];
        bestSlug = slug;
      }
    });

    setRecommendedSlug(bestSlug);
  };

  // AI loading sequence animation
  useEffect(() => {
    if (step !== "analyzing") return;

    setAnalysisProgress(0);
    const intervals = [
      { threshold: 25, text: "Scanning selfie features..." },
      { threshold: 50, text: "Gauging flavor temperament..." },
      { threshold: 75, text: "Calibrating crisp threshold..." },
      { threshold: 100, text: "Calculating final crunch match..." },
    ];

    let currentProgress = 0;
    const intervalId = setInterval(() => {
      currentProgress += 2.5;
      setAnalysisProgress(currentProgress);

      const phrase = intervals.find((int) => currentProgress <= int.threshold);
      if (phrase) {
        setAnalysisText(phrase.text);
      }

      if (currentProgress >= 100) {
        clearInterval(intervalId);
        setTimeout(() => {
          setStep("result");
        }, 300);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [step]);

  // Cleanup camera streams on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const recommendedProduct = products.find((p) => p.slug === recommendedSlug) || products[0];

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col items-center justify-center pt-32 pb-24 px-6">
        
        {/* FLASH CAMERA SCREEN OVERLAY EFFECT */}
        <AnimatePresence>
          {flashActive && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-white z-[100] pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* 
          ==================================================
          PREMIUM BACKGROUND INTERACTIVE LAYERS
          ==================================================
        */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Animated Branding Light Blobs */}
          <motion.div
            animate={{
              x: [mousePos.x * 0.4, mousePos.x * -0.4, mousePos.x * 0.4],
              y: [mousePos.y * 0.4, mousePos.y * -0.4, mousePos.y * 0.4],
              scale: isTransitioning ? 1.5 : 1,
            }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-gradient-to-r from-v-gold/5 to-yellow-600/5 blur-[160px] animate-pulse"
          />
          <motion.div
            animate={{
              x: [mousePos.x * -0.6, mousePos.x * 0.6, mousePos.x * -0.6],
              y: [mousePos.y * -0.6, mousePos.y * 0.6, mousePos.y * -0.6],
            }}
            transition={{ type: "spring", stiffness: 45, damping: 25 }}
            className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-green-500/5 to-emerald-600/5 blur-[150px] animate-pulse"
            style={{ animationDelay: "2.5s" }}
          />

          {/* Floating Premium Ingredients & Mascot Stickers */}
          <motion.div
            animate={{
              x: mousePos.x * -0.8,
              y: mousePos.y * -0.8,
            }}
            className="absolute top-28 left-[15%] text-4xl opacity-30 select-none hidden lg:block"
          >
            🌿
          </motion.div>
          <motion.div
            animate={{
              x: mousePos.x * 1.2,
              y: mousePos.y * 1.2,
            }}
            className="absolute top-48 right-[18%] text-4xl opacity-20 select-none hidden lg:block"
          >
            🧀
          </motion.div>
          <motion.div
            animate={{
              x: mousePos.x * -0.5,
              y: mousePos.y * 0.5,
            }}
            className="absolute bottom-36 left-[12%] text-3xl opacity-25 select-none hidden lg:block"
          >
            🌶️
          </motion.div>
          <motion.div
            animate={{
              x: mousePos.x * 0.9,
              y: mousePos.y * -0.9,
            }}
            className="absolute bottom-28 right-[15%] text-4xl opacity-25 select-none hidden lg:block"
          >
            🍅
          </motion.div>

          {/* Floating Makhanas */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute block h-2 w-2 rounded-full bg-v-gold/15 animate-ping"
              style={{
                top: `${15 + (i * 12) % 75}%`,
                left: `${8 + (i * 19) % 85}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + (i % 3)}s`,
              }}
            />
          ))}
        </div>

        {/* Ambient Film Grain Overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none -z-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="w-full max-w-3xl relative z-10 flex flex-col items-center justify-center">
          
          {/* STATIC LANDING PAGE HERO */}
          {step === "landing" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isTransitioning ? 0 : 1,
                y: isTransitioning ? -40 : 0,
                scale: isTransitioning ? 0.9 : 1,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center flex flex-col items-center relative"
            >
              
              {/* Premium Floating Circular Text Widget Behind Header */}
              <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-72 h-72 -z-10 opacity-60 pointer-events-auto">
                <CircularText
                  text="VELLARI • PREMIUM • MAKHANA • DISCOVER • YOUR • PERFECT • FLAVOUR • "
                  spinDuration={18}
                  onHover="speedUp"
                  forceFast={isTransitioning}
                />
              </div>

              {/* Glowing Orb AI scanner visual element */}
              <motion.div
                animate={{
                  scale: isTransitioning ? [1, 2.5, 0] : [1, 1.08, 1],
                  rotate: isTransitioning ? 360 : 0,
                }}
                transition={{ duration: isTransitioning ? 1 : 3, ease: "easeInOut" }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-v-gold/30 to-yellow-600/10 border border-v-gold/40 flex items-center justify-center shadow-[0_0_40px_rgba(212,184,122,0.25)] mb-12 mt-6"
              >
                <Sparkles size={20} className="text-v-gold animate-pulse" />
              </motion.div>

              <span className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-v-gold/10 text-v-gold text-[10px] sm:text-xs uppercase tracking-[5px] font-accent font-bold mb-8 border border-v-gold/20 shadow-[0_0_20px_rgba(212,184,122,0.1)]">
                AI Guidance System
              </span>

              <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-[4px] mb-8 leading-[1.25] max-w-2xl font-[family-name:var(--font-accent)]">
                Find Your <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF6E3] to-v-gold">
                  Perfect Crunch.
                </span>
              </h1>
              
              <p className="text-white/60 text-base sm:text-xl font-light leading-[1.85] max-w-lg mb-16 tracking-[1.5px]">
                Answer a few quick questions and let our AI match you with the premium Vellari Foxnut flavour that matches your vibe.
              </p>

              {/* Large Premium Wider/Taller CTA Button with Ring Light effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-v-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.button
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={startJourney}
                  className="relative inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-v-gold px-14 py-6 font-[family-name:var(--font-accent)] text-xs font-black uppercase tracking-[3px] text-black shadow-2xl transition-all duration-300 border border-v-gold/30 hover:shadow-v-gold/25"
                >
                  Start My Flavour Journey
                  <ArrowRight size={14} className="transform group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </div>

              {/* Spaced Helper Text */}
              <span className="text-white/40 text-[10px] uppercase tracking-[3px] font-accent mt-8 block">
                Takes less than 30 seconds · No sign-up required
              </span>
            </motion.div>
          )}

          {/* FULL SCREEN MODAL WIZARD CONTAINER */}
          <AnimatePresence>
            {isModalOpen && step !== "landing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 overflow-y-auto"
              >
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-v-gold/5 blur-[120px] animate-pulse" />
                </div>

                <div className="w-full max-w-5xl relative z-10">
                  
                  {/* CLOSE MODAL BUTTON */}
                  <button
                    onClick={() => {
                      stopCamera();
                      setIsModalOpen(false);
                      setStep("landing");
                      setAnswers([]);
                      setCurrentQuestionIndex(0);
                      setCapturedImage(null);
                    }}
                    className="absolute -top-12 right-0 md:-right-12 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition"
                  >
                    <X size={18} className="text-white/70" />
                  </button>

                  <AnimatePresence mode="wait">
                    
                    {/* CAMERA STEP: LUXURY TWO-COLUMN LAYOUT */}
                    {step === "camera" && (
                      <motion.div
                        key="camera"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                      >
                        
                        {/* LEFT COLUMN: LIVE SCANNER FRAME */}
                        <div className="lg:col-span-7 flex flex-col items-center">
                          <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex items-center justify-center group">
                            
                            {/* Inner Scanning overlay brackets */}
                            <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-v-gold/60 rounded-tl-lg pointer-events-none" />
                            <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-v-gold/60 rounded-tr-lg pointer-events-none" />
                            <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-v-gold/60 rounded-bl-lg pointer-events-none" />
                            <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-v-gold/60 rounded-br-lg pointer-events-none" />
                            
                            {/* Face alignment outline guide */}
                            <div className="absolute w-56 h-56 rounded-full border border-dashed border-v-gold/30 flex items-center justify-center pointer-events-none">
                              <div className="w-48 h-48 rounded-full border border-dashed border-v-gold/20 animate-pulse" />
                            </div>

                            {/* Moving focus scanline */}
                            <motion.div
                              animate={{ y: ["-100%", "100%", "-100%"] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-v-gold/40 to-transparent pointer-events-none"
                            />

                            {cameraError ? (
                              <div className="flex flex-col items-center gap-2 p-6 text-white/40 z-10">
                                <Camera size={40} strokeWidth={1} />
                                <span className="text-xs font-accent tracking-wider uppercase">Camera access blocked</span>
                                <span className="text-[10px] text-white/30">Please upload a photo from the sidebar.</span>
                              </div>
                            ) : (
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover scale-x-[-1]"
                              />
                            )}

                            {/* Floating detection feedback badge */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md border border-white/10 rounded-full py-1.5 px-4 flex items-center gap-2 shadow-lg">
                              <div className={`w-2 h-2 rounded-full ${faceDetected && !cameraError ? 'bg-green-400 animate-ping' : 'bg-yellow-400'}`} />
                              <span className="text-[10px] font-accent uppercase tracking-widest text-white/90">
                                {cameraError ? 'System Offline' : faceDetected ? '✓ Face Detected' : 'Detecting Alignment...'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: CONTROLS & PRIVACY */}
                        <div className="lg:col-span-5 flex flex-col justify-center text-left">
                          <span className="text-v-gold text-[10px] font-accent font-black uppercase tracking-[4px] mb-4">
                            Step 01 / Onboarding
                          </span>
                          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6 leading-tight font-accent">
                            Snap Your <br />Selfie
                          </h2>
                          <p className="text-white/60 text-sm leading-relaxed mb-8 font-light">
                            Take a quick selfie to personalise your flavour journey. This visual identity will customize your analysis report.
                          </p>

                          {/* Privacy Cards */}
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4 mb-8">
                            <div className="flex items-start gap-4">
                              <span className="text-v-gold text-lg">🔒</span>
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Secure Capture</h4>
                                <p className="text-white/40 text-[10px]">Your photo is never saved or uploaded to servers.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 border-t border-white/5 pt-4">
                              <span className="text-v-gold text-lg">⚡</span>
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Instant Recommendations</h4>
                                <p className="text-white/40 text-[10px]">Analyzes features on-the-fly to customize result card assets.</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 border-t border-white/5 pt-4">
                              <span className="text-v-gold text-lg">🗑</span>
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Auto-Discard</h4>
                                <p className="text-white/40 text-[10px]">Session memory is entirely cleared after recommendations close.</p>
                              </div>
                            </div>
                          </div>

                          {/* Action controls */}
                          <div className="flex flex-col gap-3">
                            {!cameraError && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={capturePhoto}
                                className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-v-gold text-black py-4 font-[family-name:var(--font-accent)] text-xs font-black uppercase tracking-widest shadow-lg shadow-v-gold/15"
                              >
                                <Camera size={14} />
                                Capture Selfie
                              </motion.button>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 py-3.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition text-white/90"
                              >
                                <Upload size={14} />
                                Upload Photo
                              </button>

                              <button
                                onClick={skipPhoto}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 py-3.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition text-white/90"
                              >
                                <SkipForward size={14} />
                                Skip
                              </button>
                            </div>

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </div>
                        </div>

                      </motion.div>
                    )}

                    {/* PREVIEW STEP */}
                    {step === "preview" && (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#111111]/80 border border-white/5 rounded-[3rem] p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl"
                      >
                        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3 font-body">Your Photo</h2>
                        <p className="text-white/50 text-xs sm:text-sm max-w-sm mb-8 font-light">
                          Perfect! Let's continue to the questions.
                        </p>

                        <div className="relative w-full max-w-[320px] aspect-square rounded-full overflow-hidden border-2 border-v-gold mb-8 flex items-center justify-center">
                          {capturedImage && (
                            <img
                              src={capturedImage}
                              alt="Selfie Preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex gap-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={retakePhoto}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-8 py-3.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-wider"
                          >
                            Retake
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep("questions")}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-v-gold text-black px-8 py-3.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-wider"
                          >
                            Continue
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* QUESTIONS STEP */}
                    {step === "questions" && (
                      <motion.div
                        key="questions"
                        initial={{ opacity: 0, x: 55 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -55 }}
                        className="bg-[#111111]/80 border border-white/5 rounded-[3rem] p-8 sm:p-12 shadow-2xl relative"
                      >
                        <div className="flex justify-between items-center mb-8">
                          <span className="text-v-gold text-xs uppercase tracking-[3px] font-accent font-bold">
                            Question {QUESTIONS[currentQuestionIndex].id} of {QUESTIONS.length}
                          </span>
                          <div className="flex gap-1.5">
                            {QUESTIONS.map((q, idx) => (
                              <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  idx <= currentQuestionIndex ? "w-6 bg-v-gold" : "w-2 bg-white/10"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-8">
                          {QUESTIONS[currentQuestionIndex].title}
                        </h3>

                        <div className="grid grid-cols-1 gap-3 max-h-[360px] overflow-y-auto pr-1">
                          {QUESTIONS[currentQuestionIndex].options.map((opt) => (
                            <motion.button
                              key={opt.value}
                              whileHover={{ scale: 1.015 }}
                              whileTap={{ scale: 0.985 }}
                              onClick={() => selectOption(opt.value)}
                              className="w-full text-left rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 p-4 sm:p-5 flex items-center justify-between group transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-2xl">{opt.icon}</span>
                                <span className="font-medium text-white/80 group-hover:text-white transition">{opt.label}</span>
                              </div>
                              <div className="h-6 w-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-v-gold/40 group-hover:bg-v-gold/10 transition">
                                <Check size={12} className="text-v-gold opacity-0 group-hover:opacity-100 transition" />
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ANALYZING STEP */}
                    {step === "analyzing" && (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-[#111111]/80 border border-white/5 rounded-[3rem] p-8 sm:p-12 text-center flex flex-col items-center shadow-2xl"
                      >
                        {capturedImage ? (
                          <div className="relative mb-8 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-v-gold shadow-lg">
                              <img
                                src={capturedImage}
                                alt="Analyzing selfie"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-2 bg-v-gold text-black text-[9px] font-accent font-black uppercase px-3 py-1 rounded-full shadow-md animate-bounce">
                              Looking Good!
                            </div>
                          </div>
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="text-v-gold mb-8"
                          >
                            <RefreshCw size={48} strokeWidth={1.5} />
                          </motion.div>
                        )}

                        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3">
                          Analysing Your Flavour...
                        </h3>
                        <p className="text-white/50 text-sm font-light mb-8 h-6">
                          {analysisText}
                        </p>

                        <div className="w-full max-w-xs h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div
                            className="h-full bg-v-gold"
                            style={{ width: `${analysisProgress}%` }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* RESULTS STEP: FULL SCREEN PREMIUM LAYOUT */}
                    {step === "result" && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                      >
                        
                        {/* LEFT COLUMN: FLAVOUR SHOWCASE */}
                        <div className="lg:col-span-6 flex flex-col items-center relative">
                          <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center group mb-6 z-10">
                            <div className="absolute h-64 w-64 rounded-full blur-[80px] opacity-40 -z-10 animate-pulse" style={{ background: recommendedProduct.color }} />
                            <Image
                              src={recommendedProduct.image}
                              alt={recommendedProduct.name}
                              width={260}
                              height={260}
                              priority
                              className="object-contain transform hover:scale-105 transition-transform duration-500 ease-out z-10"
                            />
                          </div>

                          {capturedImage && (
                            <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-black/85 border border-white/10 rounded-full py-2 px-5 flex items-center gap-3 shadow-xl z-20">
                              <img
                                src={capturedImage}
                                alt="Selfie thumbnail"
                                className="w-8 h-8 rounded-full object-cover border border-v-gold"
                              />
                              <div className="text-left">
                                <h4 className="text-[10px] font-accent font-black uppercase text-v-gold">Match Verified</h4>
                                <p className="text-[8px] text-white/50">Personalised recommendation</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: METRICS & DETAILS */}
                        <div className="lg:col-span-6 flex flex-col justify-center text-left">
                          <span className="text-v-gold text-[10px] font-accent font-black uppercase tracking-[4px] mb-4">
                            Your Perfect Match
                          </span>
                          <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-6 font-accent leading-tight">
                            {recommendedProduct.name}
                          </h2>

                          <p className="text-white/70 text-sm leading-relaxed mb-8 font-light">
                            You seem calm, refreshing, and balanced today. Based on your mood and flavor profiles, we think <strong className="text-white font-bold">{recommendedProduct.name}</strong> is the perfect fit to elevate your crunch game.
                          </p>

                          {/* Match metrics with premium meters */}
                          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6 mb-8">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-white/50 uppercase tracking-widest text-[10px]">Vellari Core Fit</span>
                              <span className="font-accent font-black text-v-gold text-sm">95% MATCH</span>
                            </div>

                            {/* Taste Meter */}
                            <div className="space-y-2 border-t border-white/5 pt-4">
                              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-wider">
                                <span>Taste Intensity (Crunchiness)</span>
                                <span className="text-white">90%</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-v-gold" style={{ width: "90%" }} />
                              </div>
                            </div>

                            {/* Mood Meter */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-wider">
                                <span>Mood Temperament (Aroma Match)</span>
                                <span className="text-white">95%</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-v-gold" style={{ width: "95%" }} />
                              </div>
                            </div>
                          </div>

                          {/* CTA Actions */}
                          <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Link href={`/flavours/${recommendedProduct.slug}`} className="flex-1">
                              <motion.span
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsModalOpen(false)}
                                className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-v-gold text-black py-4 font-[family-name:var(--font-accent)] text-xs font-black uppercase tracking-widest shadow-lg shadow-v-gold/15"
                              >
                                Explore This Flavour
                                <ArrowRight size={14} />
                              </motion.span>
                            </Link>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setAnswers([]);
                                setCurrentQuestionIndex(0);
                                setCapturedImage(null);
                                setStep("camera");
                                setTimeout(() => startCamera(), 100);
                              }}
                              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-8 py-4 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition"
                            >
                              Try Again
                            </motion.button>
                          </div>
                        </div>

                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      <Footer />
    </>
  );
}
