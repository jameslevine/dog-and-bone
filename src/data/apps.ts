import { type AppItem } from '@/types'

export const APPS: AppItem[] = [
  // Communication
  {
    id: 'phone',
    name: 'Phone',
    description: 'Make and receive calls',
    category: 'communication',
    packageName: 'com.samsung.android.dialer',
    defaultInProfiles: ['essential', 'family', 'senior', 'balance'],
    available: true,
  },
  {
    id: 'sms',
    name: 'Messages (SMS)',
    description: 'Send and receive text messages',
    category: 'communication',
    packageName: 'com.samsung.android.messaging',
    defaultInProfiles: ['essential', 'family', 'senior', 'balance'],
    available: true,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Free messaging and voice calls over Wi-Fi',
    category: 'communication',
    packageName: 'com.whatsapp',
    defaultInProfiles: ['balance'],
    available: true,
  },
  {
    id: 'facetime-video',
    name: 'Video Calling',
    description: 'Google Meet for video calls with family',
    category: 'communication',
    packageName: 'com.google.android.apps.meetings',
    defaultInProfiles: ['senior', 'balance'],
    available: true,
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Gmail — send and receive emails',
    category: 'communication',
    packageName: 'com.google.android.gm',
    defaultInProfiles: ['balance'],
    available: true,
  },

  // Navigation
  {
    id: 'gmaps',
    name: 'Google Maps',
    description: 'Navigation and directions',
    category: 'navigation',
    packageName: 'com.google.android.apps.maps',
    defaultInProfiles: ['essential', 'family', 'senior', 'balance'],
    available: true,
  },

  // Camera
  {
    id: 'camera',
    name: 'Camera',
    description: 'Take photos and videos',
    category: 'camera',
    packageName: 'com.sec.android.app.camera',
    defaultInProfiles: ['essential', 'family', 'senior', 'balance'],
    available: true,
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'View your photos and videos',
    category: 'camera',
    packageName: 'com.sec.android.gallery3d',
    defaultInProfiles: ['essential', 'family', 'senior', 'balance'],
    available: true,
  },

  // Health
  {
    id: 'steps',
    name: 'Step Counter',
    description: 'Track your daily steps',
    category: 'health',
    packageName: 'com.samsung.android.shealth',
    defaultInProfiles: ['balance'],
    available: true,
  },

  // Productivity
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Simple calculator',
    category: 'productivity',
    packageName: 'com.sec.android.app.popupcalculator',
    defaultInProfiles: ['essential', 'family', 'senior', 'balance'],
    available: true,
  },
  {
    id: 'alarm',
    name: 'Clock & Alarm',
    description: 'Set alarms and check the time',
    category: 'utilities',
    packageName: 'com.sec.android.app.clockpackage',
    defaultInProfiles: ['essential', 'family', 'senior', 'balance'],
    available: true,
  },
  {
    id: 'clock',
    name: 'World Clock',
    description: 'Check time around the world',
    category: 'utilities',
    packageName: 'com.sec.android.app.clockpackage',
    defaultInProfiles: ['essential', 'family', 'senior', 'balance'],
    available: true,
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Manage your schedule',
    category: 'productivity',
    packageName: 'com.google.android.calendar',
    defaultInProfiles: ['balance'],
    available: true,
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Jot things down',
    category: 'productivity',
    packageName: 'com.samsung.android.app.notes',
    defaultInProfiles: ['balance'],
    available: true,
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Check the forecast',
    category: 'productivity',
    packageName: 'com.samsung.android.weather',
    defaultInProfiles: ['balance', 'senior'],
    available: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Wi-Fi, display, and device settings (PIN protected for Family)',
    category: 'productivity',
    packageName: 'com.android.settings',
    defaultInProfiles: ['family'],
    available: true,
  },

  // Browser
  {
    id: 'browser',
    name: 'Web Browser',
    description: 'Browse the web (Samsung Internet, locked to safe sites on Family profile)',
    category: 'browser',
    packageName: 'com.sec.android.app.sbrowser',
    defaultInProfiles: ['balance'],
    available: true,
  },
]

export const APP_CATEGORIES: Record<string, string> = {
  communication: 'Communication',
  navigation: 'Navigation',
  camera: 'Camera & Photos',
  health: 'Health & Fitness',
  productivity: 'Productivity',
  utilities: 'Utilities',
  browser: 'Browser',
  entertainment: 'Entertainment',
}

export const getAppById = (id: string) => APPS.find((a) => a.id === id)

export const getAppsByCategory = () => {
  return APPS.reduce(
    (acc, app) => {
      if (!acc[app.category]) acc[app.category] = []
      acc[app.category].push(app)
      return acc
    },
    {} as Record<string, AppItem[]>,
  )
}
