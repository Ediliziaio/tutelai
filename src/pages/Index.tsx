import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TickerStrip from "@/components/TickerStrip";
import ProblemSection from "@/components/ProblemSection";
import InactionCostSection from "@/components/InactionCostSection";
import SolutionSection from "@/components/SolutionSection";
import ServicesGrid from "@/components/ServicesGrid";
import ProcessSteps from "@/components/ProcessSteps";
import ROICalculator from "@/components/ROICalculator";
import MarginsSection from "@/components/MarginsSection";
import PartnerSection from "@/components/PartnerSection";
import DataWallSection from "@/components/DataWallSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import TargetSection from "@/components/TargetSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCtaClick={openModal} />
      <HeroSection onCtaClick={openModal} />
      <TickerStrip />
      <ProblemSection />
      <InactionCostSection onCtaClick={openModal} />
      <SolutionSection />
      <ServicesGrid />
      <ProcessSteps />
      <ROICalculator />
      <MarginsSection />
      <PartnerSection />
      <DataWallSection />
      <TestimonialsSection />
      <TargetSection />
      <GuaranteeSection />
      <PricingSection onCtaClick={openModal} />
      <FAQSection />
      <FinalCTA onCtaClick={openModal} />
      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Index;
