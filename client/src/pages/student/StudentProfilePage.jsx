import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Pencil, FileText, ExternalLink, Sparkles, GraduationCap, AlertTriangle, RefreshCcw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { SkeletonText } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { env } from '@/utils/env';
import {
  useStudentProfile,
  useUpdateStudentProfile,
  useStudentDashboard,
  useMyResumes,
} from '@/features/student/studentQueries';
import { studentProfileSchema } from '@/features/student/studentSchemas';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

function parseSkills(skills) {
  if (!skills) return [];
  return skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function StudentProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { data: profile, isLoading, isError, refetch } = useStudentProfile();
  const { data: dashboard } = useStudentDashboard();
  const { data: resumes } = useMyResumes();
  const updateProfile = useUpdateStudentProfile();
  const [isEditing, setIsEditing] = useState(false);

  const currentResume = (resumes ?? []).find((resume) => resume.resumeId === profile?.currentResumeId);
  const skills = parseSkills(profile?.skills);
  const completion = dashboard?.profileCompletionPercentage;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: { department: '', batchYear: '', cgpa: '', phone: '', skills: '' },
  });

  useEffect(() => {
    if (profile) {
      reset({
        department: profile.department ?? '',
        batchYear: profile.batchYear ?? '',
        cgpa: profile.cgpa ?? '',
        phone: profile.phone ?? '',
        skills: profile.skills ?? '',
      });
    }
  }, [profile, reset]);

  function handleStartEdit() {
    setIsEditing(true);
  }

  function handleCancelEdit() {
    if (profile) {
      reset({
        department: profile.department ?? '',
        batchYear: profile.batchYear ?? '',
        cgpa: profile.cgpa ?? '',
        phone: profile.phone ?? '',
        skills: profile.skills ?? '',
      });
    }
    setIsEditing(false);
  }

  async function onSubmit(values) {
    const payload = {
      department: values.department || null,
      batchYear: values.batchYear === '' ? null : Number(values.batchYear),
      cgpa: values.cgpa === '' ? null : Number(values.cgpa),
      phone: values.phone || null,
      skills: values.skills || null,
    };

    try {
      await updateProfile.mutateAsync(payload);
      showToast({ variant: 'success', title: 'Profile updated successfully.' });
      setIsEditing(false);
    } catch (error) {
      const message = error.response?.data?.message ?? 'Unable to update your profile.';
      showToast({ variant: 'danger', title: 'Update failed', description: message });
    }
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-semibold text-text">Unable to load your profile.</p>
        <Button variant="outline" leftIcon={RefreshCcw} onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <motion.div {...fadeUp}>
        <h1 className="text-xl font-semibold text-text">My Profile</h1>
        <p className="mt-1 text-sm text-text-muted">
          Keep your information up to date so recruiters can better understand your background.
        </p>
      </motion.div>

      {/* Profile header */}
      <motion.div {...fadeUp}>
        <Card>
          <CardBody className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <Avatar name={user?.fullName} size="lg" />
              <div>
                <p className="text-base font-semibold text-text">{user?.fullName}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-text-muted">
                  <span>CUET</span>
                  {profile?.department && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{profile.department}</span>
                    </>
                  )}
                  {profile?.batchYear && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Batch {profile.batchYear}</span>
                    </>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-muted">{user?.email}</p>
              </div>
            </div>
            {!isEditing && (
              <Button variant="outline" leftIcon={Pencil} onClick={handleStartEdit} className="shrink-0">
                Edit Profile
              </Button>
            )}
          </CardBody>
        </Card>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Personal & Academic Information */}
        <motion.div {...fadeUp}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              {isLoading ? (
                <SkeletonText lines={3} />
              ) : isEditing ? (
                <Input
                  label="Phone"
                  placeholder="e.g. +8801XXXXXXXXX"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              ) : (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-text-muted">Phone</span>
                  <span className="font-medium text-text">{profile?.phone || 'Not added'}</span>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <SkeletonText lines={3} />
              ) : isEditing ? (
                <div className="flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Department"
                      placeholder="e.g. Computer Science"
                      error={errors.department?.message}
                      {...register('department')}
                    />
                    <Input
                      label="Session / Batch Year"
                      type="number"
                      placeholder="e.g. 2025"
                      error={errors.batchYear?.message}
                      {...register('batchYear')}
                    />
                  </div>
                  <Input
                    label="CGPA"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 3.75"
                    error={errors.cgpa?.message}
                    {...register('cgpa')}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-muted">University</span>
                    <span className="font-medium text-text">CUET</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-muted">Department</span>
                    <span className="font-medium text-text">{profile?.department || 'Not added'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-muted">Session / Batch Year</span>
                    <span className="font-medium text-text">{profile?.batchYear || 'Not added'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-muted">CGPA</span>
                    <span className="font-medium text-text">{profile?.cgpa ?? 'Not added'}</span>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Skills */}
        <motion.div {...fadeUp} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <SkeletonText lines={2} />
              ) : isEditing ? (
                <Textarea
                  label="Skills"
                  placeholder="e.g. JavaScript, React, Node.js"
                  helperText="Separate skills with commas."
                  rows={4}
                  error={errors.skills?.message}
                  {...register('skills')}
                />
              ) : skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-text-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">Not added</p>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {isEditing && (
          <motion.div {...fadeUp} className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={updateProfile.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={updateProfile.isPending}
              disabled={updateProfile.isPending || !isDirty}
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </motion.div>
        )}
      </form>

      {/* Resume */}
      <motion.div {...fadeUp}>
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <SkeletonText lines={2} />
            ) : currentResume ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">{currentResume.originalFileName}</p>
                    <p className="text-xs text-text-muted">
                      Uploaded {new Date(currentResume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={`${env.uploadBaseUrl}/${currentResume.filePath.replace(/^\/?/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm" rightIcon={ExternalLink}>
                      View Resume
                    </Button>
                  </a>
                  <Link to="/student/resumes">
                    <Button size="sm">Manage Resume</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <FileText className="h-8 w-8 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
                <p className="text-sm font-medium text-text">No resume uploaded yet.</p>
                <Link to="/student/resumes" className="mt-1">
                  <Button variant="outline" size="sm">
                    Manage Resume
                  </Button>
                </Link>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* AI Career Tools + Profile Completion */}
      <motion.div {...fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
              <h2 className="text-sm font-semibold text-text">AI Career Tools</h2>
            </div>
            <p className="text-sm text-text-muted">Use your resume to get AI-powered feedback and career insights.</p>
            <Link to="/student/ai-tools">
              <Button variant="outline" size="sm">
                AI Career Tools
              </Button>
            </Link>
          </CardBody>
        </Card>

        {typeof completion === 'number' && (
          <Card>
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
                <h2 className="text-sm font-semibold text-text">Profile Completion</h2>
              </div>
              <p className="text-2xl font-semibold text-text">{completion}%</p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </CardBody>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
