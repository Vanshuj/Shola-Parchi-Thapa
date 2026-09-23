export default function ChaiStain({ className = '' }) {
    return (<div className={`pointer-events-none absolute h-24 w-24 rounded-full bg-chai opacity-[0.05] blur-sm ${className}`} aria-hidden="true"/>);
}
