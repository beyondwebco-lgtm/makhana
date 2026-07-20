"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, SkipForward, ArrowRight, RefreshCw, Sparkles, Check, X, Star, Activity, Leaf, Heart, Lock } from "lucide-react";
import Image from "next/image";
import { products } from "@/data/products";
import LightRays from "@/components/ui/LightRays";

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
        <text className="text-[9.5px] uppercase font-[family-name:var(--font-accent)] font-bold tracking-[4px]" fill="rgba(212, 184, 122, 0.45)">
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
  "blush": { tangy: 4, adventure: 3, excited: 2, orange: 3, friends: 2, travelling: 3 },
  "green-flag": { refreshing: 4, calm: 3, green: 4, healthy: 3, gym: 2 },
  "red-flag": { energetic: 4, spicy: 4, red: 4, excited: 2, confident: 3, adventure: 2 },
  "crush-me": { classic: 4, tired: 3, cream: 4, study: 2, working: 2, comfort: 2 },
  "soulmate": { classic: 2, different: 4, purple: 4, happy: 3, office: 3, friends: 2, confident: 2 },
};

const THEME_COLORS: Record<string, string> = {
  "default": "#D4AF37",      // Warm Champagne Gold
  "love-bite": "#F2C94C",    // Golden Yellow
  "blush": "#FF7043",        // Orange Red (Tangy Tomato)
  "green-flag": "#6CCB5F",   // Mint Green
  "red-flag": "#D94A38",     // Deep Red
  "crush-me": "#D4AF37",     // Warm Champagne Gold
  "soulmate": "#9b5de5",     // Deep Purple
};

const FLAVOUR_STYLING: Record<string, { ingredients: string[], lighting: string, bowlFilter: string }> = {
  "love-bite": { ingredients: ["🧀", "✨", "🍿"], lighting: "from-yellow-500/20 to-orange-500/5", bowlFilter: "sepia(0.3) brightness(1.1) contrast(1.1)" },
  "green-flag": { ingredients: ["🌿", "🍃", "🍋"], lighting: "from-green-500/20 to-emerald-500/5", bowlFilter: "brightness(1.1) contrast(1.05)" },
  "red-flag": { ingredients: ["🌶️", "🔥", "🍅"], lighting: "from-red-600/20 to-orange-600/5", bowlFilter: "saturate(1.2) contrast(1.15)" },
  "blush": { ingredients: ["🍅", "🌿", "🧂"], lighting: "from-orange-500/20 to-red-500/5", bowlFilter: "saturate(1.1) contrast(1.1)" },
  "crush-me": { ingredients: ["🧂", "⚪", "🥣"], lighting: "from-amber-200/20 to-yellow-100/5", bowlFilter: "brightness(1.05)" },
  "soulmate": { ingredients: ["✨", "🔮", "🌶️"], lighting: "from-purple-500/20 to-pink-500/5", bowlFilter: "contrast(1.1) hue-rotate(-10deg)" },
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
  const [flashActive, setFlashActive] = useState(false);

  const [rayColor, setRayColor] = useState(THEME_COLORS.default);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "result" || step === "analyzing") {
      setRayColor(THEME_COLORS[recommendedSlug] || THEME_COLORS.default);
    } else {
      setRayColor(THEME_COLORS.default);
    }
  }, [step, recommendedSlug]);

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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera permission denied or unavailable, falling back.", err);
      setCameraError(true);
    }
  };

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
    }, 150);
  };

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

  const retakePhoto = () => {
    setCapturedImage(null);
    setStep("camera");
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const skipPhoto = () => {
    stopCamera();
    setStep("questions");
  };

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

    let bestSlugs: string[] = [];
    let highestScore = -1;

    Object.keys(scores).forEach((slug) => {
      if (scores[slug] > highestScore) {
        highestScore = scores[slug];
        bestSlugs = [slug];
      } else if (scores[slug] === highestScore) {
        bestSlugs.push(slug);
      }
    });

    // Randomly pick one if there's a tie
    const finalBest = bestSlugs[Math.floor(Math.random() * bestSlugs.length)];

    setRecommendedSlug(finalBest || "green-flag");
  };

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

        {/* GLOBAL BACKGROUND: REACT BITS LIGHTRAYS */}
        <div className="absolute inset-0 pointer-events-none -z-20">
          <LightRays
            raysOrigin="top-center"
            raysColor={rayColor}
            raysSpeed={1.2}
            lightSpread={0.75}
            rayLength={1.4}
            pulsating={true}
            fadeDistance={1.2}
            saturation={0.9}
            followMouse={true}
            mouseInfluence={0.08}
            noiseAmount={0.08}
            distortion={0.03}
          />
        </div>

        <div className="absolute inset-0 bg-black/20 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_30%,rgba(5,5,5,0.85)_100%)]" />

        {/* Floating Premium Ingredients & Mascot Stickers */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <motion.div
            animate={{ x: mousePos.x * -0.8, y: mousePos.y * -0.8 }}
            className="absolute top-28 left-[15%] text-4xl opacity-30 select-none hidden lg:block"
          >
            🌿
          </motion.div>
          <motion.div
            animate={{ x: mousePos.x * 1.2, y: mousePos.y * 1.2 }}
            className="absolute top-48 right-[18%] text-4xl opacity-20 select-none hidden lg:block"
          >
            🧀
          </motion.div>
          <motion.div
            animate={{ x: mousePos.x * -0.5, y: mousePos.y * 0.5 }}
            className="absolute bottom-36 left-[12%] text-3xl opacity-25 select-none hidden lg:block"
          >
            🌶️
          </motion.div>
          <motion.div
            animate={{ x: mousePos.x * 0.9, y: mousePos.y * -0.9 }}
            className="absolute bottom-28 right-[15%] text-4xl opacity-25 select-none hidden lg:block"
          >
            🍅
          </motion.div>

          {/* Floating sparks */}
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
              
              <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-72 h-72 -z-10 opacity-60 pointer-events-auto">
                <CircularText
                  text="VELLARI • PREMIUM • MAKHANA • DISCOVER • YOUR • PERFECT • FLAVOUR • "
                  spinDuration={18}
                  onHover="speedUp"
                  forceFast={isTransitioning}
                />
              </div>

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

              <span className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-v-gold/10 text-v-gold text-[10px] sm:text-xs uppercase tracking-[6px] font-accent font-bold mb-8 border border-v-gold/20 shadow-[0_0_20px_rgba(212,184,122,0.1)]">
                AI Guidance System
              </span>

              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-[8px] mb-8 leading-[1.25] max-w-2xl font-[family-name:var(--font-accent)] text-white">
                Find Your <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF6E3] to-v-gold">
                  Perfect Crunch.
                </span>
              </h1>
              
              <p className="text-white/60 text-base sm:text-xl font-light leading-[1.85] max-w-lg mb-16 tracking-[1.5px]">
                Answer a few quick questions and let our AI match you with the premium Vellari Foxnut flavour that matches your vibe.
              </p>

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

              <span className="text-white/40 text-[10px] uppercase tracking-[3px] font-accent mt-8 block">
                Takes less than 30 seconds · No sign-up required
              </span>
            </motion.div>
          )}

          {/* LARGE EXPANDED 85-90VW MODAL WIZARD CONTAINER */}
          <AnimatePresence>
            {isModalOpen && step !== "landing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12 overflow-y-auto"
              >
                <div className="w-[88vw] h-[85vh] max-w-[1600px] max-height-[900px] bg-[#111111]/85 border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-y-auto flex flex-col justify-between backdrop-blur-md">
                  
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
                    className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition z-55"
                  >
                    <X size={20} className="text-white/70" />
                  </button>

                  <AnimatePresence mode="wait">
                    
                    {/* CAMERA STEP: LUXURY TWO-COLUMN LAYOUT */}
                    {step === "camera" && (
                      <motion.div
                        key="camera"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                      >
                        {/* LEFT COLUMN: LIVE SCANNER FRAME (65%) */}
                        <div className="lg:col-span-7 flex flex-col items-center">
                          <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/40 shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex items-center justify-center group">
                            
                            {/* Inner Scanning overlay brackets */}
                            <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-v-gold/60 rounded-tl-lg pointer-events-none" />
                            <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-v-gold/60 rounded-tr-lg pointer-events-none" />
                            <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-v-gold/60 rounded-bl-lg pointer-events-none" />
                            <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-v-gold/60 rounded-br-lg pointer-events-none" />
                            
                            {/* Moving focus scanline */}
                            <motion.div
                              animate={{ y: ["-100%", "100%", "-100%"] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-v-gold/45 to-transparent pointer-events-none"
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
                          </div>
                        </div>

                        {/* RIGHT COLUMN: CONTROLS & PRIVACY (35%) */}
                        <div className="lg:col-span-5 flex flex-col justify-center text-left">
                          <span className="text-v-gold text-[11px] font-accent font-black uppercase tracking-[4px] mb-4">
                            Step 01 / Onboarding
                          </span>
                          <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-[6px] mb-6 leading-tight font-accent text-white">
                            Snap Your Selfie
                          </h2>
                          <p className="text-white/60 text-base leading-relaxed mb-8 font-light tracking-[1px]">
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

                          {/* Action controls without overlapping */}
                          <div className="flex flex-col gap-4">
                            {!cameraError && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={capturePhoto}
                                className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-v-gold text-black py-4.5 font-[family-name:var(--font-accent)] text-xs font-black uppercase tracking-[3px] shadow-lg shadow-v-gold/15"
                              >
                                <Camera size={14} />
                                Capture Selfie
                              </motion.button>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 py-4.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-[2px] hover:bg-white/10 transition text-white/90"
                              >
                                <Upload size={14} />
                                Upload Photo
                              </button>

                              <button
                                onClick={skipPhoto}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 py-4.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-[2px] hover:bg-white/10 transition text-white/90"
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
                        className="w-full h-full flex flex-col items-center justify-center text-center p-6 gap-6"
                      >
                        <h2 className="text-4xl font-black uppercase tracking-[6px] text-white font-body">Your Photo</h2>
                        <p className="text-white/50 text-base max-w-sm font-light tracking-[1px]">
                          Looking good! Let's continue to the questions.
                        </p>

                        <div className="relative w-72 h-72 rounded-full overflow-hidden border-2 border-v-gold flex items-center justify-center shadow-2xl">
                          {capturedImage && (
                            <img
                              src={capturedImage}
                              alt="Selfie Preview"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="flex gap-4 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={retakePhoto}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-10 py-4.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-[2px] text-white"
                          >
                            Retake
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep("questions")}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-v-gold text-black px-10 py-4.5 font-[family-name:var(--font-accent)] text-xs font-black uppercase tracking-[2px]"
                          >
                            Continue
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* QUESTIONS STEP: CENTERED AND ALIGNED NICELY */}
                    {step === "questions" && (
                      <motion.div
                        key={`q-${currentQuestionIndex}`}
                        initial={{ opacity: 0, x: 100, filter: "blur(4px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, x: -100, filter: "blur(4px)" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full h-full flex flex-col justify-start"
                      >
                        {/* Header metadata info */}
                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                          <span className="text-v-gold text-xs uppercase tracking-[4px] font-accent font-black">
                            Question {QUESTIONS[currentQuestionIndex].id} of {QUESTIONS.length}
                          </span>
                          <div className="flex gap-2">
                            {QUESTIONS.map((q, idx) => (
                              <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  idx <= currentQuestionIndex ? "w-8 bg-v-gold" : "w-3 bg-white/10"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Centered spacious Question title */}
                        <div className="max-w-3xl mb-8 mt-4 pl-2">
                          <h3 className="text-4xl sm:text-5xl font-black uppercase tracking-[4px] text-white leading-tight font-accent">
                            {QUESTIONS[currentQuestionIndex].title}
                          </h3>
                        </div>

                        {/* Large Glassmorphism answer cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1 mb-8 pl-2">
                          {QUESTIONS[currentQuestionIndex].options.map((opt) => (
                            <motion.button
                              key={opt.value}
                              whileHover={{ scale: 1.015, y: -2 }}
                              whileTap={{ scale: 0.985 }}
                              onClick={() => selectOption(opt.value)}
                              className="w-full text-left rounded-2xl bg-white/5 border border-white/5 hover:border-v-gold/30 p-6 flex items-center justify-between group transition-all backdrop-blur-sm hover:shadow-[0_0_25px_rgba(212,184,122,0.05)]"
                            >
                              <div className="flex items-center gap-6">
                                <span className="text-3xl">{opt.icon}</span>
                                <span className="text-lg font-medium text-white/80 group-hover:text-white transition tracking-[1.5px]">{opt.label}</span>
                              </div>
                              <div className="h-7 w-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-v-gold/50 group-hover:bg-v-gold/15 transition">
                                <Check size={14} className="text-v-gold opacity-0 group-hover:opacity-100 transition" />
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
                        className="w-full h-full flex flex-col items-center justify-center text-center gap-6"
                      >
                        {capturedImage ? (
                          <div className="relative mb-6 flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-v-gold shadow-2xl">
                              <img
                                src={capturedImage}
                                alt="Analyzing selfie"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-2 bg-v-gold text-black text-[10px] font-accent font-black uppercase px-4 py-1.5 rounded-full shadow-lg animate-bounce">
                              Looking Good!
                            </div>
                          </div>
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="text-v-gold mb-6"
                          >
                            <RefreshCw size={64} strokeWidth={1} />
                          </motion.div>
                        )}

                        <h3 className="text-3xl font-black uppercase tracking-[6px] text-white font-accent">
                          Analysing Your Flavour...
                        </h3>
                        <p className="text-white/50 text-base font-light h-6 tracking-[1px]">
                          {analysisText}
                        </p>

                        <div className="w-full max-w-sm h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 mt-4">
                          <motion.div
                            className="h-full bg-v-gold"
                            style={{ width: `${analysisProgress}%` }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* RESULTS STEP: REFERENCE IMAGE LAYOUT */}
                    {step === "result" && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center justify-center p-4 sm:p-12 max-w-[1400px] mx-auto"
                      >
                        {/* LEFT COLUMN: PREMIUM FOOD PHOTOGRAPHY COMPOSITION */}
                        <div className="flex flex-col items-center justify-center relative w-full h-full min-h-[500px]">
                          <div className={`absolute inset-0 bg-gradient-to-tr ${FLAVOUR_STYLING[recommendedSlug]?.lighting || "from-v-gold/20 to-black"} rounded-full blur-[120px] opacity-40 -z-20`} />
                          
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="relative w-full aspect-square max-w-[550px] flex items-center justify-center z-10"
                          >
                            {/* Flavour specific floating ingredients */}
                            {(FLAVOUR_STYLING[recommendedSlug]?.ingredients || ["✨", "🌿", "🧂"]).map((icon, idx) => (
                              <motion.div
                                key={idx}
                                animate={{ 
                                  y: [0, -15, 0], 
                                  x: [0, idx % 2 === 0 ? 10 : -10, 0],
                                  rotate: [0, 10, -5, 0] 
                                }}
                                transition={{ repeat: Infinity, duration: 4 + idx * 1.5, ease: "easeInOut", delay: idx * 0.5 }}
                                className="absolute text-4xl lg:text-5xl opacity-80 drop-shadow-2xl z-30"
                                style={{
                                  top: idx === 0 ? '10%' : idx === 1 ? '70%' : '20%',
                                  left: idx === 0 ? '15%' : idx === 1 ? '20%' : '80%',
                                  filter: 'blur(1px)',
                                }}
                              >
                                {icon}
                              </motion.div>
                            ))}

                            {/* The Bowl Photo (Background) */}
                            <motion.div
                              animate={{ y: [0, 8, 0], rotate: [-2, 0, -2] }}
                              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                              className="absolute top-[5%] left-[5%] w-[75%] h-[75%] z-10"
                            >
                              <Image
                                src={`/assets/bowl/${recommendedSlug}.png`}
                                alt={`${recommendedProduct.name} Bowl`}
                                fill
                                priority
                                className="object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.8)]"
                                style={{ filter: FLAVOUR_STYLING[recommendedSlug]?.bowlFilter || 'none' }}
                              />
                            </motion.div>

                            {/* The Product Jar Photo (Foreground) */}
                            <motion.div
                              animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
                              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
                              className="absolute bottom-[5%] right-[5%] w-[65%] h-[65%] z-20"
                            >
                              <Image
                                src={recommendedProduct.image}
                                alt={recommendedProduct.name}
                                fill
                                priority
                                className="object-contain drop-shadow-[0_40px_40px_rgba(0,0,0,0.9)] transform hover:scale-105 transition-transform duration-700"
                              />
                            </motion.div>
                            
                            {/* Verified Selfie Badge */}
                            {capturedImage && (
                              <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full py-2.5 px-6 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-40"
                              >
                                <img
                                  src={capturedImage}
                                  alt="Selfie thumbnail"
                                  className="w-10 h-10 rounded-full object-cover border border-v-gold/50"
                                />
                                <div className="text-left">
                                  <h4 className="text-[11px] font-accent font-black uppercase text-v-gold tracking-widest">Match Verified</h4>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        </div>

                        {/* RIGHT COLUMN: DETAIL REPORT & COMPATIBILITY METERS */}
                        <div className="flex flex-col justify-center text-left w-full max-w-[650px] mx-auto lg:mx-0 z-20">
                          
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={14} className="text-v-gold" />
                            <span className="text-v-gold text-xs sm:text-sm font-bold uppercase tracking-[6px] block font-accent">
                              Your Perfect Match
                            </span>
                          </div>

                          <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black uppercase tracking-[8px] leading-none text-white mb-6 font-accent drop-shadow-lg">
                            {recommendedProduct.name}
                          </h2>

                          <p className="text-white/60 text-base sm:text-lg leading-[2] tracking-[1px] mb-8 font-light">
                            You seem calm, refreshing, and balanced today.<br className="hidden sm:block"/>
                            Based on your mood and flavor profiles, we think<br className="hidden sm:block"/>
                            <strong className="text-white font-medium">{recommendedProduct.name}</strong> is the perfect fit to elevate your crunch game.
                          </p>

                          {/* Separator with Heart */}
                          <div className="flex items-center gap-4 w-full mb-10 opacity-30">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-v-gold"></div>
                            <Heart size={14} className="text-v-gold fill-v-gold" />
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-v-gold"></div>
                          </div>

                          {/* Match metrics row-based layout */}
                          <div className="space-y-8 mb-12">
                            
                            {/* Metric 1 */}
                            <div className="w-full">
                              <div className="flex items-center gap-6 mb-4">
                                <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shadow-inner">
                                  <Star size={20} className="text-v-gold/80" />
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                  <div>
                                    <h4 className="text-v-gold font-accent font-bold text-sm tracking-[4px] uppercase">Vellari Core Fit</h4>
                                    <p className="text-white/40 text-[11px] tracking-[1px] mt-1">How well this flavour matches your vibe</p>
                                  </div>
                                  <span className="font-accent font-black text-v-gold text-base tracking-[3px]">95% MATCH</span>
                                </div>
                              </div>
                              <div className="w-full pl-[72px]">
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "95%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-v-gold rounded-full"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Metric 2 */}
                            <div className="w-full">
                              <div className="flex items-center gap-6 mb-4">
                                <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shadow-inner">
                                  <Activity size={20} className="text-v-gold/80" />
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                  <div>
                                    <h4 className="text-v-gold font-accent font-bold text-sm tracking-[4px] uppercase">Taste Intensity</h4>
                                    <p className="text-white/40 text-[11px] tracking-[1px] mt-1">Crunch level you'll absolutely enjoy</p>
                                  </div>
                                  <span className="font-accent font-black text-white text-base tracking-[3px]">90% MATCH</span>
                                </div>
                              </div>
                              <div className="w-full pl-[72px]">
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "90%" }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
                                    className="h-full bg-v-gold rounded-full"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Metric 3 */}
                            <div className="w-full">
                              <div className="flex items-center gap-6 mb-4">
                                <div className="w-12 h-12 shrink-0 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shadow-inner">
                                  <Leaf size={20} className="text-v-gold/80" />
                                </div>
                                <div className="flex-1 flex justify-between items-center">
                                  <div>
                                    <h4 className="text-v-gold font-accent font-bold text-sm tracking-[4px] uppercase">Mood Temperament</h4>
                                    <p className="text-white/40 text-[11px] tracking-[1px] mt-1">How this flavour complements your mood</p>
                                  </div>
                                  <span className="font-accent font-black text-white text-base tracking-[3px]">95% MATCH</span>
                                </div>
                              </div>
                              <div className="w-full pl-[72px]">
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "95%" }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                    className="h-full bg-v-gold rounded-full"
                                  />
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Action controls */}
                          <div className="flex flex-col sm:flex-row gap-5 w-full justify-start items-center">
                            <Link href={`/flavours/${recommendedProduct.slug}`} className="w-full sm:w-auto">
                              <motion.span
                                whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsModalOpen(false)}
                                className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#e1c564] text-black px-10 py-4 font-[family-name:var(--font-accent)] text-sm font-black uppercase tracking-[2px] shadow-[0_0_30px_rgba(212,184,122,0.25)]"
                              >
                                Explore This Flavour
                                <ArrowRight size={16} />
                              </motion.span>
                            </Link>

                            <motion.button
                              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setAnswers([]);
                                setCurrentQuestionIndex(0);
                                setCapturedImage(null);
                                setStep("camera");
                                setTimeout(() => startCamera(), 100);
                              }}
                              className="w-full sm:w-auto inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-transparent border border-white/20 px-10 py-4 font-[family-name:var(--font-accent)] text-sm font-bold uppercase tracking-[2px] text-white transition"
                            >
                              Try Again
                              <RefreshCw size={14} />
                            </motion.button>
                          </div>

                          {/* Privacy Footer */}
                          <div className="flex justify-center sm:justify-start items-center gap-2 mt-8 text-white/30 text-[10px] tracking-[0.5px]">
                            <Lock size={10} className="text-v-gold/60" />
                            <span>Your results are private and used only for this recommendation.</span>
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
