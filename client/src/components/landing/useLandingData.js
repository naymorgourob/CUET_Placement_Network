import { useQuery } from '@tanstack/react-query';
import { getPublicJobs } from '@/features/public/publicJobsService';

const CATEGORY_ICON_KEYWORDS = [
  { key: 'software', match: /software|it|tech|engineering \(cs\)|information/i },
  { key: 'engineering', match: /engineering|mechanical|civil|electrical/i },
  { key: 'finance', match: /finance|bank|accounting|business/i },
  { key: 'marketing', match: /marketing|sales|growth/i },
  { key: 'design', match: /design|creative|ux|ui/i },
  { key: 'research', match: /research|academia|science/i },
];

function categorizeIndustry(industry) {
  if (!industry) return 'other';
  const found = CATEGORY_ICON_KEYWORDS.find(({ match }) => match.test(industry));
  return found?.key ?? 'other';
}

export function useLandingData() {
  const { data, isLoading } = useQuery({
    queryKey: ['landing', 'jobsPool'],
    queryFn: () => getPublicJobs({ page: 1, limit: 50, sort: 'newest' }),
    staleTime: 60_000,
  });

  const jobs = data?.jobs ?? [];
  const totalOpenJobs = data?.pagination?.total ?? 0;

  const companiesMap = new Map();
  for (const job of jobs) {
    if (job.Company && !companiesMap.has(job.Company.companyId)) {
      companiesMap.set(job.Company.companyId, { ...job.Company, openJobCount: 0 });
    }
    if (job.Company) {
      companiesMap.get(job.Company.companyId).openJobCount += 1;
    }
  }
  const companies = Array.from(companiesMap.values());

  const categoryMap = new Map();
  for (const job of jobs) {
    const industry = job.Company?.industry;
    const label = industry || 'Other';
    const key = categorizeIndustry(industry);
    if (!categoryMap.has(label)) {
      categoryMap.set(label, { label, key, count: 0 });
    }
    categoryMap.get(label).count += 1;
  }
  const categories = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);

  const featuredJobs = jobs.slice(0, 8);
  const latestJobs = jobs.slice(0, 6);

  return {
    isLoading,
    jobs,
    totalOpenJobs,
    companies,
    categories,
    featuredJobs,
    latestJobs,
  };
}
