/**
 * Solah Parchi Thap - Verandah Audio & Sound Engine
 * Provides authentic, latency-free Web Audio API procedural synthesis
 * for Indian baithak card-game foley (THAP slam, paper rustle, chit slide,
 * temple bell turn alert, tabla countdown tick, victory fanfare, and chai clinks).
 */

export const SOUND_URLS = {
  chalkWrite: '/sounds/chalk-write.mp3',
  paperRustle: '/sounds/paper-rustle.mp3',
  cardFlip: '/sounds/card-flip.mp3',
  ambientRadio: '/sounds/ambient-radio.mp3',
  victoryShehnai: '/sounds/victory-shehnai.mp3',
  tablaTick: '/sounds/tabla-tick.mp3',
};

class SoundEffectsEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.volume = 0.65;
    this.sfxVolume = 0.80;
    this.muted = false;
    this.ambientSource = null;
    this.ambientGain = null;
  }

  init() {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      try {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      } catch {
        return false;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  getSfxDestination() {
    return this.sfxGain || this.masterGain;
  }

  setMuted(isMuted) {
    this.muted = Boolean(isMuted);
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  isMuted() {
    return this.muted;
  }

  createNoiseBuffer(duration = 0.5) {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  /**
   * The iconic THAP!
   * Heavy hand table slap: white noise impact slap + wooden table body resonance + deep sub-bass thud.
   */
  playThap() {
    if (!this.init() || this.muted) return;
    const t = this.ctx.currentTime;

    // 1. Hand impact slap (filtered noise burst)
    const noiseBuffer = this.createNoiseBuffer(0.15);
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(3400, t);
      noiseFilter.frequency.exponentialRampToValueAtTime(120, t + 0.12);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.85, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.getSfxDestination());
      noise.start(t);
      noise.stop(t + 0.14);
    }

    // 2. Teakwood table resonance (mid punch)
    const midOsc = this.ctx.createOscillator();
    midOsc.type = 'triangle';
    midOsc.frequency.setValueAtTime(240, t);
    midOsc.frequency.exponentialRampToValueAtTime(45, t + 0.25);

    const midGain = this.ctx.createGain();
    midGain.gain.setValueAtTime(0.9, t);
    midGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    midOsc.connect(midGain);
    midGain.connect(this.getSfxDestination());
    midOsc.start(t);
    midOsc.stop(t + 0.3);

    // 3. Sub-bass visceral thud (table shudder)
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(130, t);
    subOsc.frequency.exponentialRampToValueAtTime(32, t + 0.38);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.75, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    subOsc.connect(subGain);
    subGain.connect(this.getSfxDestination());
    subOsc.start(t);
    subOsc.stop(t + 0.4);
  }

  /**
   * Parchi Card Select / Chit Flick
   * Crisp parchment paper rustle and finger flick.
   */
  playCardSelect() {
    if (!this.init() || this.muted) return;
    const t = this.ctx.currentTime;

    // Paper friction
    const noiseBuffer = this.createNoiseBuffer(0.08);
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, t);
      filter.Q.value = 1.4;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.getSfxDestination());
      noise.start(t);
      noise.stop(t + 0.08);
    }

    // Micro pitch flick
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + 0.05);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.getSfxDestination());
    osc.start(t);
    osc.stop(t + 0.06);
  }

  /**
   * Passing Parchi Chit Across Table
   * Sweeping smooth swoosh across the polished table.
   */
  playCardPass() {
    if (!this.init() || this.muted) return;
    const t = this.ctx.currentTime;

    const noiseBuffer = this.createNoiseBuffer(0.25);
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1700, t);
      filter.frequency.exponentialRampToValueAtTime(450, t + 0.22);
      filter.Q.value = 1.8;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.getSfxDestination());
      noise.start(t);
      noise.stop(t + 0.24);
    }
  }

  /**
   * Turn Alert: "It's your turn!"
   * Resonant Indian brass temple bell / chime with rich shimmering overtones.
   */
  playTurnAlert() {
    if (!this.init() || this.muted) return;
    const t = this.ctx.currentTime;

    // Harmonic bell frequencies (D5, A5, D6, A6)
    const harmonics = [
      { freq: 587.33, gain: 0.35, dur: 1.2 },
      { freq: 880.0, gain: 0.22, dur: 0.9 },
      { freq: 1174.66, gain: 0.14, dur: 0.7 },
      { freq: 1760.0, gain: 0.08, dur: 0.5 },
    ];

    harmonics.forEach(({ freq, gain: initGain, dur }) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(initGain, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      osc.connect(gain);
      gain.connect(this.getSfxDestination());
      osc.start(t);
      osc.stop(t + dur);
    });
  }

  /**
   * Tabla Countdown Urgency Tick
   * Authentic pitch-bent Dayan tabla strike for the final 5-second countdown.
   */
  playTablaTick() {
    if (!this.init() || this.muted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, t);
    osc.frequency.exponentialRampToValueAtTime(293.66, t + 0.05);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.getSfxDestination());
    osc.start(t);
    osc.stop(t + 0.16);
  }

  /**
   * Celebratory Victory Fanfare
   * Ascending joyous Indian pentatonic arpeggio (Sa, Re, Ga, Pa, Dha, Sa') + celebratory gong.
   */
  playVictory() {
    if (!this.init() || this.muted) return;
    const baseTime = this.ctx.currentTime;

    const notes = [
      { freq: 293.66, delay: 0.0 },   // D4
      { freq: 369.99, delay: 0.08 },  // F#4
      { freq: 440.0, delay: 0.16 },   // A4
      { freq: 493.88, delay: 0.24 },  // B4
      { freq: 587.33, delay: 0.32 },  // D5
      { freq: 739.99, delay: 0.44 },  // F#5 (crescendo peak)
    ];

    notes.forEach(({ freq, delay }) => {
      const t = baseTime + delay;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

      osc.connect(gain);
      gain.connect(this.getSfxDestination());
      osc.start(t);
      osc.stop(t + 0.9);
    });

    // Celebratory victory THAP echo after arpeggio
    setTimeout(() => {
      this.playThap();
    }, 480);
  }

  /**
   * Chat Pop / Taunt chime
   * Pleasant wooden block pop for messages.
   */
  playChatPop() {
    if (!this.init() || this.muted) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(840, t + 0.04);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.getSfxDestination());
    osc.start(t);
    osc.stop(t + 0.09);
  }

  /**
   * Cutting Chai Glass Clink
   * Resonant fine glass clink for chai break or toast.
   */
  playChaiClink() {
    if (!this.init() || this.muted) return;
    const t = this.ctx.currentTime;

    [2480, 3140].forEach((freq) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.getSfxDestination());
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  /**
   * Unified dispatcher for all named sound effects.
   */
  play(name) {
    switch (name) {
      case 'thapSlam':
      case 'thap':
      case 'front_hand':
        this.playThap();
        break;
      case 'cardFlick':
      case 'cardSelect':
      case 'paperRustle':
        this.playCardSelect();
        break;
      case 'cardSlide':
      case 'cardPass':
      case 'cardFlip':
        this.playCardPass();
        break;
      case 'turnAlert':
      case 'yourTurn':
        this.playTurnAlert();
        break;
      case 'tablaTick':
      case 'timerTick':
        this.playTablaTick();
        break;
      case 'victoryShehnai':
      case 'victoryFanfare':
      case 'win':
        this.playVictory();
        break;
      case 'chatPop':
      case 'chat':
        this.playChatPop();
        break;
      case 'chaiClink':
      case 'chai':
        this.playChaiClink();
        break;
      default:
        this.playCardSelect();
        break;
    }
  }

  // =========================================================================
  // BAITHAK SOOTHING MUSIC SUITE
  // =========================================================================

  getMusicEngine() {
    if (!this.musicEngine) {
      this.musicEngine = new SoothingMusicEngine(this);
    }
    return this.musicEngine;
  }

  startMusic(trackId = 'yaman', volume = 0.5) {
    if (!this.init()) return;
    this.getMusicEngine().start(trackId, volume);
  }

  stopMusic() {
    if (this.musicEngine) {
      this.musicEngine.stop();
    }
  }

  setMusicVolume(vol) {
    if (this.musicEngine) {
      this.musicEngine.setVolume(vol);
    }
  }

  isPlayingMusic() {
    return this.musicEngine ? this.musicEngine.isPlaying : false;
  }

  getCurrentMusicTrack() {
    return this.musicEngine ? this.musicEngine.currentTrack : 'yaman';
  }

  /**
   * Backward-compatible ambient radio proxy
   */
  startAmbientRadio(trackId = 'radio', volume = 0.45) {
    this.startMusic(trackId || 'radio', volume);
  }

  stopAmbientRadio() {
    this.stopMusic();
  }
}

/**
 * Procedural Indian Classical & Ambient Baithak Soothing Music Synthesizer
 * Synthesizes four rich, authentic, zero-latency musical soundscapes:
 *  1. 'yaman'   - Raag Yaman Bansuri (Bamboo Flute) & 4-String Resonant Tanpura Drone
 *  2. 'monsoon' - Courtyard Monsoon Rain, Distant Thunder & Tranquil Santoor Chimes
 *  3. 'radio'   - 1970s Transistor Baithak, Warm Lo-Fi Saturation & Sitar Harmonics
 *  4. 'morning' - Morning Verandah Birdsong, Garden Breeze & Bronze Singing Bowls
 */
export const MUSIC_TRACKS = [
  {
    id: 'yaman',
    title: 'Raag Yaman Bansuri',
    subtitle: 'Soulful Bamboo Flute & Tanpura Drone',
    category: 'Meditative Classical',
    icon: 'music_note',
    description: 'Soulful Indian bamboo flute improvisations gliding with natural breath and meend over a resonant 4-string Tanpura drone.',
  },
  {
    id: 'monsoon',
    title: 'Courtyard Monsoon',
    subtitle: 'Rain on Terracotta Tiles & Santoor',
    category: 'Atmospheric Rain',
    icon: 'water_drop',
    description: 'Soft patter of gentle rain on verandah greenery, distant warm rolling thunder, and tranquil Santoor water droplets.',
  },
  {
    id: 'radio',
    title: '1970s Transistor Baithak',
    subtitle: 'Analog Nostalgia & Sitar Harmonics',
    category: 'Vintage Nostalgia',
    icon: 'radio',
    description: 'Warm, mellow analog tone of a vintage living room transistor radio playing peaceful sitar melodies.',
  },
  {
    id: 'morning',
    title: 'Morning Verandah',
    subtitle: 'Garden Birdsong & Bronze Temple Bells',
    category: 'Morning Peace',
    icon: 'wb_sunny',
    description: 'Crisp morning garden birds chirping peacefully under gentle breeze and shimmering bronze singing bowls.',
  },
];

class SoothingMusicEngine {
  constructor(soundFxEngine) {
    this.engine = soundFxEngine;
    this.currentTrack = 'yaman';
    this.isPlaying = false;
    this.musicGain = null;
    this.reverbNode = null;
    this.volume = 0.5;
    this.activeNodes = [];
    this.intervals = [];
    this.timeouts = [];
  }

  getCtx() {
    if (!this.engine.init()) return null;
    return this.engine.ctx;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.engine.ctx) {
      try {
        const t = this.engine.ctx.currentTime;
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
        this.musicGain.gain.linearRampToValueAtTime(this.volume, t + 0.15);
      } catch {}
    }
  }

  setupMasterMusicBus(ctx) {
    // Spatial Verandah Delay / Acoustic Chamber
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.36; // 360ms spacious verandah reflection

    const delayFeedback = ctx.createGain();
    delayFeedback.gain.value = 0.28; // Subtle gentle echo

    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 1800; // Warm acoustic damping

    delay.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(delay);

    this.reverbNode = ctx.createGain();
    this.reverbNode.gain.value = 0.4;
    this.reverbNode.connect(delay);

    // Music master gain
    this.musicGain = ctx.createGain();
    const t = ctx.currentTime;
    this.musicGain.gain.setValueAtTime(0.0001, t);
    this.musicGain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.volume), t + 1.2);

    this.musicGain.connect(this.engine.masterGain);
    delay.connect(this.musicGain);

    this.activeNodes.push(delay, delayFeedback, delayFilter, this.reverbNode, this.musicGain);
  }

  start(trackId = 'yaman', volume = 0.5) {
    const ctx = this.getCtx();
    if (!ctx) return;

    // If already playing this track, just adjust volume
    if (this.isPlaying && this.currentTrack === trackId) {
      this.setVolume(volume);
      return;
    }

    this.stopImmediate();
    this.currentTrack = trackId;
    this.isPlaying = true;
    this.volume = volume;

    this.setupMasterMusicBus(ctx);

    switch (trackId) {
      case 'monsoon':
        this.playMonsoonTrack(ctx);
        break;
      case 'radio':
        this.playVintageRadioTrack(ctx);
        break;
      case 'morning':
        this.playMorningVerandahTrack(ctx);
        break;
      case 'yaman':
      default:
        this.playRaagYamanTrack(ctx);
        break;
    }
  }

  stop() {
    if (!this.isPlaying) return;
    const ctx = this.getCtx();
    if (ctx && this.musicGain) {
      try {
        const t = ctx.currentTime;
        this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
        this.musicGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      } catch {}
    }
    const timer = setTimeout(() => {
      this.stopImmediate();
    }, 650);
    this.timeouts.push(timer);
    this.isPlaying = false;
  }

  stopImmediate() {
    this.isPlaying = false;
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
    this.timeouts.forEach((id) => clearTimeout(id));
    this.timeouts = [];

    this.activeNodes.forEach((node) => {
      try {
        if (typeof node.stop === 'function') {
          node.stop();
        }
        if (typeof node.disconnect === 'function') {
          node.disconnect();
        }
      } catch {}
    });
    this.activeNodes = [];
    this.musicGain = null;
    this.reverbNode = null;
  }

  // =========================================================================
  // TRACK 1: RAAG YAMAN BANSURI & TANPURA DRONE
  // =========================================================================
  playRaagYamanTrack(ctx) {
    // 1. Hypnotic 4-String Indian Tanpura Drone (Sa, Pa, Sa, Kharaj Sa)
    // Scale root D (Pa = 220Hz, Sa = 293.66Hz, Kharaj Sa = 146.83Hz)
    const tanpuraStrings = [
      { freq: 220.0, gain: 0.16, name: 'Pa' },
      { freq: 293.66, gain: 0.18, name: 'Sa' },
      { freq: 293.66, gain: 0.18, name: 'Sa' },
      { freq: 146.83, gain: 0.22, name: 'Kharaj Sa' },
    ];
    let stringIndex = 0;

    const pluckTanpura = () => {
      if (!this.isPlaying || !this.musicGain) return;
      const current = tanpuraStrings[stringIndex % tanpuraStrings.length];
      stringIndex++;
      const t = ctx.currentTime;

      // Fundamental warm body
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(current.freq, t);

      // Resonant harmonic overtone (Javari buzz emulation)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(current.freq * 2, t);

      const javariFilter = ctx.createBiquadFilter();
      javariFilter.type = 'bandpass';
      javariFilter.frequency.setValueAtTime(current.freq * 3, t);
      javariFilter.Q.value = 3.5;

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.0001, t);
      oscGain.gain.linearRampToValueAtTime(current.gain, t + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);

      osc1.connect(oscGain);
      osc2.connect(javariFilter);
      javariFilter.connect(oscGain);

      oscGain.connect(this.musicGain);
      if (this.reverbNode) oscGain.connect(this.reverbNode);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 4.0);
      osc2.stop(t + 4.0);
    };

    // Initial string plucks
    pluckTanpura();
    const tanpuraInterval = setInterval(pluckTanpura, 1450);
    this.intervals.push(tanpuraInterval);

    // 2. Procedural Bamboo Flute (Bansuri) Alaap in Raag Yaman
    // Yaman scale notes: Ni(low), Sa, Re, Ga, Teevra Ma, Pa, Dha, Ni, High Sa
    const phrases = [
      [246.94, 329.63, 369.99, 329.63, 293.66],                     // Ni . Re . Ga . Re . Sa
      [329.63, 369.99, 415.3, 440.0, 369.99],                      // Re . Ga . Ma(T) . Pa . Ga
      [440.0, 493.88, 554.37, 587.33, 554.37, 493.88, 440.0],       // Pa . Dha . Ni . Sa' . Ni . Dha . Pa
      [587.33, 554.37, 493.88, 440.0, 369.99, 329.63, 293.66],     // Sa' . Ni . Dha . Pa . Ga . Re . Sa
      [293.66, 369.99, 440.0, 587.33, 554.37, 440.0, 369.99, 293.66], // Sa . Ga . Pa . Sa' . Ni . Pa . Ga . Sa
    ];
    let phraseIdx = 0;
    let noteIdx = 0;
    let lastFluteFreq = 293.66;

    const playNextFluteNote = () => {
      if (!this.isPlaying || !this.musicGain) return;
      const currentPhrase = phrases[phraseIdx % phrases.length];
      const targetFreq = currentPhrase[noteIdx];
      const t = ctx.currentTime;
      const noteDuration = 1.4 + Math.random() * 0.6; // 1.4s - 2.0s per flute note

      // Bamboo flute core tone
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(lastFluteFreq, t);
      // Expressive portamento (Meend) glide
      osc.frequency.setTargetAtTime(targetFreq, t, 0.12);

      // Flute warmth overtone (octave)
      const oscOct = ctx.createOscillator();
      oscOct.type = 'triangle';
      oscOct.frequency.setValueAtTime(lastFluteFreq * 2, t);
      oscOct.frequency.setTargetAtTime(targetFreq * 2, t, 0.12);

      // Natural breath vibrato LFO (4.8 Hz, eases in after 350ms)
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 4.8;
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.0, t);
      lfoGain.gain.setValueAtTime(0.0, t + 0.35);
      lfoGain.gain.linearRampToValueAtTime(3.6, t + 0.8);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Breath noise column
      const breathBuffer = this.engine.createNoiseBuffer(noteDuration);
      let breathNode = null;
      let breathGain = null;
      if (breathBuffer) {
        breathNode = ctx.createBufferSource();
        breathNode.buffer = breathBuffer;
        const breathFilter = ctx.createBiquadFilter();
        breathFilter.type = 'bandpass';
        breathFilter.frequency.value = 1750;
        breathFilter.Q.value = 2.4;

        breathGain = ctx.createGain();
        breathGain.gain.setValueAtTime(0.0001, t);
        breathGain.gain.linearRampToValueAtTime(0.025, t + 0.3);
        breathGain.gain.exponentialRampToValueAtTime(0.0001, t + noteDuration);

        breathNode.connect(breathFilter);
        breathFilter.connect(breathGain);
        breathGain.connect(this.musicGain);
        breathNode.start(t);
        breathNode.stop(t + noteDuration);
      }

      // Note envelope: soft breath attack, gentle sustain, warm release
      const noteGain = ctx.createGain();
      noteGain.gain.setValueAtTime(0.0001, t);
      noteGain.gain.linearRampToValueAtTime(0.19, t + 0.35);
      noteGain.gain.setValueAtTime(0.19, t + noteDuration - 0.45);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, t + noteDuration + 0.3);

      osc.connect(noteGain);
      oscOct.connect(noteGain);
      noteGain.connect(this.musicGain);
      if (this.reverbNode) noteGain.connect(this.reverbNode);

      lfo.start(t);
      osc.start(t);
      oscOct.start(t);

      lfo.stop(t + noteDuration + 0.4);
      osc.stop(t + noteDuration + 0.4);
      oscOct.stop(t + noteDuration + 0.4);

      lastFluteFreq = targetFreq;
      noteIdx++;

      // Phrase timing and breath rests
      let delayUntilNextNote = noteDuration * 1000 + 100;
      if (noteIdx >= currentPhrase.length) {
        noteIdx = 0;
        phraseIdx++;
        delayUntilNextNote += 2200 + Math.random() * 1200; // Peaceful breath rest between Alaap phrases
      }

      const timeoutId = setTimeout(playNextFluteNote, delayUntilNextNote);
      this.timeouts.push(timeoutId);
    };

    // First flute note after initial tanpura resonance
    const firstTimeout = setTimeout(playNextFluteNote, 1200);
    this.timeouts.push(firstTimeout);
  }

  // =========================================================================
  // TRACK 2: COURTYARD MONSOON & SANTOOR
  // =========================================================================
  playMonsoonTrack(ctx) {
    // 1. Organic Monsoon Rain Soundscape
    const rainBuffer = this.engine.createNoiseBuffer(5.0);
    if (rainBuffer) {
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = rainBuffer;
      rainSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 1100;

      const rainFilter2 = ctx.createBiquadFilter();
      rainFilter2.type = 'bandpass';
      rainFilter2.frequency.value = 2100;
      rainFilter2.Q.value = 1.2;

      const rainGain = ctx.createGain();
      const t = ctx.currentTime;
      rainGain.gain.setValueAtTime(0.001, t);
      rainGain.gain.linearRampToValueAtTime(0.18, t + 2.0);

      // Subtle breeze modulation LFO
      const windLfo = ctx.createOscillator();
      windLfo.frequency.value = 0.07;
      const windLfoGain = ctx.createGain();
      windLfoGain.gain.value = 0.05;
      windLfo.connect(windLfoGain);
      windLfoGain.connect(rainGain.gain);

      rainSource.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainSource.connect(rainFilter2);
      rainFilter2.connect(rainGain);
      rainGain.connect(this.musicGain);

      windLfo.start(t);
      rainSource.start(t);
      this.activeNodes.push(rainSource, windLfo, rainGain, rainFilter, rainFilter2);
    }

    // 2. Distant Warm Rolling Thunder
    const triggerDistantThunder = () => {
      if (!this.isPlaying || !this.musicGain) return;
      const t = ctx.currentTime;
      const thunderOsc = ctx.createOscillator();
      thunderOsc.type = 'sine';
      thunderOsc.frequency.setValueAtTime(45, t);
      thunderOsc.frequency.linearRampToValueAtTime(58, t + 2.0);
      thunderOsc.frequency.linearRampToValueAtTime(36, t + 5.0);

      const thunderGain = ctx.createGain();
      thunderGain.gain.setValueAtTime(0.0001, t);
      thunderGain.gain.linearRampToValueAtTime(0.14, t + 2.2);
      thunderGain.gain.exponentialRampToValueAtTime(0.0001, t + 6.0);

      thunderOsc.connect(thunderGain);
      thunderGain.connect(this.musicGain);

      thunderOsc.start(t);
      thunderOsc.stop(t + 6.2);

      const nextThunderDelay = 22000 + Math.random() * 14000;
      const timeoutId = setTimeout(triggerDistantThunder, nextThunderDelay);
      this.timeouts.push(timeoutId);
    };
    const thunderTimeout = setTimeout(triggerDistantThunder, 5000);
    this.timeouts.push(thunderTimeout);

    // 3. Peaceful Santoor Water Droplets in Raag Megh
    const santoorNotes = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33, 698.46];
    const triggerSantoorPluck = () => {
      if (!this.isPlaying || !this.musicGain) return;
      const freq = santoorNotes[Math.floor(Math.random() * santoorNotes.length)];
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      // Bell chime overtone
      const chime = ctx.createOscillator();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(freq * 2.76, t);

      const pluckGain = ctx.createGain();
      pluckGain.gain.setValueAtTime(0.001, t);
      pluckGain.gain.linearRampToValueAtTime(0.13, t + 0.015);
      pluckGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);

      osc.connect(pluckGain);
      chime.connect(pluckGain);
      pluckGain.connect(this.musicGain);
      if (this.reverbNode) pluckGain.connect(this.reverbNode);

      osc.start(t);
      chime.start(t);
      osc.stop(t + 2.4);
      chime.stop(t + 2.4);

      const nextPluckDelay = 1800 + Math.random() * 2600;
      const timeoutId = setTimeout(triggerSantoorPluck, nextPluckDelay);
      this.timeouts.push(timeoutId);
    };
    const santoorTimeout = setTimeout(triggerSantoorPluck, 1500);
    this.timeouts.push(santoorTimeout);
  }

  // =========================================================================
  // TRACK 3: 1970s TRANSISTOR BAITHAK (VINTAGE NOSTALGIA)
  // =========================================================================
  playVintageRadioTrack(ctx) {
    const t = ctx.currentTime;

    // Vintage Transistor Bandpass Warmth Filter (320Hz to 2800Hz)
    const radioFilter = ctx.createBiquadFilter();
    radioFilter.type = 'bandpass';
    radioFilter.frequency.value = 1150;
    radioFilter.Q.value = 1.6;

    // Harmonic Tanpura Bed
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(146.83, t); // D3 Sa

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220.0, t); // A3 Pa

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(293.66, t); // D4 Sa

    const radioGain = ctx.createGain();
    radioGain.gain.setValueAtTime(0.001, t);
    radioGain.gain.linearRampToValueAtTime(0.18, t + 1.5);

    osc1.connect(radioFilter);
    osc2.connect(radioFilter);
    osc3.connect(radioFilter);
    radioFilter.connect(radioGain);
    radioGain.connect(this.musicGain);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    this.activeNodes.push(osc1, osc2, osc3, radioFilter, radioGain);

    // Occasional gentle acoustic Sitar meend pluck
    const sitarNotes = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33];
    const triggerSitarPluck = () => {
      if (!this.isPlaying || !this.musicGain) return;
      const freq = sitarNotes[Math.floor(Math.random() * sitarNotes.length)];
      const now = ctx.currentTime;

      const sitarOsc = ctx.createOscillator();
      sitarOsc.type = 'sawtooth';
      sitarOsc.frequency.setValueAtTime(freq, now);
      sitarOsc.frequency.exponentialRampToValueAtTime(freq * 1.03, now + 0.18);

      const sitarFilter = ctx.createBiquadFilter();
      sitarFilter.type = 'lowpass';
      sitarFilter.frequency.value = 1400;

      const sitarGain = ctx.createGain();
      sitarGain.gain.setValueAtTime(0.001, now);
      sitarGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      sitarGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      sitarOsc.connect(sitarFilter);
      sitarFilter.connect(sitarGain);
      sitarGain.connect(this.musicGain);

      sitarOsc.start(now);
      sitarOsc.stop(now + 2.6);

      const nextDelay = 3200 + Math.random() * 3800;
      const timeoutId = setTimeout(triggerSitarPluck, nextDelay);
      this.timeouts.push(timeoutId);
    };
    const sitarTimeout = setTimeout(triggerSitarPluck, 2000);
    this.timeouts.push(sitarTimeout);
  }

  // =========================================================================
  // TRACK 4: MORNING VERANDAH (BIRD CALLS & BRONZE TEMPLE BELLS)
  // =========================================================================
  playMorningVerandahTrack(ctx) {
    const t = ctx.currentTime;

    // Gentle Morning Courtyard Air
    const airBuffer = this.engine.createNoiseBuffer(4.0);
    if (airBuffer) {
      const airSource = ctx.createBufferSource();
      airSource.buffer = airBuffer;
      airSource.loop = true;

      const airFilter = ctx.createBiquadFilter();
      airFilter.type = 'bandpass';
      airFilter.frequency.value = 650;
      airFilter.Q.value = 0.8;

      const airGain = ctx.createGain();
      airGain.gain.setValueAtTime(0.001, t);
      airGain.gain.linearRampToValueAtTime(0.08, t + 2.0);

      airSource.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(this.musicGain);

      airSource.start(t);
      this.activeNodes.push(airSource, airFilter, airGain);
    }

    // Peaceful Bronze Singing Bowl Bell Strike
    const triggerSingingBowl = () => {
      if (!this.isPlaying || !this.musicGain) return;
      const now = ctx.currentTime;

      // Harmonic frequencies of Indian temple singing bowl (F#3, C#4, A#4)
      [185.0, 277.18, 466.16].forEach((f, idx) => {
        const bowlOsc = ctx.createOscillator();
        bowlOsc.type = 'sine';
        bowlOsc.frequency.setValueAtTime(f, now);

        const bowlGain = ctx.createGain();
        const baseGain = idx === 0 ? 0.16 : 0.08;
        bowlGain.gain.setValueAtTime(0.0001, now);
        bowlGain.gain.linearRampToValueAtTime(baseGain, now + 0.04);
        bowlGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2);

        bowlOsc.connect(bowlGain);
        bowlGain.connect(this.musicGain);
        if (this.reverbNode) bowlGain.connect(this.reverbNode);

        bowlOsc.start(now);
        bowlOsc.stop(now + 5.5);
      });

      const nextBellDelay = 14000 + Math.random() * 10000;
      const timeoutId = setTimeout(triggerSingingBowl, nextBellDelay);
      this.timeouts.push(timeoutId);
    };
    const bowlTimeout = setTimeout(triggerSingingBowl, 1000);
    this.timeouts.push(bowlTimeout);

    // Procedural Garden Bird Calls (Sparrows & Koels)
    const triggerBirdCall = () => {
      if (!this.isPlaying || !this.musicGain) return;
      const now = ctx.currentTime;
      const basePitch = 2700 + Math.random() * 700;

      // Two-chirp melodic pattern
      const birdOsc = ctx.createOscillator();
      birdOsc.type = 'sine';
      birdOsc.frequency.setValueAtTime(basePitch, now);
      birdOsc.frequency.exponentialRampToValueAtTime(basePitch * 1.25, now + 0.07);
      birdOsc.frequency.exponentialRampToValueAtTime(basePitch * 0.95, now + 0.14);

      const birdGain = ctx.createGain();
      birdGain.gain.setValueAtTime(0.0001, now);
      birdGain.gain.linearRampToValueAtTime(0.07, now + 0.03);
      birdGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      birdOsc.connect(birdGain);
      birdGain.connect(this.musicGain);
      if (this.reverbNode) birdGain.connect(this.reverbNode);

      birdOsc.start(now);
      birdOsc.stop(now + 0.2);

      // Playful reply chirp
      setTimeout(() => {
        if (!this.isPlaying || !this.musicGain) return;
        const now2 = ctx.currentTime;
        const birdOsc2 = ctx.createOscillator();
        birdOsc2.type = 'sine';
        birdOsc2.frequency.setValueAtTime(basePitch * 1.1, now2);
        birdOsc2.frequency.exponentialRampToValueAtTime(basePitch * 1.35, now2 + 0.08);

        const birdGain2 = ctx.createGain();
        birdGain2.gain.setValueAtTime(0.0001, now2);
        birdGain2.gain.linearRampToValueAtTime(0.05, now2 + 0.02);
        birdGain2.gain.exponentialRampToValueAtTime(0.0001, now2 + 0.15);

        birdOsc2.connect(birdGain2);
        birdGain2.connect(this.musicGain);

        birdOsc2.start(now2);
        birdOsc2.stop(now2 + 0.18);
      }, 260);

      const nextBirdDelay = 4200 + Math.random() * 6000;
      const timeoutId = setTimeout(triggerBirdCall, nextBirdDelay);
      this.timeouts.push(timeoutId);
    };
    const birdTimeout = setTimeout(triggerBirdCall, 2500);
    this.timeouts.push(birdTimeout);
  }
}

export const soundEffects = new SoundEffectsEngine();

