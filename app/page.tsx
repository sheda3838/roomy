import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <main className="bg-[rgb(243,244,237)] text-zinc-900 overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <CTASection />
      <FAQSection />
    </main>
  );
}