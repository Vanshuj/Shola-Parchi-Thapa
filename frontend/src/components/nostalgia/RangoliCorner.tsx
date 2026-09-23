interface RangoliCornerProps {
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
}

const ROTATIONS: Record<NonNullable<RangoliCornerProps['corner']>, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0 -scale-x-100',
  'bottom-left': 'bottom-0 left-0 -scale-y-100',
  'bottom-right': 'bottom-0 right-0 -scale-x-100 -scale-y-100',
};

export default function RangoliCorner({ corner = 'top-left', size = 72 }: RangoliCornerProps) {
  return (
    <svg
      className={`pointer-events-none absolute ${ROTATIONS[corner]} opacity-40`}
      width={size}
      height={size}
      viewBox="0 0 72 72"
      aria-hidden="true"
    >
      <g fill="none" stroke="#B91C1C" strokeWidth="1.5">
        <circle cx="8" cy="8" r="6" />
        <path d="M14 8 Q 30 8 30 24" />
        <path d="M8 14 Q 8 30 24 30" />
        <circle cx="24" cy="24" r="3" fill="#FCD34D" stroke="none" />
      </g>
    </svg>
  );
}
