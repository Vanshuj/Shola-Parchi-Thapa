interface IconProps {
  name: string;
  className?: string;
  size?: number;
  filled?: boolean;
}

/** Thin wrapper around the Material Symbols Outlined font used throughout the Stitch design. */
export default function Icon({ name, className = '', size = 24, filled = false }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{ fontSize: size, fontVariationSettings: filled ? '"FILL" 1' : undefined }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
