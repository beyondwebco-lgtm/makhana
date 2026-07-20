"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, SkipForward, ArrowRight, RefreshCw, Sparkles, Check } from "lucide-react";
import Image from "next/image";
import { products } from "@/data/products";

// Configurable Questions
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
    title: "What's your vibe today?",
    options: [
      { label: "Relaxed & Calm", value: "relaxed", icon: "😌" },
      { label: "Bold & Energetic", value: "bold", icon: "🔥" },
      { label: "Fun & Social", value: "social", icon: "🎉" },
      { label: "Focused & Productive", value: "focused", icon: "💻" },
      { label: "Fresh & Light", value: "fresh", icon: "🌿" },
    ],
  },
  {
    id: 2,
    title: "Which snack experience sounds best right now?",
    options: [
      { label: "Comforting", value: "comforting", icon: "🥣" },
      { label: "Spicy", value: "spicy", icon: "🌶️" },
      { label: "Cheesy", value: "cheesy", icon: "🧀" },
      { label: "Refreshing", value: "refreshing", icon: "🍃" },
      { label: "Classic", value: "classic", icon: "🧂" },
    ],
  },
  {
    id: 3,
    title: "Pick your current mood.",
    options: [
      { label: "Happy", value: "happy", icon: "😄" },
      { label: "Peaceful", value: "peaceful", icon: "😌" },
      { label: "Excited", value: "excited", icon: "🤩" },
      { label: "Tired", value: "tired", icon: "😴" },
      { label: "Confident", value: "confident", icon: "😎" },
      { label: "Curious", value: "curious", icon: "🤔" },
    ],
  },
];

// Slugs mapping score profile helper
const FLAVOUR_SCORES: Record<string, Record<string, number>> = {
  "love-bite": { cheesy: 4, comforting: 3, relaxed: 2, happy: 2, social: 1 },
  "blush": { fresh: 4, curious: 3, excited: 2, classic: 1 },
  "green-flag": { refreshing: 4, peaceful: 3, relaxed: 3, fresh: 2 },
  "red-flag": { bold: 4, spicy: 4, excited: 3, confident: 2 },
  "crush-me": { focused: 4, classic: 4, tired: 2, peaceful: 1 },
  "soulmate": { social: 4, comforting: 3, happy: 3, classic: 1 },
};

export default function FindMyFlavour() {
  const [step, setStep] = useState<"landing" | "camera" | "questions" | "analyzing" | "result">("landing");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState("Initializing analysis engine...");
  const [recommendedSlug, setRecommendedSlug] = useState("green-flag");

  // Camera Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera stream helper
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start camera stream
  const startCamera = async () => {
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
    }
  };

  // Handle step transitions
  const startJourney = () => {
    setStep("camera");
    // Start camera feed inside window context asynchronously
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // Capture Selfie Photo frame
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Flip horizontally for natural mirror selfie view
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(dataUrl);
      stopCamera();
      // Move directly to questions
      setStep("questions");
    }
  };

  // Handle local file upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
        setStep("questions");
      };
      reader.readAsDataURL(file);
    }
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
      // Done with questions, compute recommendation and run analysis animation
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

    // Find highest scoring slug
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
      currentProgress += 2;
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
        
        {/* Cinematic Background Gradients */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-yellow-500/5 blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[45vw] h-[45vw] rounded-full bg-green-500/5 blur-[150px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        {/* Ambient Film Grain Overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none -z-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="w-full max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: LANDING SCREEN */}
            {step === "landing" && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center flex flex-col items-center"
              >
                <span className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-[var(--v-gold)]/10 text-[var(--v-gold)] text-xs uppercase tracking-[4px] font-accent font-bold mb-6 border border-[var(--v-gold)]/20 shadow-[0_0_20px_rgba(212,184,122,0.1)]">
                  <Sparkles size={14} />
                  Flavour Discovery Engine
                </span>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6 leading-none">
                  Find Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFF0D4] to-[var(--v-gold)]">
                    Perfect Crunch.
                  </span>
                </h1>
                <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed max-w-md mb-12">
                  Answer a few quick questions and let our AI match you with the premium Vellari Foxnut flavour that matches your vibe.
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startJourney}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--v-gold)] px-10 py-5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest text-black shadow-lg shadow-[var(--v-gold)]/10 group"
                >
                  Start My Flavour Journey
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}

            {/* STEP 2: CAMERA PERMISSION & CAPTURE */}
            {step === "camera" && (
              <motion.div
                key="camera"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 sm:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none -z-10" />
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">Snap a Selfie</h2>
                <p className="text-white/50 text-xs sm:text-sm max-w-sm mb-8 font-light">
                  This photo is only used locally to personalize your result card experience and is never stored permanently.
                </p>

                {/* Video Preview viewport */}
                <div className="relative w-full max-w-[400px] aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/40 mb-8 flex items-center justify-center group">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute inset-0 border border-white/15 rounded-2xl pointer-events-none" />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={capturePhoto}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-wider"
                  >
                    <Camera size={14} />
                    Capture Photo
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-3.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition"
                  >
                    <Upload size={14} />
                    Upload Photo
                  </motion.button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={skipPhoto}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-6 py-3.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition"
                  >
                    <SkipForward size={14} />
                    Skip
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: MOOD QUESTIONS */}
            {step === "questions" && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none -z-10" />
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[var(--v-gold)] text-xs uppercase tracking-[3px] font-accent font-bold">
                    Question {QUESTIONS[currentQuestionIndex].id} of {QUESTIONS.length}
                  </span>
                  <div className="flex gap-1">
                    {QUESTIONS.map((q, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx <= currentQuestionIndex ? "w-6 bg-[var(--v-gold)]" : "w-2 bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-8">
                  {QUESTIONS[currentQuestionIndex].title}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {QUESTIONS[currentQuestionIndex].options.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => selectOption(opt.value)}
                      className="w-full text-left rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 p-5 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="font-medium text-white/80 group-hover:text-white transition">{opt.label}</span>
                      </div>
                      <div className="h-6 w-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--v-gold)]/40 group-hover:bg-[var(--v-gold)]/10 transition">
                        <Check size={12} className="text-[var(--v-gold)] opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: AI ANALYSIS ANIMATION */}
            {step === "analyzing" && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 sm:p-12 text-center flex flex-col items-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none -z-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="text-[var(--v-gold)] mb-8"
                >
                  <RefreshCw size={48} strokeWidth={1.5} />
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3">
                  Finding Your Perfect Flavour...
                </h3>
                <p className="text-white/50 text-sm font-light mb-8 transition-all">
                  {analysisText}
                </p>

                {/* Progress bar container */}
                <div className="w-full max-w-xs h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full bg-[var(--v-gold)]"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 5: RESULTS SCREEN */}
            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none -z-10" />
                
                {/* Profile frame bubble if selfie taken */}
                {capturedImage && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--v-gold)] mb-6 shadow-lg shadow-[var(--v-gold)]/10">
                    <img
                      src={capturedImage}
                      alt="Selfie preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <span className="text-[var(--v-gold)] text-xs uppercase tracking-[4px] font-accent font-bold mb-3 block">
                  Your Perfect Match
                </span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-8">
                  {recommendedProduct.name}
                </h2>

                {/* Product Hero visual */}
                <div className="relative w-48 h-48 mb-8 flex items-center justify-center group">
                  <div className="absolute h-36 w-36 rounded-full blur-[40px] opacity-30 -z-10" style={{ background: recommendedProduct.color }} />
                  <Image
                    src={recommendedProduct.image}
                    alt={recommendedProduct.name}
                    width={180}
                    height={180}
                    priority
                    className="object-contain transform group-hover:scale-[1.05] transition-transform duration-500 ease-out"
                  />
                </div>

                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-10 max-w-md font-light">
                  We think <strong className="text-white font-bold">{recommendedProduct.name}</strong> is your perfect match because you prefer{" "}
                  {answers.join(", ")} options. It matches your current vibe and makes for a satisfying, premium roasted crunch!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <Link href={`/flavours/${recommendedProduct.slug}`}>
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--v-gold)] px-8 py-4 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest text-black shadow-lg shadow-[var(--v-gold)]/10"
                    >
                      Explore This Flavour
                      <ArrowRight size={14} />
                    </motion.span>
                  </Link>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setStep("landing");
                      setAnswers([]);
                      setCurrentQuestionIndex(0);
                      setCapturedImage(null);
                    }}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-8 py-4 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition"
                  >
                    Try Again
                  </motion.button>
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
