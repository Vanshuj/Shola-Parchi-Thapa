import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/common/Icon';
import { useAuthStore } from '@/store/authStore';
import { useRoomStore } from '@/store/roomStore';
import { roomApi } from '@/api/roomApi';
import { authApi } from '@/api/authApi';
const STEPS = [
    {
        n: 1,
        icon: 'front_hand',
        title: 'Deal the Parchis',
        body: '16 handwritten chits (4 sets of 4 matching identities) are shuffled thoroughly and dealt secretly — 4 to each player.',
        tag: 'SETUP: 5 SECONDS',
        color: 'bg-primary',
    },
    {
        n: 2,
        icon: 'sync_alt',
        title: 'Pass in Secret',
        body: 'On every turn, pick the odd chit out of your hand and slide it facedown to your neighbor on the left. Rhythms get frantic fast!',
        tag: 'ORDER: CLOCKWISE',
        color: 'bg-secondary-container',
    },
    {
        n: 3,
        icon: 'stylus_note',
        title: 'Craft Your Deck',
        body: 'Play classic Raja-Rani-Chor-Sipahi, or customize all 4 sets with your family\u2019s favorite inside jokes, Bollywood villains, or street foods.',
        tag: 'INFINITE VARIATIONS',
        color: 'bg-tertiary',
    },
    {
        n: 4,
        icon: 'front_hand',
        title: 'Slap Floor (THAP!)',
        body: 'Collected all 4 identical chits? Slam your hand onto the center pad! All other players must slap down on top immediately. Last hand loses!',
        tag: 'LIGHTNING REFLEXES',
        color: 'bg-primary',
    },
];
export default function LandingPage() {
    const navigate = useNavigate();
    const token = useAuthStore((s) => s.token);
    const [botLoading, setBotLoading] = useState(false);
    const [botError, setBotError] = useState(null);
    const [joiningPasscode, setJoiningPasscode] = useState(false);
    const [passcode, setPasscode] = useState('');
    const [passcodeError, setPasscodeError] = useState(null);

    async function handleStartBotMatch() {
        setBotLoading(true);
        setBotError(null);
        try {
            let currentToken = useAuthStore.getState().token;
            if (!currentToken) {
                const rand = Math.floor(1000 + Math.random() * 9000);
                const guestName = `Khiladi_${rand}`;
                const guestEmail = `khiladi_${Date.now()}_${rand}@spt.local`;
                const guestPassword = `Guest#${rand}!`;
                const authData = await authApi.register(guestName, guestEmail, guestPassword);
                useAuthStore.getState().setAuth(authData.id, authData.username, authData.token);
                currentToken = authData.token;
            }

            const newRoom = await roomApi.create(4, true);
            useRoomStore.getState().setRoom(newRoom);

            const startRes = await roomApi.start(newRoom.roomCode);
            const gameId = startRes.gameId || newRoom.gameId;
            navigate(`/game/${gameId}`);
        } catch (err) {
            console.error('Failed to start bot match:', err);
            setBotError(err?.response?.data?.message || err?.message || 'Could not start bot match. Please try again.');
        } finally {
            setBotLoading(false);
        }
    }

    async function handlePasscodeSubmit(e) {
        if (e) e.preventDefault();
        const code = passcode.trim().toUpperCase();
        if (!code) return;
        setPasscodeError(null);
        setJoiningPasscode(true);
        try {
            let currentToken = useAuthStore.getState().token;
            if (!currentToken) {
                const rand = Math.floor(1000 + Math.random() * 9000);
                const authData = await authApi.register(`Khiladi_${rand}`, `khiladi_${Date.now()}_${rand}@spt.local`, `Guest#${rand}!`);
                useAuthStore.getState().setAuth(authData.id, authData.username, authData.token);
            }
            const joinedRoom = await roomApi.join(code);
            useRoomStore.getState().setRoom(joinedRoom);
            navigate(`/lobby/${code}`);
        } catch (err) {
            console.error('Could not join room:', err);
            setPasscodeError(err?.response?.data?.message || 'Could not join room. Check the code and try again.');
        } finally {
            setJoiningPasscode(false);
        }
    }

    return (<div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative w-full pt-16 pb-16 lg:pb-24 px-space-md lg:px-margin overflow-hidden bg-gradient-to-b from-surface-container-high/30 via-surface-container/15 to-transparent dark:from-surface-container-high/15 dark:via-surface-container/5 dark:to-transparent transition-colors duration-300">
        <div className="absolute inset-0 opacity-40 dark:opacity-15 text-secondary dark:text-outline-variant pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 0.75px, transparent 0.75px)', backgroundSize: '24px 24px' }}/>
        <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"/>
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-primary-fixed/30 dark:bg-primary/20 blur-3xl pointer-events-none"/>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-lg items-center">
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs mb-space-md rounded-full bg-surface-container-highest shadow-sm">
              <Icon name="verified" size={18} filled className="text-primary"/>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                1980s Baithak Classic &bull; Realtime 4P
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-on-surface tracking-tight font-extrabold leading-none mb-space-md">
              The Ancestral Verandah Game, <span className="text-primary italic font-title-lg">Reimagined.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-space-lg leading-relaxed">
              16 Parchis. 4 Players. 1 Lightning Slap. Experience India&rsquo;s beloved drawing-room card game
              with real-time multiplayer, customizable handwritten chits, and tactile wooden floor acoustics.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm w-full sm:w-auto mb-space-lg">
              <button
                type="button"
                id="play-bots-btn"
                onClick={handleStartBotMatch}
                disabled={botLoading}
                className="group relative px-space-lg py-space-md rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-xl hover:bg-primary-container active:translate-y-0.5 transition-all flex items-center justify-center gap-space-xs disabled:opacity-50"
                title="Start instant 4-player game with AI bots"
              >
                {botLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    <span>Starting Bots...</span>
                  </>
                ) : (
                  <>
                    <Icon name="smart_toy" size={20} className="transition-transform group-hover:scale-125"/>
                    <span>Play with Bots</span>
                    <span className="ml-1 text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-surface-container-lowest/20 text-on-primary font-extrabold">Instant</span>
                  </>
                )}
              </button>

              <Link
                to={token ? "/lobby" : "/signup"}
                className="px-space-lg py-space-md rounded-lg bg-secondary-container text-on-secondary-container font-label-lg text-label-lg font-bold shadow-sm hover:shadow-md active:translate-y-0.5 transition-all flex items-center justify-center gap-space-xs"
              >
                <Icon name="chair" size={20}/>
                <span>Create Private Baithak</span>
              </Link>
            </div>
            {botError && (
              <div className="mb-space-md p-space-sm rounded-lg bg-error/10 border border-error/30 text-error text-body-sm flex items-center gap-space-xs max-w-md">
                <Icon name="error" size={18} />
                <span>{botError}</span>
              </div>
            )}

            <form onSubmit={handlePasscodeSubmit} className="w-full sm:max-w-md p-space-sm rounded-xl bg-surface-container-low shadow-sm flex items-center gap-space-sm">
              <div className="flex items-center gap-space-xs pl-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase">
                <Icon name="key" size={18} className="text-secondary"/>
                <span>Passcode:</span>
              </div>
              <input
                maxLength={8}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                placeholder="THAP-9812"
                disabled={joiningPasscode}
                className="flex-1 bg-surface-container-lowest px-space-sm py-1.5 rounded font-label-md text-label-md text-on-surface uppercase tracking-widest outline-none text-center placeholder:text-outline-variant disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={joiningPasscode || !passcode.trim()}
                className="px-space-md py-1.5 rounded-lg bg-surface-container-highest hover:bg-secondary-fixed text-on-secondary-container font-label-sm text-label-sm uppercase font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {joiningPasscode ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <span>Enter</span>
                )}
              </button>
            </form>
            {passcodeError && (
              <p className="text-xs text-error mt-1">{passcodeError}</p>
            )}
          </div>

          {/* Hero visual: Baithak table */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="w-full max-w-[480px] aspect-square rounded-full bg-surface-container-high/60 absolute -z-0"/>
            <div className="relative w-full max-w-[500px] bg-surface-container-lowest dark:bg-surface-container-low/90 dark:border dark:border-outline-variant/30 rounded-full p-space-lg shadow-2xl flex flex-col items-center justify-between aspect-square">
              <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high shadow-sm -mt-2">
                <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-label-sm">
                  G
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface">Grandma</span>
                  <span className="font-body-sm text-[10px] leading-none text-secondary">Raja Collector</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-between px-space-xs">
                <div className="flex flex-col items-center gap-1 bg-surface-container-high px-space-sm py-space-xs rounded-xl shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center font-bold text-label-sm">
                    R
                  </div>
                  <span className="font-label-sm text-[11px] font-bold text-on-surface">Rohan (NJ)</span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant">Passing...</span>
                </div>

                <div className="relative flex flex-col items-center justify-center">
                  <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center text-center p-space-sm relative z-20 group cursor-pointer overflow-hidden" style={{
            background: 'radial-gradient(circle at 35% 28%, #ff6b6b 0%, #ee2727 25%, #b91c1c 50%, #7a0008 80%, #3d0004 100%)',
            boxShadow: 'inset -8px -12px 24px rgba(0, 0, 0, 0.7), inset 4px 6px 14px rgba(255, 255, 255, 0.5), 0 20px 40px -8px rgba(147, 0, 11, 0.55), 0 10px 25px rgba(0, 0, 0, 0.3)',
        }}>
                    {/* Spherical glossy highlight */}
                    <div className="absolute top-2.5 left-5 w-12 h-6 rounded-full bg-gradient-to-b from-white/70 via-white/20 to-transparent -rotate-12 pointer-events-none blur-[0.5px]"/>
                    {/* Spherical bottom bounce glow */}
                    <div className="absolute bottom-2 inset-x-8 h-4 rounded-full bg-red-400/25 blur-sm pointer-events-none"/>

                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <Icon name="pan_tool" size={34} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:animate-bounce"/>
                      <span className="font-headline-lg text-headline-lg text-white tracking-tight font-black leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                        THAP!
                      </span>
                      <span className="font-label-sm text-[10px] uppercase tracking-widest text-red-100 font-bold mt-1 drop-shadow">
                        SLAP HERE
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-secondary-container/30 -z-10 animate-ping"/>
                  <div className="absolute -top-10 -right-8 w-11 h-11 rounded-full bg-surface-container-highest shadow-sm flex items-center justify-center" title="Cutting Chai">
                    <Icon name="emoji_food_beverage" size={20} className="text-secondary"/>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 bg-surface-container-high px-space-sm py-space-xs rounded-xl shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center font-bold text-label-sm">
                    M
                  </div>
                  <span className="font-label-sm text-[11px] font-bold text-on-surface">Meera K.</span>
                  <span className="font-body-sm text-[10px] text-secondary">3 Matches!</span>
                </div>
              </div>

              <div className="w-full flex flex-col items-center -mb-4">
                <div className="flex items-center -space-x-5 hover:space-x-1 transition-all duration-300">
                  {['Raja', 'Raja', 'Raja', 'Wazir'].map((name, i) => (<div key={i} className="w-16 h-24 sm:w-20 sm:h-32 rounded bg-surface-container-lowest shadow-md p-2 flex flex-col justify-between cursor-pointer hover:-translate-y-4 hover:rotate-0 transition-transform" style={{ transform: `rotate(${(i - 1.5) * 8}deg)` }}>
                      <div className="flex justify-between items-start">
                        <span className="font-headline-sm text-[11px] font-bold text-primary">
                          {name === 'Wazir' ? 'Minister' : 'King'}
                        </span>
                        <span className="font-label-sm text-[10px] text-secondary">1000</span>
                      </div>
                      <div className="text-center font-headline-md text-headline-sm text-primary">{name}</div>
                      <div className="font-body-sm text-[9px] text-center text-outline">Chit {i + 1}/4</div>
                    </div>))}
                </div>
                <p className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant text-center">
                  You have 3 of 4 Raja chits &bull; Pass Wazir to Rohan!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to play */}
      <section className="px-space-md lg:px-margin py-16">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Simple Verandah Rules
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-2 mb-3">
            How to Play Solah Parchi Thap
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            No complicated math, no heavy rulebooks. Just 16 pieces of paper, four conspirators, and the
            quickest hand on the carpet.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {STEPS.map((step) => (<div key={step.n} className="rounded-xl bg-surface-container-low p-space-lg shadow-sm">
              <div className={`w-8 h-8 rounded-full ${step.color} text-on-primary flex items-center justify-center font-bold text-label-md mb-space-md`}>
                {step.n}
              </div>
              <div className="w-11 h-11 rounded-lg bg-surface-container-highest flex items-center justify-center mb-space-md">
                <Icon name={step.icon} size={22} className="text-primary"/>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-space-xs">{step.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">{step.body}</p>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                {step.tag}
              </span>
            </div>))}
        </div>
      </section>

      {/* Why it feels like yesterday */}
      <section className="px-space-md lg:px-margin py-16 bg-surface-container-low/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start mb-space-xl">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                Built for Soulful Connection
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-2">
                Why It Feels Like Yesterday Afternoon
              </h2>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Carefully tuned tactile micro-interactions that transport you right back to your grandparents&rsquo;
              cool red-oxide veranda floor.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
            <div className="lg:col-span-2 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-1 mb-space-md rounded-full bg-surface-container-highest">
                <Icon name="lock" size={16} className="text-secondary"/>
                <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">
                  Private Deck Masking
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
                100% Private Handwritten Labels
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                Create chits titled after cousins, childhood gully nicknames, or regional dishes. Opponents only
                see crisp folded paper chits in flight &mdash; labels reveal themselves only in your hand!
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                {[
            { name: 'Pani Puri', hint: 'Crisp Mint Water Chits' },
            { name: 'Hot Samosa', hint: 'Spiced Potato Pastry' },
            { name: 'Crisp Jalebi', hint: 'Sweet Saffron Coils' },
            { name: 'Khasta Kachori', hint: 'Lentil Crisp' },
        ].map((set) => (<div key={set.name} className="rounded-lg bg-surface-container-high p-space-sm text-center">
                    <span className="font-label-sm text-label-sm uppercase text-secondary font-bold block mb-1">
                      Set
                    </span>
                    <span className="font-headline-sm text-[13px] text-primary block">{set.name}</span>
                    <span className="font-body-sm text-[10px] text-on-surface-variant block">{set.hint}</span>
                  </div>))}
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-secondary-container flex items-center justify-center mb-space-md">
                <Icon name="graphic_eq" size={22} className="text-on-secondary-container"/>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
                Verandah Foley &amp; Sound Design
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Real paper rustles recorded from handmade khadi paper, wooden table slams, vintage transistor
                radio murmurs, and celebratory shehnai fanfare.
              </p>
            </div>

            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-primary-fixed flex items-center justify-center mb-space-md">
                <Icon name="smart_toy" size={22} className="text-primary"/>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">Clever AI Companions</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Missing a 4th player? Seamlessly fill seats with quirky AI personas: &ldquo;Cautious Uncle,&rdquo;
                &ldquo;Impulsive Chhotu,&rdquo; or &ldquo;Observant Dadi.&rdquo;
              </p>
            </div>

            <div className="lg:col-span-2 rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
              <div className="w-11 h-11 rounded-lg bg-tertiary-container flex items-center justify-center mb-space-md">
                <Icon name="bolt" size={22} className="text-on-tertiary"/>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
                Ultra-Low Latency Slap Engine
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Because 4 hands hit the table within milliseconds of each other, our bespoke time-sync ensures
                fair order of contact even between Mumbai, Singapore, and California.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-space-md lg:px-margin py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-xl bg-secondary-container flex items-center justify-center mx-auto mb-space-md shadow-md">
            <Icon name="filter_vintage" size={32} className="text-on-secondary-container"/>
          </div>
          <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mb-space-sm">
            Ready to Slap the Floor?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg">
            Create a room or play with bots, share your room code with friends, and experience the nostalgic excitement of Solah Parchi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-space-sm">
            <button
              type="button"
              onClick={handleStartBotMatch}
              disabled={botLoading}
              className="px-space-lg py-space-md rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:shadow-xl hover:bg-primary-container active:translate-y-0.5 transition-all flex items-center justify-center gap-space-xs w-full sm:w-auto disabled:opacity-50"
            >
              {botLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading Bots...</span>
                </>
              ) : (
                <>
                  <Icon name="smart_toy" size={20}/>
                  <span>Play with Bots</span>
                </>
              )}
            </button>
            <Link to="/rules" className="px-space-lg py-space-md rounded-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg font-bold shadow-sm hover:shadow-md flex items-center justify-center gap-space-xs w-full sm:w-auto border border-outline-variant">
              <Icon name="menu_book" size={20}/>
              <span>Read Comprehensive Rules</span>
            </Link>
          </div>
          <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-md font-body-sm text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Icon name="check_circle" size={16} className="text-secondary"/> 100% Free to Play
            </span>
            <span className="flex items-center gap-1">
              <Icon name="check_circle" size={16} className="text-secondary"/> Realtime Multiplayer
            </span>
            <span className="flex items-center gap-1">
              <Icon name="check_circle" size={16} className="text-secondary"/> Works on Mobile &amp; Tablet
            </span>
          </div>
        </div>
      </section>
    </div>);
}
