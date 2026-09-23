import { useState } from 'react';
import type { CardType } from '@/types/game';
import type { LabelMap } from '@/types/label';
import { CARD_TYPES, MAX_LABEL_LENGTH } from '@/utils/constants';
import Input from '@/components/common/Input';
import LabelPreviewCard from './LabelPreviewCard';
import EmojiPickerWrapper from './EmojiPickerWrapper';

interface LabelEditorProps {
  labels: LabelMap;
  onChange: (labels: LabelMap) => void;
}

export default function LabelEditor({ labels, onChange }: LabelEditorProps) {
  const [errors, setErrors] = useState<Partial<Record<CardType, string>>>({});

  function handleChange(type: CardType, value: string) {
    const nextErrors = { ...errors };
    if (value.length > MAX_LABEL_LENGTH) {
      nextErrors[type] = `Max ${MAX_LABEL_LENGTH} characters`;
    } else if (!value.trim()) {
      nextErrors[type] = 'Label cannot be empty';
    } else {
      delete nextErrors[type];
    }
    setErrors(nextErrors);
    onChange({ ...labels, [type]: value });
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {CARD_TYPES.map((type) => (
        <div key={type} className="flex items-center gap-4 rounded-lg border border-outline-variant p-4">
          <LabelPreviewCard type={type} label={labels[type]} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Input
                aria-label={`Label for ${type}`}
                value={labels[type]}
                maxLength={MAX_LABEL_LENGTH}
                onChange={(e) => handleChange(type, e.target.value)}
                error={errors[type]}
              />
              <EmojiPickerWrapper onSelect={(emoji) => handleChange(type, (labels[type] + emoji).slice(0, MAX_LABEL_LENGTH))} />
            </div>
            <p className="mt-1 text-xs text-ink-variant">
              {labels[type].length}/{MAX_LABEL_LENGTH} characters
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
