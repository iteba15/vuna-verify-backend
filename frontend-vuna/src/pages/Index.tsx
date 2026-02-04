import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { VerificationSection } from '@/components/sections/VerificationSection';
import { PlatformSection } from '@/components/sections/PlatformSection';
import { ImpactSection } from '@/components/sections/ImpactSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <VerificationSection />
        <PlatformSection />
        <ImpactSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
