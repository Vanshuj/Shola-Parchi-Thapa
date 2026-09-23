import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm hover:shadow-md',
  secondary: 'bg-secondary-container text-on-secondary-container hover:brightness-95 shadow-sm',
  ghost: 'bg-transparent text-on-surface-variant border border-outline-variant hover:bg-surface-container-high hover:text-on-surface',
  danger: 'bg-error text-on-error hover:brightness-90',
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-space-sm py-space-xs text-body-sm',
  md: 'px-space-lg py-space-sm text-label-lg',
  lg: 'px-space-xl py-space-md text-title-md',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`font-label-lg font-bold rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-0.5 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
