import HeroSection from '@/components/heroSection';
import BenefitsSection from '@/components/benefitsSection';
import HowItWorksSection from '@/components/howItWorksSection';
import SocialProofSection from '@/components/socialProofSection';
import FAQSection from '@/components/FAQSection';
import CallToActionSection from '@/components/callToActionSection';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-primary">
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <SocialProofSection />
      <FAQSection />
      <CallToActionSection />
    </main>
  );
}
