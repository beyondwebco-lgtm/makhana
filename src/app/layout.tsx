import type { Metadata } from "next";
import { Outfit, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-accent",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vellari — Flirty Flavours. Crunchy Feelings.",
  description:
    "Premium roasted makhana in six irresistible flavours. Roasted, not fried. High in protein. Gluten free. Crafted for those who snack with intention.",
  keywords: [
    "Vellari",
    "makhana",
    "fox nuts",
    "roasted makhana",
    "healthy snacks",
    "premium snacks",
    "Indian snacks",
    "snack brand",
  ],
  openGraph: {
    title: "Vellari — Flirty Flavours. Crunchy Feelings.",
    description:
      "Premium roasted makhana in six irresistible flavours. Roasted, not fried.",
    siteName: "Vellari",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body className="min-h-screen bg-v-cream text-v-black antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
