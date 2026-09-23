import { BUILTIN_PRESETS } from '@/utils/labelPresets';
export default function LabelPresetPicker({ onApply }) {
    return (<div className="flex flex-wrap gap-2">
      {BUILTIN_PRESETS.map((preset) => (<button key={preset.id} type="button" onClick={() => onApply(preset.labels)} className="rounded-full border border-outline-variant bg-surface-container px-4 py-1.5 font-label text-sm font-semibold hover:bg-secondary-container">
          {preset.name}
        </button>))}
    </div>);
}
