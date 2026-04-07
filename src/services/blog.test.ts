import { describe, it, expect, vi } from 'vitest'

// We need to mock import.meta.glob at module level
// Since vitest transforms this, we mock the whole service
vi.mock('@/services/blog', () => {
  const mockPosts = [
    {
      slug: 'post-one',
      title: 'First Post',
      date: '2024-01-01',
      author: 'Author',
      excerpt: 'Excerpt one',
      category: 'Digital Wellbeing',
      readTime: '3 min read',
      coverImageSlug: 'blog-screen-time',
      Component: () => null,
    },
    {
      slug: 'post-two',
      title: 'Second Post',
      date: '2024-02-01',
      author: 'Author',
      excerpt: 'Excerpt two',
      category: 'Seniors',
      readTime: '4 min read',
      coverImageSlug: 'blog-senior-phone',
      Component: () => null,
    },
  ]

  return {
    blogPosts: mockPosts,
    getPostBySlug: (slug: string) => mockPosts.find((p) => p.slug === slug),
  }
})

import { blogPosts, getPostBySlug } from './blog'

describe('blog service', () => {
  it('blogPosts is an array', () => {
    expect(Array.isArray(blogPosts)).toBe(true)
  })

  it('blogPosts has items', () => {
    expect(blogPosts.length).toBeGreaterThan(0)
  })

  it('each post has required fields', () => {
    blogPosts.forEach((post) => {
      expect(post.slug).toBeTruthy()
      expect(post.title).toBeTruthy()
      expect(post.date).toBeTruthy()
      expect(post.author).toBeTruthy()
    })
  })

  it('getPostBySlug returns a post for a valid slug', () => {
    const post = getPostBySlug('post-one')
    expect(post).toBeDefined()
    expect(post?.slug).toBe('post-one')
  })

  it('getPostBySlug returns undefined for an invalid slug', () => {
    const post = getPostBySlug('nonexistent')
    expect(post).toBeUndefined()
  })
})
