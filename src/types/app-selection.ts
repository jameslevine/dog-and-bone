export type AppCategory =
  | 'communication'
  | 'navigation'
  | 'health'
  | 'productivity'
  | 'camera'
  | 'browser'
  | 'entertainment'
  | 'utilities'

export interface AppItem {
  id: string
  name: string
  description: string
  category: AppCategory
  packageName: string
  /** Whether this app is included in a given profile by default */
  defaultInProfiles: string[]
  /** Whether this app can be installed on the device (pre-installed or installable) */
  available: boolean
  icon?: string
}

export interface AppSelectionByCategory {
  [category: string]: string[] // array of app IDs
}
