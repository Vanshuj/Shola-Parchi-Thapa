import { Link } from 'react-router-dom';
import SignupForm from '@/components/auth/SignupForm';
import Icon from '@/components/common/Icon';

export default function SignupPage() {
  return (
    <div className="max-w-sm mx-auto px-space-md py-space-xl">
      <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-space-md">
        <Icon name="filter_vintage" size={28} className="text-on-secondary-container" />
      </div>
      <h1 className="font-headline-md text-headline-md text-on-surface text-center">Create your account</h1>
      <div className="mt-space-lg">
        <SignupForm />
      </div>
      <p className="mt-space-lg text-center font-body-sm text-body-sm text-on-surface-variant">
        Already playing?{' '}
        <Link to="/login" className="font-bold text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
