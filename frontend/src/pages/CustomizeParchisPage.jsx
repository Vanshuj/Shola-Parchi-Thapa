import { useEffect, useState } from 'react';
import { useLabelStore } from '@/store/labelStore';
import { BUILTIN_PRESETS } from '@/utils/labelPresets';
import { CARD_TYPES, MAX_LABEL_LENGTH } from '@/utils/constants';
import Icon from '@/components/common/Icon';
import EmojiPickerWrapper from '@/components/labels/EmojiPickerWrapper';
import ParchiCard from '@/components/game/ParchiCard';
import Loader from '@/components/common/Loader';
import Toast from '@/components/common/Toast';
const SUIT_META = {
    TYPE_1: { label: 'Suit One', stamp: 'Kumkum Red', accent: 'text-primary' },
    TYPE_2: { label: 'Suit Two', stamp: 'Turmeric', accent: 'text-secondary' },
    TYPE_3: { label: 'Suit Three', stamp: 'Royal Ink', accent: 'text-tertiary' },
    TYPE_4: { label: 'Suit Four', stamp: 'Postal Chit', accent: 'text-on-surface' },
};
export default function CustomizeParchisPage() {
    const { labels, loading, fetch, save, reset } = useLabelStore();
    const [draft, setDraft] = useState(null);
    const [toast, setToast] = useState(null);
    useEffect(() => {
        fetch();
    }, [fetch]);
    useEffect(() => {
        if (labels)
            setDraft(labels);
    }, [labels]);
    if (loading || !draft)
        return <Loader label="Loading your parchis…"/>;
    async function handleSave() {
        if (!draft)
            return;
        await save(draft);
        setToast('Parchi set saved!');
    }
    async function handleReset() {
        await reset();
        setToast('Reset to defaults.');
    }
    function handleLabelChange(type, value) {
        setDraft((prev) => (prev ? { ...prev, [type]: value.slice(0, MAX_LABEL_LENGTH) } : prev));
    }
    return (<div className="max-w-7xl mx-auto px-space-md lg:px-margin py-space-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-space-md mb-space-lg">
        <div>
          <span className="inline-block px-space-sm py-1 rounded-full bg-surface-container-highest font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold mb-space-xs">
            Baithak Stationery Guild
          </span>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface">
            Customize Your Parchis <span className="italic text-primary font-title-lg">The Scribe Ledger</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-xs">
            Personalize the 4 sacred suits of your deck. In Solah Parchi, 16 chits are divided into 4 sets of 4
            identical names. Make them yours with nostalgic nicknames, Bollywood legends, or canteen snacks!
          </p>
        </div>
        <div className="flex gap-space-sm shrink-0">
          <button type="button" onClick={handleReset} className="px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface-variant font-label-lg text-label-lg font-bold hover:bg-surface-container-high transition-colors flex items-center gap-space-xs">
            <Icon name="restart_alt" size={18}/> Reset Defaults
          </button>
          <button type="button" onClick={handleSave} className="px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-space-xs">
            <Icon name="save" size={18}/> Save Parchi Set
          </button>
        </div>
      </div>

      {/* Privacy banner */}
      <div className="rounded-xl bg-surface-container-low border border-outline-variant p-space-md flex flex-col sm:flex-row sm:items-center gap-space-sm mb-space-lg">
        <div className="w-11 h-11 rounded-lg bg-secondary-container flex items-center justify-center shrink-0">
          <Icon name="lock" size={22} className="text-on-secondary-container"/>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant flex-1">
          <strong className="text-on-surface">100% private to your gaze.</strong> Opponents never see your custom
          chit titles! When chits slide across the floor or get swapped, they only see standard numbered folds.
          Only your screen renders your handwritten labels.
        </p>
        <span className="px-space-sm py-1 rounded-full bg-surface-container-highest font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1 shrink-0">
          <Icon name="verified_user" size={14}/> End-to-end inked
        </span>
      </div>

      {/* Presets */}
      <div className="mb-space-lg">
        <h2 className="font-title-lg text-title-lg text-on-surface mb-space-sm flex items-center gap-2">
          <Icon name="auto_stories" size={22} className="text-primary"/> Nostalgic Preset Packs
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
          {BUILTIN_PRESETS.map((preset) => (<button key={preset.id} type="button" onClick={() => setDraft(preset.labels)} className="text-left rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors p-space-md shadow-sm">
              <span className="font-headline-sm text-headline-sm text-on-surface block mb-1">{preset.name}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant block">
                {Object.values(preset.labels).join(', ')}
              </span>
            </button>))}
        </div>
      </div>

      {/* Suit editors */}
      <div>
        <h2 className="font-title-lg text-title-lg text-on-surface mb-1">The 4 Suit Manifest</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
          Type into the slip or pick a quick symbol. Each suit spawns 4 matching physical chits in the dealer shoe.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
          {CARD_TYPES.map((type, i) => (<div key={type} className="rounded-xl bg-surface-container-low shadow-sm overflow-hidden">
              <div className="p-space-md">
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="flex items-center gap-1 font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    {SUIT_META[type].label}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">4x in deck</span>
                </div>
                <div className="rounded-lg bg-surface-container-lowest p-space-sm mb-space-sm shadow-sm">
                  <div className="flex justify-between items-start mb-space-sm">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">#0{i + 1}</span>
                    <span className={`font-label-sm text-label-sm font-bold ${SUIT_META[type].accent}`}>
                      {SUIT_META[type].stamp}
                    </span>
                  </div>
                  <p className={`text-center font-headline-sm text-headline-sm mb-1 ${SUIT_META[type].accent}`}>
                    {draft[type] || 'Untitled'}
                  </p>
                  <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
                    4 of a kind &bull; 4 chits
                  </p>
                </div>
                <div className="flex items-center gap-space-xs">
                  <input aria-label={`Label for ${type}`} value={draft[type]} maxLength={MAX_LABEL_LENGTH} onChange={(e) => handleLabelChange(type, e.target.value)} className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm py-2 font-body-md text-body-md text-on-surface outline-none focus:border-primary"/>
                  <EmojiPickerWrapper onSelect={(emoji) => handleLabelChange(type, (draft[type] + emoji))}/>
                </div>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  Up to {MAX_LABEL_LENGTH} chars. Numbers, letters &amp; emojis.
                </p>
              </div>
            </div>))}
        </div>
      </div>

      {/* Hand simulator */}
      <div className="rounded-xl bg-surface-container-low p-space-lg">
        <h2 className="font-title-lg text-title-lg text-on-surface mb-1 flex items-center gap-2">
          <Icon name="front_hand" size={22} className="text-primary"/> Verandah Hand Simulator
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
          Here&rsquo;s how your custom chits fan out in your hand on the Baithak game table when the round starts.
        </p>
        <div className="flex items-end justify-center -space-x-6 hover:space-x-1 transition-all duration-300">
          {CARD_TYPES.map((type, i) => (<ParchiCard key={type} card={{ id: `preview-${type}`, type, label: draft[type] || 'Untitled' }} rotationSeed={i}/>))}
        </div>
      </div>

      <Toast message={toast} onDismiss={() => setToast(null)}/>
    </div>);
}
