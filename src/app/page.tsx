import { CitationSection } from "@/components/home/CitationSection";
import { DemoSection } from "@/components/home/DemoSection";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { MethodSection } from "@/components/home/MethodSection";
import { Navbar } from "@/components/home/Navbar";
import { ResultsSection } from "@/components/home/ResultsSection";
import { SectionIndex } from "@/components/home/SectionIndex";
import { StatsGrid } from "@/components/home/StatsGrid";

export default function Home() {
  return (
    <main>
      <Navbar />
      <SectionIndex />
      <Hero />
      <StatsGrid />
      <MethodSection />
      <DemoSection />
      <ResultsSection />
      <CitationSection />
      <Footer />
    </main>
  );
}
