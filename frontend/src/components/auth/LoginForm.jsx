import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authApi.login(values.email, values.password);
      setAuth(res.userId, res.username, res.token);
      navigate('/lobby');
    } catch {
      setServerError('Invalid email or password. Please verify your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left" noValidate>
      <Input
        label="Email Address"
        id="login-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        id="login-password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        {...register('password')}
        error={errors.password?.message}
      />

      {serverError && (
        <div role="alert" className="rounded-lg bg-error/10 border border-error/30 p-space-sm text-xs text-error flex items-center gap-2">
          <Icon name="error" size={16} />
          <span>{serverError}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full mt-1"
        aria-label={submitting ? 'Logging in to baithak' : 'Log in to your account'}
      >
        {submitting ? 'Logging in…' : 'Log In'}
      </Button>
    </form>
  );
}
