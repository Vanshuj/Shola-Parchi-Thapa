import { Link } from 'react-router-dom';
import Icon from '@/components/common/Icon';

const SECTIONS = [
  {
    n: 1,
    title: 'The 16 Chits Setup',
    tag: 'Setup Phase',
    body: 'The match utilizes an exact deck of sixteen hand-folded chits divided symmetrically into four distinct roles or suits. There are four identical copies of each role. Each of the four players receives four slips face-down at the deal.',
    note: 'The Sacred Privacy Law: you can only ever inspect your own 4 chits. Opponents\u2019 chips appear face-down as folded paper envelopes. Screen peeking or asking for hints breaks traditional Baithak court etiquette.',
  },
  {
    n: 2,
    title: 'Passing Flow: Clockwise Passing (Right to Left)',
    tag: 'Game Loop',
    body: 'Play moves smoothly from player to player in strict clockwise rotation. When your turn unlocks, your hand opens. Inspect your cards, strategize your target quartet, and pass away a non-matching card to the neighbor on your left.',
    note: '01. Select one \u2014 02. 15s Timer \u2014 03. Handoff: the discard slides to the next reservoir slot. Turns pass clockwise instantly.',
  },
  {
    n: 3,
    title: 'The Grand Win Condition: THAP! (The Instant Slap)',
    tag: 'Critical Reflex',
    body: 'Four-of-a-kind triggers the instant slap condition. The instant your four chits share identical roles, your central "THAP!" pad unlocks and illuminates in Kumkum Red. You must slam it before an opponent realizes you\u2019ve assembled your set.',
    note: 'The Golden Priority Rule (Simultaneous Slap Priority): in rare instances where two players finish their 4-of-a-kind on the exact same card and both slam within milliseconds, the active passing player holds supreme resolution priority. Their win is validated first in the server timestamp.',
  },
  {
    n: 4,
    title: 'Ghost Seats & Disconnections',
    tag: 'Fail-Safe',
    body: 'Solah Parchi traditionally requires 4 hands. Our server seamlessly fills incomplete rooms with automated ghost players or handles abrupt network drops without ruining the Baithak ambiance.',
    note: '30s Reconnection Grace: if a player drops connection due to erratic mobile network signals, their seat enters a 30 second amber countdown. The game pauses or auto-passes defensively while holding their original hand and reserve memory for instant rejoin.',
  },
  {
    n: 5,
    title: 'Custom Label Privacy Policy',
    tag: 'Client-Side',
    body: 'Under the Customize Parchis feature, you can rename the four cards to anything delightful: family nicknames (Mummy, Raju, Chintu, Dadi) or favorite foods (Samosa, Jalebi, Chai, Kulfi).',
    note: 'Strictly Local Translation Mapping: the game engine only transmits abstract tokens (TYPE_1 through TYPE_4). Your custom names are strictly rendered on your local screen, never sent to anyone else\u2019s device or the server\u2019s broadcast.',
  },
];

const FAQS = [
  { q: 'Can I bluff or delay my pass to confuse opponents?', a: 'You may take up to the full 15-second turn window before passing, but you cannot hold a card past the timer \u2014 it auto-passes at random if you run out the clock.' },
  { q: 'What happens if my 15-second timer runs completely dry?', a: 'The server automatically selects a random card from your hand and passes it to your neighbor on your behalf, exactly as if you had chosen it.' },
  { q: 'What if I shout "THAP!" by mistake without 4-of-a-kind (False Slap)?', a: 'There is no separate "slap" action in this build \u2014 a win is only ever declared by the server the instant your hand genuinely holds four matching chits, so a false slap can\u2019t occur.' },
  { q: 'Can 2 friends play together against 2 computer bots?', a: 'Yes. Any empty seat in a room is automatically filled by a ghost/AI seat so the table always plays a full 2\u20134 hand.' },
  { q: 'Are custom names visible to people who join via public matchmaking?', a: 'Never. Custom labels are private per-account and are only ever rendered on your own screen \u2014 opponents always see standard chit types.' },
];

export default function RulesPage() {
  return (
    <div className="max-w-5xl mx-auto px-space-md lg:px-margin py-space-xl">
      <div className="rounded-xl bg-surface-container-lowest shadow-sm p-space-lg mb-space-xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div>
          <span className="flex items-center gap-space-xs mb-space-xs">
            <span className="px-space-sm py-0.5 rounded-full bg-secondary-container/40 font-label-sm text-label-sm text-secondary font-bold">
              Heritage Rulebook
            </span>
            <span className="px-space-sm py-0.5 rounded-full bg-primary/10 font-label-sm text-label-sm text-primary font-bold">
              Certified Rules
            </span>
          </span>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-space-xs">
            Official Baithak Rulebook &amp; Heritage Lore
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            The sacred rules of 16 chits &amp; the reflex slap. Played on woven floor mats during long monsoon
            holidays and languid summer afternoons. Learn the exact timing, bluff protocols, and the art of the
            sudden &ldquo;THAP!&rdquo;
          </p>
        </div>
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shrink-0 mx-auto lg:mx-0">
          <Icon name="pan_tool" size={40} className="text-on-primary" />
        </div>
      </div>

      <div className="space-y-space-lg mb-space-xl">
        {SECTIONS.map((section) => (
          <section key={section.n} className="rounded-xl bg-surface-container-low p-space-lg">
            <div className="flex items-center gap-space-sm mb-space-sm">
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-md shrink-0">
                {section.n}
              </span>
              <h2 className="font-title-lg text-title-lg text-on-surface flex-1">{section.title}</h2>
              <span className="px-space-sm py-0.5 rounded-full bg-surface-container-highest font-label-sm text-label-sm text-secondary font-bold whitespace-nowrap">
                {section.tag}
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm">{section.body}</p>
            <div className="rounded-lg bg-surface-container-lowest border border-outline-variant p-space-sm">
              <p className="font-body-sm text-body-sm text-on-surface-variant">{section.note}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="mb-space-xl">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Frequently Asked Questions</h2>
        <div className="space-y-space-xs">
          {FAQS.map((faq) => (
            <details key={faq.q} className="rounded-lg bg-surface-container-low p-space-md group">
              <summary className="font-label-md text-label-md font-bold text-on-surface cursor-pointer flex items-center justify-between">
                {faq.q}
                <Icon name="expand_more" size={20} className="text-on-surface-variant transition-transform group-open:rotate-180" />
              </summary>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-primary text-on-primary p-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md">
        <div>
          <h2 className="font-headline-sm text-headline-sm mb-1">The Verandah Rug is Waiting.</h2>
          <p className="font-body-md text-body-md text-on-primary-container">
            You now know the four suits, the clockwise rhythm, and the precise moment to slam. Join an active room
            or assemble your childhood circle today.
          </p>
        </div>
        <div className="flex gap-space-sm shrink-0">
          <Link
            to="/lobby"
            className="px-space-lg py-space-sm rounded-lg bg-secondary-container text-on-secondary-container font-label-lg text-label-lg font-bold shadow-sm hover:shadow-md whitespace-nowrap"
          >
            Enter Game Lobby
          </Link>
          <Link
            to="/customize"
            className="px-space-lg py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-bold shadow-sm hover:shadow-md whitespace-nowrap"
          >
            Personalize Chits
          </Link>
        </div>
      </div>
    </div>
  );
}
