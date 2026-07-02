export type PlanetEffect =
  | 'sparkles'
  | 'petals'
  | 'memories'
  | 'funny'
  | 'hearts'
  | 'rain'
  | 'rings'
  | 'flash'
  | 'nebula'
  | 'finale'

export interface Planet {
  id: number
  name: string
  emoji: string
  /** replace the file in /public/memories with your own photo */
  image: string
  quote: string
  effect: PlanetEffect
  /** gradient colors for the rotating sphere */
  colors: [string, string]
  /** glow color */
  glow: string
}

export const PLANETS: Planet[] = [
  {
    id: 1,
    name: 'The Gift Star',
    emoji: '🍫',
    image: '/memories/gift-chocolate.png',
    quote:
      "You didn't just send me chocolate. You sent me a reason to smile.",
    effect: 'sparkles',
    colors: ['#7a4a24', '#e0b354'],
    glow: '#e0b354',
  },
  {
    id: 2,
    name: 'The Flower Planet',
    emoji: '🌹',
    image: '/memories/first-flower.png',
    quote:
      'These flowers may fade, but the happiness of giving them to you never will.',
    effect: 'petals',
    colors: ['#f4a6c0', '#ffe3ee'],
    glow: '#f9a8d4',
  },
  {
    id: 3,
    name: 'Planet Riya',
    emoji: '🌍',
    image: '/memories/planet-riya-collage.png',
    quote:
      'A whole universe exists, and somehow my favorite place in it is called Riya.',
    effect: 'memories',
    colors: ['#3a7bd5', '#4fd1c5'],
    glow: '#4fd1c5',
  },
  {
    id: 4,
    name: 'Supreme Commander Wigglypuff',
    emoji: '🚀',
    image: '/memories/wigglypuff.png',
    quote: 'Every love story needs a little chaos.',
    effect: 'funny',
    colors: ['#ff9ec4', '#7aa8ff'],
    glow: '#ff9ec4',
  },
  {
    id: 5,
    name: 'My Weakness',
    emoji: '❤️',
    image: '/memories/my-weakness.png',
    quote:
      "Truth or Dare asked me for my weakness. I didn't even have to think. It's always been you.",
    effect: 'hearts',
    colors: ['#8b1e3f', '#ff5470'],
    glow: '#ff5470',
  },
  {
    id: 6,
    name: 'The Forgiveness Moon',
    emoji: '🌙',
    image: '/memories/apology-letter.png',
    quote:
      "Love isn't about never making mistakes. It's about trying again because someone matters.",
    effect: 'rain',
    colors: ['#5b6b9e', '#c7d0f0'],
    glow: '#c7d0f0',
  },
  {
    id: 7,
    name: 'The Promise Planet',
    emoji: '💍',
    image: '/memories/proposal-day.png',
    quote:
      'This wasn\u2019t just a question. It was me asking if I could keep making memories with you.',
    effect: 'rings',
    colors: ['#b8860b', '#ffd97a'],
    glow: '#ffd97a',
  },
  {
    id: 8,
    name: 'The First Smile',
    emoji: '📷',
    image: '/memories/first-photo.png',
    quote: 'I had no idea one smile would become my favorite.',
    effect: 'flash',
    colors: ['#6b5b95', '#d9c7ff'],
    glow: '#d9c7ff',
  },
  {
    id: 9,
    name: 'The Eyes Nebula',
    emoji: '✨',
    image: '/memories/eyes-photo.png',
    quote:
      "Some galaxies aren't in the sky. Some are hidden inside beautiful eyes.",
    effect: 'nebula',
    colors: ['#8a2be2', '#ff6ec7'],
    glow: '#c77dff',
  },
  {
    id: 10,
    name: "Neer's Heart",
    emoji: '💗',
    image: '/memories/crystal-heart.png',
    quote:
      'Every memory in this universe has you in it. And every road somehow led here.',
    effect: 'finale',
    colors: ['#ff9ec4', '#ffd6e8'],
    glow: '#ff9ec4',
  },
]

export const PLANET_PASSWORD = '03072025'
