"use client";


import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FlavorScrollShowcase from "@/components/home/FlavorScrollShowcase";
import BrandStory from "@/components/home/BrandStory";
import LifestyleSection from "@/components/home/LifestyleSection";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/layout/LoadingScreen";
import CustomBowlBuilder from "@/components/home/CustomBowlBuilder";

export default function HomeClient() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="grain">
        <Hero />
        <FlavorScrollShowcase />
        <CustomBowlBuilder />
        <BrandStory />
        <LifestyleSection />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
