"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ScrollAnimation from "@/components/home/ScrollAnimation";
import ProductsInfo from "@/components/home/ProductsInfo";
import BrandStory from "@/components/home/BrandStory";
import LifestyleSection from "@/components/home/LifestyleSection";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/layout/Footer";

const LoadingScreen = dynamic(
  () => import("@/components/layout/LoadingScreen"),
  { ssr: false }
);

export default function HomeClient() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="grain">
        <Hero />
        <ScrollAnimation />
        <ProductsInfo />
        <BrandStory />
        <LifestyleSection />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
