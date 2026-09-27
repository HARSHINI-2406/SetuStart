import React, { useState } from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { PopularAreas } from '../components/PopularAreas';
import { FeaturedChallengesSection } from '../components/FeaturedChallengesSection';
import { HowSetuStartWorksSection } from '../components/HowSetuStartWorksSection';
import { RoleSection } from '../components/RoleSection';
import { MatchingGovernanceSection } from '../components/MatchingGovernanceSection';
import { ImpactStatsSection } from '../components/ImpactStatsSection';
import { CTASection } from '../components/CTASection';
import { ScrollRevealSection } from '../components/ScrollRevealSection';

export const LandingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="w-full bg-white space-y-0 text-slate-900 font-sans">
      
      {/* 1. HERO — STAGED ENTRANCE & HOVER BENEFITS */}
      <HeroCarousel />

      {/* 2. POPULAR AREAS HORIZONTAL FILTER STRIP */}
      <ScrollRevealSection delayMs={60}>
        <PopularAreas
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </ScrollRevealSection>

      {/* 3. FEATURED CHALLENGES HORIZONTAL CAROUSEL (SIDE PEEK & ACTIVE EXPANSION) */}
      <ScrollRevealSection delayMs={80}>
        <FeaturedChallengesSection
          selectedCategory={selectedCategory}
        />
      </ScrollRevealSection>

      {/* 4. 7-STAGE SETUSTART JOURNEY (EXPANDABLE CONNECTED PROCESS) */}
      <ScrollRevealSection delayMs={80}>
        <HowSetuStartWorksSection />
      </ScrollRevealSection>

      {/* 5. ROLE SECTION (REAL TAB TRANSITION) */}
      <ScrollRevealSection delayMs={80}>
        <RoleSection />
      </ScrollRevealSection>

      {/* 6. EXPLAINABLE MATCHING ENGINE & AI + HUMAN GOVERNANCE FLOW */}
      <ScrollRevealSection delayMs={80}>
        <MatchingGovernanceSection />
      </ScrollRevealSection>

      {/* 7. IMPACT STATISTICS BAND (REAL COUNT-UP ANIMATION) */}
      <ScrollRevealSection delayMs={80}>
        <ImpactStatsSection />
      </ScrollRevealSection>

      {/* 8. CTA SECTION (INTERACTIVE HOVER BUTTONS) */}
      <ScrollRevealSection delayMs={80}>
        <CTASection />
      </ScrollRevealSection>

    </div>
  );
};
