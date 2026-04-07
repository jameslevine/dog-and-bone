import React from 'react'
import type { BlogPost } from '@/types/blog'

// Use Vite's import.meta.glob to eagerly import all MDX files
// Each MDX file exports frontmatter as named export (via remark-mdx-frontmatter)
// and the default export is the React component

type MDXModule = {
  default: React.ComponentType
  frontmatter: {
    title: string
    slug: string
    date: string
    author: string
    excerpt: string
    category: string
    readTime: string
    coverImageSlug: string
  }
}

const modules = import.meta.glob<MDXModule>('../content/blog/*.mdx', { eager: true })

export const blogPosts: BlogPost[] = Object.values(modules)
  .map((mod) => ({
    slug: mod.frontmatter.slug,
    title: mod.frontmatter.title,
    date: mod.frontmatter.date,
    author: mod.frontmatter.author,
    excerpt: mod.frontmatter.excerpt,
    category: mod.frontmatter.category,
    readTime: mod.frontmatter.readTime,
    coverImageSlug: mod.frontmatter.coverImageSlug,
    Component: mod.default,
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug)
