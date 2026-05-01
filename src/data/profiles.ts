import type { Profile } from '@/types'

export const PROFILES: Profile[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Just the basics',
    description:
      'For adults who want to rediscover life without the noise. Calls, texts, maps, and a camera. Nothing more.',
    price: 14900, // pence
    stripePriceId: 'price_1TRUt1ADn0IQxQyaWuWxzFvk',
    targetMarket: 'Digital detox',
    popular: true,
    includedAppIds: ['phone', 'sms', 'camera', 'gallery', 'gmaps'],
    features: [
      'Phone calls & SMS',
      'Camera & Gallery',
      'Google Maps',
      'No social media',
      'No browser',
      'No email',
    ],
    color: '#FFB703',
  },
  {
    id: 'family',
    name: 'Family',
    tagline: 'Safe for little hands',
    description:
      'Give your child a phone without giving them the internet. Calls, GPS, camera — no social media, no YouTube, no browser.',
    price: 14900,
    stripePriceId: 'price_1TRUuVADn0IQxQyav33EukwO',
    targetMarket: 'Parents & children',
    includedAppIds: ['phone', 'sms', 'camera', 'gallery', 'gmaps', 'settings'],
    features: [
      'Everything in Essential',
      'Parental PIN lock',
      'No browser at all',
      'No social media or streaming',
      'App changes require PIN',
      'Emergency contact shortcut',
    ],
    color: '#E63946',
  },
  {
    id: 'senior',
    name: 'Senior',
    tagline: 'Simple and safe',
    description:
      'The phone that just works. Large text, big icons, one-tap emergency SOS. No confusion, no clutter.',
    price: 14900,
    stripePriceId: 'price_1TRUvBADn0IQxQyatMn25xZH',
    targetMarket: 'Seniors',
    includedAppIds: ['phone', 'sms', 'camera', 'gallery', 'gmaps'],
    features: [
      'Everything in Essential',
      'Large text & icons',
      'Emergency SOS button',
      'Simplified home screen',
      'Pre-set emergency contacts',
      'Loud speaker mode',
    ],
    color: '#2D6A4F',
  },
  {
    id: 'balance',
    name: 'Balance',
    tagline: 'Intentional technology',
    description:
      'A phone for people who want to stay connected, just not 24/7. Includes a browser, but with scheduled downtime built in.',
    price: 14900,
    stripePriceId: 'price_1TRUvcADn0IQxQyaYyA2UdQc',
    targetMarket: 'Life balance',
    includedAppIds: ['phone', 'sms', 'camera', 'gallery', 'gmaps', 'browser'],
    features: [
      'Everything in Essential',
      'Curated browser',
      'Email',
      'Scheduled downtime mode',
      'Greyscale after hours',
      'Usage time limits per app',
    ],
    color: '#5A4A3A',
  },
]

export const getProfileById = (id: string) => PROFILES.find((p) => p.id === id)
