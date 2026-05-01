export interface Testimonial {
  id: string
  quote: string
  name: string
  location: string
  profile: string
  market: 'senior' | 'family' | 'balance'
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      'My mum is 78 and finally has a phone she loves. She calls me every day. Before, she was ringing me every five minutes because something had gone wrong. Now it just works.',
    name: 'Sarah T.',
    location: 'Bristol',
    profile: 'Senior',
    market: 'senior',
  },
  {
    id: '2',
    quote:
      "We gave our 10-year-old a Dog and Bone phone for safety on the school run. He can call us, that's it. No YouTube rabbit holes, no TikTok. Best decision we've made.",
    name: 'James & Claire P.',
    location: 'Manchester',
    profile: 'Family',
    market: 'family',
  },
  {
    id: '3',
    quote:
      "I've been doing a digital detox for six months now. The Balance profile is perfect — I still have email for work, but I'm not doom-scrolling at midnight anymore. Life-changing.",
    name: 'Priya K.',
    location: 'London',
    profile: 'Balance',
    market: 'balance',
  },
]
