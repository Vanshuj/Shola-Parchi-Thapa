import { useNostalgia } from '@/hooks/useNostalgia';
/** Subtle SVG-noise paper grain overlay. Toggleable; purely decorative (aria-hidden). */
export default function PaperTexture() {
    const { paperTexture } = useNostalgia();
    if (!paperTexture)
        return null;
    return (<svg className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.06]" aria-hidden="true">
      <filter id="paper-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-noise)"/>
    </svg>);
}
