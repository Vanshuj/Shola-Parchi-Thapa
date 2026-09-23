import { CARD_TYPE_GLYPH } from '@/utils/cardIcons';
export default function LabelPreviewCard({ type, label }) {
    return (<div className="flex h-28 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-outline-variant bg-surface-lowest shadow-sm">
      <span className="text-xl" aria-hidden="true">
        {CARD_TYPE_GLYPH[type]}
      </span>
      <span className="font-hand text-lg text-center break-words px-1">{label || 'Untitled'}</span>
    </div>);
}
