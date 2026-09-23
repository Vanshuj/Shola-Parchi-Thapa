import { useNostalgia } from '@/hooks/useNostalgia';
export default function ChalkTitle({ children }) {
    const { cardAnimations } = useNostalgia();
    return (<h1 className={`font-chalk text-4xl md:text-5xl text-ink transition-transform duration-300 ${cardAnimations ? 'hover:-rotate-1 hover:scale-[1.02]' : ''}`}>
      {children}
    </h1>);
}
