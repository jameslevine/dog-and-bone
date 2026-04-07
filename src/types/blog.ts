import type React from 'react'

export interface BlogPost {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  category: string
  readTime: string
  coverImageSlug: string
  /** The MDX component for rendering the article body */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>
}
