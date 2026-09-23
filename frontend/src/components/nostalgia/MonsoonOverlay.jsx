import { useNostalgia } from '@/hooks/useNostalgia';
/** Tier-4 easter egg: a light rain overlay shown after 5 games in one day. */
export default function MonsoonOverlay({ active }) {
    const { easterEggs, cardAnimations } = useNostalgia();
    if (!active || !easterEggs || !cardAnimations)
        return null;
    return (<div className="pointer-events-none fixed inset-0 z-30 bg-gradient-to-b from-indigo/10 to-transparent" aria-hidden="true">
      <div className="h-full w-full opacity-20 [background-image:repeating-linear-gradient(115deg,transparent,transparent_8px,#1E3A8A_9px)] animate-pulse"/>
    </div>);
}
