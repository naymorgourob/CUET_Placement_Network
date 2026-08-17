import { HeroSection } from '@/components/landing/HeroSection';
import { CategorySection } from '@/components/landing/CategorySection';
import { FeaturedJobsSection } from '@/components/landing/FeaturedJobsSection';
import { CompaniesSection } from '@/components/landing/CompaniesSection';
import { AICareerSection } from '@/components/landing/AICareerSection';
import { LatestJobsSection } from '@/components/landing/LatestJobsSection';
import { StatisticsSection } from '@/components/landing/StatisticsSection';
import { RecruiterCtaSection } from '@/components/landing/RecruiterCtaSection';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedJobsSection />
      <CompaniesSection />
      <AICareerSection />
      <LatestJobsSection />
      <StatisticsSection />
      <RecruiterCtaSection />
      <FinalCtaSection />
    </div>
  );
}
