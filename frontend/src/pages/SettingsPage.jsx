import { useEffect } from 'react';
import { usePreferenceStore } from '@/store/preferenceStore';
import Icon from '@/components/common/Icon';
const TIERS = [
    {
        title: 'Tier 1: Visual Textures & Craft',
        badge: 'Patina',
        subtitle: 'Handmade paper & Indian ink rules',
        toggles: [
            { key: 'paperTexture', icon: 'description', title: 'Aged Paper Grain (Khadi Paper)', hint: 'Superimposes fibrous handmade khadi paper fibers with tactile folded crease relief along the vertical card spine.' },
            { key: 'handDrawnBorders', icon: 'brush', title: 'Wobbly Borders & Rangoli', hint: 'Replaces clinical straight strokes with uneven, block-printed stamp outlines and four-corner miniature floral kolams.' },
        ],
    },
    {
        title: 'Tier 2: Motion & Tactile Gestures',
        badge: 'Physics',
        subtitle: 'Hand gestures & friction',
        toggles: [
            { key: 'cardAnimations', icon: 'view_in_ar', title: '3D Parchi Flip & Slide', hint: 'Dynamic card toss across the center ring with 3D perspective foreshortening.' },
            { key: 'reduceMotion', icon: 'accessibility_new', title: 'Reduce Motion Priority', hint: 'Instantly disables heavy flips & slam shakes (respects OS prefers-reduced-motion).' },
        ],
    },
    {
        title: 'Tier 3: Authentic Audio Suite',
        badge: 'Binaural 48kHz',
        subtitle: '',
        toggles: [
            { key: 'ambientSounds', icon: 'radio', title: 'Vintage Philips Radio & Monsoon Drizzle', hint: 'Low-frequency distant thunder with nostalgic crackle of 1970s transistor melodies.' },
            { key: 'sfxEnabled', icon: 'volume_up', title: 'Master Verandah Audio (Sound Effects & Foley)', hint: 'Toggle all analog foley, room reverbs, and instruments — parchi rustle, chai clink, and slam thap.' },
        ],
    },
    {
        title: 'Tier 4: Cultural Easter Eggs (Playful Surprises)',
        badge: 'Playful',
        subtitle: 'Verandah folklore triggers',
        toggles: [
            { key: 'easterEggs', icon: 'stars', title: 'Nostalgic Folklore Triggers', hint: '"Raju" signature stamp, idle "Chai leke aata hoon" toast, and the 5-game marathon monsoon sky.' },
        ],
    },
];
import ThemeToggle from '@/components/common/ThemeToggle';
export default function SettingsPage() {
    const { preferences, fetch, update } = usePreferenceStore();
    useEffect(() => {
        fetch();
    }, [fetch]);
    return (<div className="max-w-4xl mx-auto px-space-md lg:px-margin py-space-xl">
      <span className="block font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold mb-space-xs">
        Sutra #08 &bull; Studio &bull; Verandah Sensoria Engine
      </span>
      <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-space-xs">
        Baithak Atmosphere &amp; Sensory Controls <span className="italic text-primary font-title-lg">(Verandah Studio Settings)</span>
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-lg">
        Calibrate the tactile memory of sultry afternoons, chai-stained ledgers, hand-carved block prints, and
        acoustic verandah acoustics. Personalize how every parchi feels under your fingertips.
      </p>

      {/* Theme Illumination Card */}
      <div className="mb-space-xl p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center text-secondary">
            <Icon name="palette" size={26}/>
          </div>
          <div>
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
              Baithak Illumination &amp; Theme
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Toggle between Dopahar (Daytime sunlit courtyard) and Raat (Nighttime courtyard with glowing golden lanterns).
            </p>
          </div>
        </div>
        <ThemeToggle className="h-10 w-10 shadow-md"/>
      </div>

      <div className="space-y-space-xl">
        {TIERS.map((tier) => (<section key={tier.title}>
            <div className="flex items-center justify-between mb-space-sm">
              <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-space-sm">
                {tier.title}
                <span className="px-space-sm py-0.5 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-secondary font-bold">
                  {tier.badge}
                </span>
              </h2>
              {tier.subtitle && (<span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:block">{tier.subtitle}</span>)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {tier.toggles.map((toggle) => (<label key={toggle.key} className="rounded-xl bg-surface-container-low p-space-md flex items-start gap-space-sm cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                    <Icon name={toggle.icon} size={20} className="text-primary"/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-space-sm">
                      <span className="font-label-md text-label-md font-bold text-on-surface">{toggle.title}</span>
                      <input type="checkbox" checked={preferences[toggle.key]} onChange={(e) => update({ [toggle.key]: e.target.checked })} className="h-5 w-5 accent-primary shrink-0"/>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{toggle.hint}</p>
                  </div>
                </label>))}
            </div>
          </section>))}
      </div>

      <button type="button" onClick={() => update({
            paperTexture: true,
            handDrawnBorders: true,
            cardAnimations: true,
            ambientSounds: false,
            sfxEnabled: false,
            easterEggs: true,
            reduceMotion: false,
        })} className="mt-space-xl font-label-md text-label-md font-bold text-primary underline">
        Reset all to defaults
      </button>
    </div>);
}
