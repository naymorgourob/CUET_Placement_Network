import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getRoleHomePath } from '@/utils/roleRedirect';
import { registerSchema } from '@/features/auth/authSchemas';
import { cn } from '@/utils/cn';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student', icon: GraduationCap },
  { value: 'recruiter', label: 'Recruiter', icon: Briefcase },
];

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', role: 'student' },
  });

  const role = watch('role');

  async function onSubmit(values) {
    try {
      const user = await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      showToast({ variant: 'success', title: `Welcome, ${user.fullName}` });
      navigate(getRoleHomePath(user.role), { replace: true });
    } catch (error) {
      const message = error.response?.data?.message ?? 'Registration failed. Please try again.';
      setError('root', { message });
      showToast({ variant: 'danger', title: 'Registration failed', description: message });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm"
      >
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-text">Create your account</h1>
          <p className="mt-1 text-sm text-text-muted">Join CUET Placement Network to get started.</p>
        </div>

        <div role="tablist" aria-label="Account type" className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-surface-muted p-1">
          {ROLE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = role === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setValue('role', option.value, { shouldValidate: true })}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors duration-100',
                  isActive ? 'bg-surface text-text shadow-sm' : 'text-text-muted hover:text-text'
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {option.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {errors.root && (
            <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {errors.root.message}
            </p>
          )}

          <Input
            label="Full name"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
              error={errors.password?.message}
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-[34px] text-text-muted hover:text-text"
            >
              {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
            </button>
          </div>

          <Input
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="mt-2">
            Create {role === 'student' ? 'Student' : 'Recruiter'} Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
