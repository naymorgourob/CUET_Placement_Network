import { LayoutDashboard, Briefcase, FileText, Building2, Users, ShieldCheck, BarChart3, User, FileBadge2, BookOpen, Heart, Sparkles, PlusCircle, Settings } from 'lucide-react';

export const NAVIGATION_BY_ROLE = {
  student: [
    { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Find Jobs', to: '/student/jobs', icon: Briefcase },
    { label: 'Companies', to: '/student/companies', icon: Building2 },
    { label: 'Resources', to: '/student/resources', icon: BookOpen },
    { label: 'AI Career Tools', to: '/student/ai-tools', icon: Sparkles },
    { label: 'Saved Jobs', to: '/student/saved-jobs', icon: Heart },
    { label: 'My Applications', to: '/student/applications', icon: FileText },
    { label: 'My Profile', to: '/student/profile', icon: User },
    { label: 'My Resume', to: '/student/resumes', icon: FileBadge2 },
  ],
  recruiter: [
    { label: 'Dashboard', to: '/recruiter/dashboard', icon: LayoutDashboard },
    { label: 'My Jobs', to: '/recruiter/jobs', icon: Briefcase },
    { label: 'Post a Job', to: '/recruiter/jobs/new', icon: PlusCircle },
    { label: 'Applications', to: '/recruiter/applications', icon: FileText },
    { label: 'Company Profile', to: '/recruiter/company', icon: Building2 },
    { label: 'Settings', to: '/recruiter/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Recruiters', to: '/admin/recruiters', icon: ShieldCheck },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Jobs', to: '/admin/jobs', icon: Briefcase },
    { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
    { label: 'Resources', to: '/admin/resources', icon: BookOpen },
  ],
};
