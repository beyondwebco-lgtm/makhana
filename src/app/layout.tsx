import type { Metadata } from "next";
import { Outfit, Playfair_Display, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/lib/siteConfig";
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
  metadataBase: new URL(siteConfig.url),
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vellari — Flirty Flavours. Crunchy Feelings.",
    description:
      "Premium roasted makhana in six irresistible flavours. Roasted, not fried.",
    url: siteConfig.url,
    siteName: "Vellari",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vellari — Flirty Flavours. Crunchy Feelings.",
    description: "Premium roasted makhana in six irresistible flavours.",
    creator: "@vellarisnacks",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vellari",
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: "Premium roasted makhana snacks brand.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vellari",
  url: siteConfig.url,
};
import { CartProvider } from "@/context/CartContext";

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-v-cream text-v-black antialiased overflow-x-hidden" suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
