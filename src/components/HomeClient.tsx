"use client";


import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ScrollAnimation from "@/components/home/ScrollAnimation";
import FlavorScrollShowcase from "@/components/home/FlavorScrollShowcase";
import BrandStory from "@/components/home/BrandStory";
import LifestyleSection from "@/components/home/LifestyleSection";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/layout/LoadingScreen";

export default function HomeClient() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="grain">
        <Hero />
        <ScrollAnimation />
        <FlavorScrollShowcase />
        <BrandStory />
        <LifestyleSection />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
