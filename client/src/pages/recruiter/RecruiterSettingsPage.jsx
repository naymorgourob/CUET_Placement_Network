import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { KeyRound, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import * as authService from '@/services/authService';
import { changePasswordSchema } from '@/features/auth/authSchemas';

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
};

function AccountSection() {
  const { user, isLoading } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Your account identity and status.</CardDescription>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-24" />
          </>
        ) : (
          <>
            <Input
              label="Account Email"
              value={user?.email ?? ''}
              disabled
              readOnly
              helperText="Your email is your login identifier and cannot be changed."
            />
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-text">Account Status</p>
              <div>
                <Badge variant={user?.isActive === false ? 'danger' : 'success'}>
                  {user?.isActive === false ? 'Suspended' : 'Active'}
                </Badge>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

function ChangePasswordSection() {
  const { showToast } = useToast();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const changePassword = useMutation({
    mutationFn: authService.changePassword,
  });

  async function onSubmit(values) {
    setServerError('');
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      showToast({ variant: 'success', title: 'Password changed successfully.' });
      reset();
    } catch (error) {
      const message = error.response?.data?.message ?? 'Unable to update settings.';
      setServerError(message);
      reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update the password used to sign in to your account.</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardBody className="flex flex-col gap-4">
          {serverError && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
              <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {serverError}
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            autoComplete="current-password"
            required
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <Input
            label="New Password"
            type="password"
            autoComplete="new-password"
            required
            helperText="At least 8 characters, with one letter and one number."
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            autoComplete="new-password"
            required
            error={errors.confirmNewPassword?.message}
            {...register('confirmNewPassword')}
          />
        </CardBody>

        <CardFooter className="flex justify-end">
          <Button type="submit" leftIcon={KeyRound} isLoading={changePassword.isPending} disabled={changePassword.isPending}>
            {changePassword.isPending ? 'Saving...' : 'Change Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export function RecruiterSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <motion.h1 {...fadeUp} className="text-xl font-semibold text-text">
        Settings
      </motion.h1>

      <div className="flex max-w-2xl flex-col gap-6">
        <AccountSection />
        <ChangePasswordSection />
      </div>
    </div>
  );
}
