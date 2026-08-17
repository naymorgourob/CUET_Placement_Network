import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { GuestRoute } from '@/routes/GuestRoute';
import { PageLoader } from '@/components/PageLoader';

const HomePage = lazy(() => import('@/pages/Home').then((module) => ({ default: module.HomePage })));
const JobsPage = lazy(() => import('@/pages/JobsPage').then((module) => ({ default: module.JobsPage })));
const JobDetailsPage = lazy(() =>
  import('@/pages/JobDetailsPage').then((module) => ({ default: module.JobDetailsPage }))
);
const CompaniesPage = lazy(() =>
  import('@/pages/CompaniesPage').then((module) => ({ default: module.CompaniesPage }))
);
const CompanyDetailsPage = lazy(() =>
  import('@/pages/CompanyDetailsPage').then((module) => ({ default: module.CompanyDetailsPage }))
);
const ResourcesPage = lazy(() =>
  import('@/pages/ResourcesPage').then((module) => ({ default: module.ResourcesPage }))
);
const ResourceDetailsPage = lazy(() =>
  import('@/pages/ResourceDetailsPage').then((module) => ({ default: module.ResourceDetailsPage }))
);
const LoginPage = lazy(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((module) => ({ default: module.RegisterPage }))
);
const UnauthorizedPage = lazy(() =>
  import('@/pages/UnauthorizedPage').then((module) => ({ default: module.UnauthorizedPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage }))
);

const StudentDashboardPage = lazy(() =>
  import('@/pages/student/StudentDashboardPage').then((module) => ({ default: module.StudentDashboardPage }))
);
const StudentJobsPage = lazy(() =>
  import('@/pages/student/StudentJobsPage').then((module) => ({ default: module.StudentJobsPage }))
);
const StudentJobDetailsPage = lazy(() =>
  import('@/pages/student/StudentJobDetailsPage').then((module) => ({ default: module.StudentJobDetailsPage }))
);
const StudentApplyPage = lazy(() =>
  import('@/pages/student/StudentApplyPage').then((module) => ({ default: module.StudentApplyPage }))
);
const StudentSavedJobsPage = lazy(() =>
  import('@/pages/student/StudentSavedJobsPage').then((module) => ({ default: module.StudentSavedJobsPage }))
);
const StudentCompaniesPage = lazy(() =>
  import('@/pages/student/StudentCompaniesPage').then((module) => ({ default: module.StudentCompaniesPage }))
);
const StudentCompanyDetailsPage = lazy(() =>
  import('@/pages/student/StudentCompanyDetailsPage').then((module) => ({
    default: module.StudentCompanyDetailsPage,
  }))
);
const StudentResourcesPage = lazy(() =>
  import('@/pages/student/StudentResourcesPage').then((module) => ({ default: module.StudentResourcesPage }))
);
const StudentResourceDetailsPage = lazy(() =>
  import('@/pages/student/StudentResourceDetailsPage').then((module) => ({
    default: module.StudentResourceDetailsPage,
  }))
);
const StudentAiToolsPage = lazy(() =>
  import('@/pages/student/StudentAiToolsPage').then((module) => ({ default: module.StudentAiToolsPage }))
);
const StudentApplicationsPage = lazy(() =>
  import('@/pages/student/StudentApplicationsPage').then((module) => ({ default: module.StudentApplicationsPage }))
);
const StudentProfilePage = lazy(() =>
  import('@/pages/student/StudentProfilePage').then((module) => ({ default: module.StudentProfilePage }))
);
const StudentResumesPage = lazy(() =>
  import('@/pages/student/StudentResumesPage').then((module) => ({ default: module.StudentResumesPage }))
);

const RecruiterDashboardPage = lazy(() =>
  import('@/pages/recruiter/RecruiterDashboardPage').then((module) => ({ default: module.RecruiterDashboardPage }))
);
const RecruiterCompanyPage = lazy(() =>
  import('@/pages/recruiter/RecruiterCompanyPage').then((module) => ({ default: module.RecruiterCompanyPage }))
);
const RecruiterProfilePage = lazy(() =>
  import('@/pages/recruiter/RecruiterProfilePage').then((module) => ({ default: module.RecruiterProfilePage }))
);
const RecruiterSettingsPage = lazy(() =>
  import('@/pages/recruiter/RecruiterSettingsPage').then((module) => ({ default: module.RecruiterSettingsPage }))
);
const RecruiterJobsPage = lazy(() =>
  import('@/pages/recruiter/RecruiterJobsPage').then((module) => ({ default: module.RecruiterJobsPage }))
);
const RecruiterPostJobPage = lazy(() =>
  import('@/pages/recruiter/RecruiterPostJobPage').then((module) => ({ default: module.RecruiterPostJobPage }))
);
const RecruiterJobDetailsPage = lazy(() =>
  import('@/pages/recruiter/RecruiterJobDetailsPage').then((module) => ({ default: module.RecruiterJobDetailsPage }))
);
const RecruiterApplicantsPage = lazy(() =>
  import('@/pages/recruiter/RecruiterApplicantsPage').then((module) => ({ default: module.RecruiterApplicantsPage }))
);
const RecruiterApplicationsPage = lazy(() =>
  import('@/pages/recruiter/RecruiterApplicationsPage').then((module) => ({ default: module.RecruiterApplicationsPage }))
);
const RecruiterApplicationDetailsPage = lazy(() =>
  import('@/pages/recruiter/RecruiterApplicationDetailsPage').then((module) => ({
    default: module.RecruiterApplicationDetailsPage,
  }))
);

const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage }))
);
const AdminRecruitersPage = lazy(() =>
  import('@/pages/admin/AdminRecruitersPage').then((module) => ({ default: module.AdminRecruitersPage }))
);
const AdminUsersPage = lazy(() =>
  import('@/pages/admin/AdminUsersPage').then((module) => ({ default: module.AdminUsersPage }))
);
const AdminJobsPage = lazy(() =>
  import('@/pages/admin/AdminJobsPage').then((module) => ({ default: module.AdminJobsPage }))
);
const AdminReportsPage = lazy(() =>
  import('@/pages/admin/AdminReportsPage').then((module) => ({ default: module.AdminReportsPage }))
);
const AdminResourcesPage = lazy(() =>
  import('@/pages/admin/AdminResourcesPage').then((module) => ({ default: module.AdminResourcesPage }))
);

function withSuspense(element) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public route group */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={withSuspense(<HomePage />)} />
        <Route path="/jobs" element={withSuspense(<JobsPage />)} />
        <Route path="/jobs/:jobId" element={withSuspense(<JobDetailsPage />)} />
        <Route path="/companies" element={withSuspense(<CompaniesPage />)} />
        <Route path="/companies/:companyId" element={withSuspense(<CompanyDetailsPage />)} />
        <Route path="/resources" element={withSuspense(<ResourcesPage />)} />
        <Route path="/resources/:slug" element={withSuspense(<ResourceDetailsPage />)} />
      </Route>

      {/* Guest-only routes (redirect away if already authenticated) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={withSuspense(<LoginPage />)} />
        <Route path="/register" element={withSuspense(<RegisterPage />)} />
      </Route>

      {/* Student route group */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/student/dashboard" element={withSuspense(<StudentDashboardPage />)} />
          <Route path="/student/jobs" element={withSuspense(<StudentJobsPage />)} />
          <Route path="/student/jobs/:jobId" element={withSuspense(<StudentJobDetailsPage />)} />
          <Route path="/student/jobs/:jobId/apply" element={withSuspense(<StudentApplyPage />)} />
          <Route path="/student/saved-jobs" element={withSuspense(<StudentSavedJobsPage />)} />
          <Route path="/student/companies" element={withSuspense(<StudentCompaniesPage />)} />
          <Route path="/student/companies/:companyId" element={withSuspense(<StudentCompanyDetailsPage />)} />
          <Route path="/student/resources" element={withSuspense(<StudentResourcesPage />)} />
          <Route path="/student/resources/:slug" element={withSuspense(<StudentResourceDetailsPage />)} />
          <Route path="/student/ai-tools" element={withSuspense(<StudentAiToolsPage />)} />
          <Route path="/student/applications" element={withSuspense(<StudentApplicationsPage />)} />
          <Route path="/student/profile" element={withSuspense(<StudentProfilePage />)} />
          <Route path="/student/resumes" element={withSuspense(<StudentResumesPage />)} />
        </Route>
      </Route>

      {/* Recruiter route group */}
      <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/recruiter/dashboard" element={withSuspense(<RecruiterDashboardPage />)} />
          <Route path="/recruiter/jobs" element={withSuspense(<RecruiterJobsPage />)} />
          <Route path="/recruiter/jobs/new" element={withSuspense(<RecruiterPostJobPage />)} />
          <Route path="/recruiter/jobs/:jobId" element={withSuspense(<RecruiterJobDetailsPage />)} />
          <Route path="/recruiter/jobs/:jobId/applicants" element={withSuspense(<RecruiterApplicantsPage />)} />
          <Route path="/recruiter/applications" element={withSuspense(<RecruiterApplicationsPage />)} />
          <Route path="/recruiter/applications/:applicationId" element={withSuspense(<RecruiterApplicationDetailsPage />)} />
          <Route path="/recruiter/company" element={withSuspense(<RecruiterCompanyPage />)} />
          <Route path="/recruiter/profile" element={withSuspense(<RecruiterProfilePage />)} />
          <Route path="/recruiter/settings" element={withSuspense(<RecruiterSettingsPage />)} />
        </Route>
      </Route>

      {/* Admin route group */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={withSuspense(<AdminDashboardPage />)} />
          <Route path="/admin/recruiters" element={withSuspense(<AdminRecruitersPage />)} />
          <Route path="/admin/users" element={withSuspense(<AdminUsersPage />)} />
          <Route path="/admin/jobs" element={withSuspense(<AdminJobsPage />)} />
          <Route path="/admin/reports" element={withSuspense(<AdminReportsPage />)} />
          <Route path="/admin/resources" element={withSuspense(<AdminResourcesPage />)} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={withSuspense(<UnauthorizedPage />)} />
      <Route path="*" element={withSuspense(<NotFoundPage />)} />
    </Routes>
  );
}
