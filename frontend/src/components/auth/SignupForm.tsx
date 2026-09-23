import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

const schema = z.object({
  username: z.string().min(3, 'At least 3 characters').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, underscore only'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authApi.register(values.username, values.email, values.password);
      setAuth(res.userId, res.username, res.token);
      navigate('/customize');
    } catch (err: any) {
      setServerError(err?.response?.data?.message ?? 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Username" {...register('username')} error={errors.username?.message} />
      <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
      <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
      {serverError && <p className="text-sm text-kumkum">{serverError}</p>}
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Sign up'}
      </Button>
    </form>
  );
}
