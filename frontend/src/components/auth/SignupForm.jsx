import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';

const schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be under 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  dpdpConsent: z.literal(true, {
    errorMap: () => ({
      message: 'You must consent to data processing under the DPDP Act 2023 & Privacy Policy.',
    }),
  }),
  ageConsent: z.literal(true, {
    errorMap: () => ({
      message: 'You must confirm you are 18+ years old or have parental/guardian consent.',
    }),
  }),
});

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      dpdpConsent: false,
      ageConsent: false,
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
      const res = await authApi.register(values.username, values.email, values.password);
      setAuth(res.userId, res.username, res.token);
      navigate('/customize');
    } catch (err) {
      setServerError(err?.response?.data?.message ?? 'Could not create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left" noValidate>
      {/* Notice on Data Minimization & DPDP Notice */}
      <div className="rounded-lg bg-surface-container-low border border-outline-variant/60 p-space-sm text-xs text-on-surface-variant flex items-start gap-2">
        <Icon name="shield" size={18} className="text-secondary shrink-0 mt-0.5" />
        <p>
          <strong className="text-on-surface">Data Minimization:</strong> We only collect your username and email to create your private account and calculate match leaderboard scores. No tracking, ads, or third-party sharing.
        </p>
      </div>

      <Input
        label="Username"
        id="signup-username"
        autoComplete="username"
        placeholder="e.g. Khiladi_Vir"
        {...register('username')}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        id="signup-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        id="signup-password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        {...register('password')}
        error={errors.password?.message}
      />

      {/* Form Consent 1: DPDP Act & Privacy Policy */}
      <div className="flex flex-col gap-1 mt-1">
        <label
          htmlFor="signup-dpdp-consent"
          className="flex items-start gap-2.5 text-xs text-on-surface cursor-pointer select-none"
        >
          <input
            id="signup-dpdp-consent"
            type="checkbox"
            className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-2 mt-0.5 shrink-0 cursor-pointer"
            {...register('dpdpConsent')}
          />
          <span className="leading-tight">
            I consent to the collection and processing of my account data in accordance with the{' '}
            <Link to="/privacy" target="_blank" className="text-primary font-bold underline hover:text-primary-container">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/terms" target="_blank" className="text-primary font-bold underline hover:text-primary-container">
              Terms
            </Link>{' '}
            under India&rsquo;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>.
          </span>
        </label>
        {errors.dpdpConsent && (
          <span role="alert" className="text-xs text-error font-medium pl-6">
            {errors.dpdpConsent.message}
          </span>
        )}
      </div>

      {/* Form Consent 2: Age Declaration (Section 9 DPDP Act) */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="signup-age-consent"
          className="flex items-start gap-2.5 text-xs text-on-surface cursor-pointer select-none"
        >
          <input
            id="signup-age-consent"
            type="checkbox"
            className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-2 mt-0.5 shrink-0 cursor-pointer"
            {...register('ageConsent')}
          />
          <span className="leading-tight">
            I declare that I am <strong>18 years of age or older</strong>, or have verifiable consent from a parent/guardian to participate.
          </span>
        </label>
        {errors.ageConsent && (
          <span role="alert" className="text-xs text-error font-medium pl-6">
            {errors.ageConsent.message}
          </span>
        )}
      </div>

      {serverError && (
        <div role="alert" className="rounded-lg bg-error/10 border border-error/30 p-space-sm text-xs text-error flex items-center gap-2">
          <Icon name="error" size={16} />
          <span>{serverError}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full mt-2"
        aria-label={submitting ? 'Creating account' : 'Create account and join baithak'}
      >
        {submitting ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  );
}
