import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getRoleHomePath } from '@/utils/roleRedirect';
import { loginSchema } from '@/features/auth/authSchemas';

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  async function onSubmit(values) {
    try {
      const user = await login(values.email, values.password);
      showToast({ variant: 'success', title: `Welcome back, ${user.fullName}` });

      const redirectTo = location.state?.from?.pathname ?? getRoleHomePath(user.role);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message ?? 'Invalid email or password.';
      setError('root', { message });
      showToast({ variant: 'danger', title: 'Login failed', description: message });
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
          <h1 className="text-xl font-semibold text-text">Log in to your account</h1>
          <p className="mt-1 text-sm text-text-muted">Welcome back to CUET Placement Network.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          {errors.root && (
            <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {errors.root.message}
            </p>
          )}

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
              autoComplete="current-password"
              placeholder="••••••••"
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

          <div className="flex items-center justify-between">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox label="Remember me" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <button
              type="button"
              onClick={() =>
                showToast({ variant: 'info', title: 'Password reset is not available yet.' })
              }
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="mt-2">
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
