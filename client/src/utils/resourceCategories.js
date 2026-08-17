import { Compass, FileText, MessagesSquare, Search, GraduationCap, Building2, Sparkles } from 'lucide-react';

export const RESOURCE_CATEGORIES = [
  { value: 'career_guidance', label: 'Career Guidance', icon: Compass },
  { value: 'resume_cv', label: 'Resume & CV', icon: FileText },
  { value: 'interview_prep', label: 'Interview Preparation', icon: MessagesSquare },
  { value: 'job_search', label: 'Job Search', icon: Search },
  { value: 'skills_development', label: 'Skills & Career Development', icon: GraduationCap },
  { value: 'industry_insights', label: 'Industry Insights', icon: Building2 },
  { value: 'career_stories', label: 'Career Stories', icon: Sparkles },
];

const CATEGORY_MAP = new Map(RESOURCE_CATEGORIES.map((category) => [category.value, category]));

export function getResourceCategory(value) {
  return CATEGORY_MAP.get(value) ?? { value, label: value, icon: Compass };
}
