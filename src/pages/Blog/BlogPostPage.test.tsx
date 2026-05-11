import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// vi.mock is hoisted, so cannot reference variables declared in the file.
// Define all data inline inside the factory function.
vi.mock('@/services/blog', () => {
  const post = {
    slug: 'test-post',
    title: 'Test Blog Post Title',
    date: '2024-03-15',
    author: 'Dog and Bone Team',
    excerpt: 'A test excerpt',
    category: 'Digital Wellbeing',
    readTime: '5 min read',
    coverImageSlug: 'blog-digital-detox',
    Component: () => <p>Blog post body content</p>,
  }
  const unknownCategoryPost = {
    ...post,
    slug: 'unknown-category',
    category: 'Made Up Category',
    coverImageSlug: 'does-not-exist',
  }

  return {
    blogPosts: [post, unknownCategoryPost],
    getPostBySlug: (slug: string) => {
      if (slug === 'test-post') return post
      if (slug === 'unknown-category') return unknownCategoryPost
      return undefined
    },
  }
})

import { BlogPostPage } from './BlogPostPage'

describe('BlogPostPage', () => {
  it('renders the post title when slug matches', () => {
    render(
      <MemoryRouter initialEntries={['/blog/test-post']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument()
  })

  it('renders the post author', () => {
    render(
      <MemoryRouter initialEntries={['/blog/test-post']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Dog and Bone Team')).toBeInTheDocument()
  })

  it('renders the blog content', () => {
    render(
      <MemoryRouter initialEntries={['/blog/test-post']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Blog post body content')).toBeInTheDocument()
  })

  it('renders Article Not Found for an unknown slug', () => {
    render(
      <MemoryRouter initialEntries={['/blog/nonexistent-slug']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Article Not Found')).toBeInTheDocument()
  })

  it('renders Back to Blog link', () => {
    render(
      <MemoryRouter initialEntries={['/blog/test-post']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    )
    const backLinks = screen.getAllByRole('link', { name: /back to blog/i })
    expect(backLinks.length).toBeGreaterThan(0)
  })

  it('falls back to the default cover image for an unknown slug', () => {
    render(
      <MemoryRouter initialEntries={['/blog/unknown-category']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    )
    const coverImage = screen.getByAltText('Test Blog Post Title')
    expect(coverImage).toHaveAttribute('src', '/images/ai/about-hero.png')
  })

  it('renders an unknown category without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/blog/unknown-category']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Made Up Category')).toBeInTheDocument()
  })

  it('renders the post date in long format', () => {
    render(
      <MemoryRouter initialEntries={['/blog/test-post']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText(/15 March 2024/)).toBeInTheDocument()
  })
})
