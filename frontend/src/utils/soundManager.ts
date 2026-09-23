// Placeholder royalty-free sound sources. Replace with licensed assets in
// /public/sounds/ before shipping to production; see README for sourcing notes.
export type SoundName =
  | 'chalkWrite'
  | 'paperRustle'
  | 'cardFlip'
  | 'ambientRadio'
  | 'victoryShehnai'
  | 'tablaTick';

export const SOUND_URLS: Record<SoundName, string> = {
  chalkWrite: '/sounds/chalk-write.mp3',
  paperRustle: '/sounds/paper-rustle.mp3',
  cardFlip: '/sounds/card-flip.mp3',
  ambientRadio: '/sounds/ambient-radio.mp3',
  victoryShehnai: '/sounds/victory-shehnai.mp3',
  tablaTick: '/sounds/tabla-tick.mp3',
};
