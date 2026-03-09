import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] text-black font-sans">
      {/* Navbar */}
      <Navbar />

      <Hero />

      <Features />

      <Footer />
    </main>
  );
}
