import Icon from './Icon';

export default function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-space-sm py-space-xl text-on-surface-variant" role="status">
      <Icon name="filter_vintage" size={32} className="text-primary animate-spin" />
      <span className="font-hand text-title-lg">{label}</span>
    </div>
  );
}
