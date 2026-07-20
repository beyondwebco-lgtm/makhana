export interface ProductTheme {
  bg: string;
  bgSolid: string;
  glow: string;
  accent: string;
  text: string;
  muted: string;
  particles: string[];
  buttonBg: string;
  buttonText: string;
  color1: string;
  color2: string;
}

export const productThemes: Record<string, ProductTheme> = {
  "love-bite": {
    bg: "linear-gradient(to bottom, #241802 0%, #4F3605 25%, #7E570B 50%, #B78822 75%, #241802 100%)",
    bgSolid: "#241802",
    glow: "rgba(212,150,26,0.6)",
    accent: "#FFF0A0",
    text: "#FFF6E0",
    muted: "rgba(255,246,224,0.7)",
    particles: ["🧀", "⭐", "✨"],
    buttonBg: "#FFFFFF",
    buttonText: "#241802",
    color1: "#FFF0A0",
    color2: "#B78822",
  },
  blush: {
    bg: "linear-gradient(to bottom, #260505 0%, #4D0E0E 25%, #8C1F1F 50%, #C94040 75%, #260505 100%)",
    bgSolid: "#260505",
    glow: "rgba(201,64,64,0.6)",
    accent: "#FFB3B3",
    text: "#FFF6E0",
    muted: "rgba(255,246,224,0.7)",
    particles: ["🍅", "🌶️", "✨"],
    buttonBg: "#FFFFFF",
    buttonText: "#260505",
    color1: "#FFB3B3",
    color2: "#C94040",
  },
  "green-flag": {
    bg: "linear-gradient(to bottom, #081003 0%, #152A0A 25%, #294A15 50%, #457224 75%, #081003 100%)",
    bgSolid: "#081003",
    glow: "rgba(60,120,30,0.6)",
    accent: "#8FD44F",
    text: "#FFF6E0",
    muted: "rgba(255,246,224,0.7)",
    particles: ["🌿", "🍃", "✨"],
    buttonBg: "#FFFFFF",
    buttonText: "#081003",
    color1: "#8FD44F",
    color2: "#294A15",
  },
  "red-flag": {
    bg: "linear-gradient(to bottom, #1F0303 0%, #3B0A0A 25%, #6B1010 50%, #B24016 75%, #1F0303 100%)",
    bgSolid: "#1F0303",
    glow: "rgba(180,30,30,0.6)",
    accent: "#FF6B6B",
    text: "#FFF6E0",
    muted: "rgba(255,246,224,0.7)",
    particles: ["🌶️", "🔥", "✨"],
    buttonBg: "#FFFFFF",
    buttonText: "#1F0303",
    color1: "#FF6B6B",
    color2: "#B24016",
  },
  "crush-me": {
    bg: "linear-gradient(to bottom, #1C1204 0%, #3A2A12 25%, #6B512A 50%, #A68248 75%, #1C1204 100%)",
    bgSolid: "#1C1204",
    glow: "rgba(196,162,101,0.6)",
    accent: "#FFF6E0",
    text: "#FFF6E0",
    muted: "rgba(255,246,224,0.7)",
    particles: ["🌾", "✨", "🌿"],
    buttonBg: "#FFFFFF",
    buttonText: "#1C1204",
    color1: "#FFF6E0",
    color2: "#A68248",
  },
  soulmate: {
    bg: "linear-gradient(to bottom, #110521 0%, #2B0F4C 25%, #4D1B80 50%, #7E3BB7 75%, #110521 100%)",
    bgSolid: "#110521",
    glow: "rgba(107,63,160,0.6)",
    accent: "#D4A8FF",
    text: "#FFF6E0",
    muted: "rgba(255,246,224,0.7)",
    particles: ["💜", "🌸", "✨"],
    buttonBg: "#FFFFFF",
    buttonText: "#110521",
    color1: "#D4A8FF",
    color2: "#4D1B80",
  },
};

export function getProductTheme(slug: string): ProductTheme {
  return (
    productThemes[slug] ?? {
      bg: "radial-gradient(ellipse at 35% 40%, #2A2A2A 0%, #111 100%)",
      bgSolid: "#111111",
      glow: "rgba(255,255,255,0.3)",
      accent: "#D4961A",
      text: "#FFF6E0",
      muted: "rgba(255,246,224,0.65)",
      particles: ["✨"],
      buttonBg: "#FFFFFF",
      buttonText: "#070707",
      color1: "#D4961A",
      color2: "#111111",
    }
  );
}
