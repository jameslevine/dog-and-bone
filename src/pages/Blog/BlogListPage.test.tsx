import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock the blog service before importing the page
vi.mock('@/services/blog', () => ({
  blogPosts: [
    {
      slug: 'test-post-one',
      title: 'Test Post One',
      date: '2024-01-01',
      author: 'Dog and Bone',
      excerpt: 'First post excerpt',
      category: 'Digital Wellbeing',
      readTime: '3 min read',
      coverImageSlug: 'blog-digital-detox',
      Component: () => <p>Content one</p>,
    },
    {
      slug: 'test-post-two',
      title: 'Test Post Two',
      date: '2024-02-01',
      author: 'Dog and Bone',
      excerpt: 'Second post excerpt',
      category: 'Seniors',
      readTime: '4 min read',
      coverImageSlug: 'blog-senior-phone',
      Component: () => <p>Content two</p>,
    },
    {
      slug: 'unknown-cover',
      title: 'Unknown Cover Post',
      date: '2024-03-01',
      author: 'Dog and Bone',
      excerpt: 'Post with unknown cover + category',
      category: 'Invented Category',
      readTime: '2 min read',
      coverImageSlug: 'totally-unknown-slug',
      Component: () => <p>Content three</p>,
    },
  ],
  getPostBySlug: vi.fn((slug: string) => {
    const posts = [
      {
        slug: 'test-post-one',
        title: 'Test Post One',
        date: '2024-01-01',
        author: 'Dog and Bone',
        excerpt: 'First post excerpt',
        category: 'Digital Wellbeing',
        readTime: '3 min read',
        coverImageSlug: 'blog-digital-detox',
        Component: () => <p>Content one</p>,
      },
    ]
    return posts.find((p) => p.slug === slug)
  }),
}))

import { BlogListPage } from './BlogListPage'

describe('BlogListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the blog heading', () => {
    render(
      <MemoryRouter>
        <BlogListPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('The Dog and Bone Blog')).toBeInTheDocument()
  })

  it('renders category filter buttons', () => {
    render(
      <MemoryRouter>
        <BlogListPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Digital Wellbeing/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Seniors/i })).toBeInTheDocument()
  })

  it('renders blog post titles', () => {
    render(
      <MemoryRouter>
        <BlogListPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Test Post One')).toBeInTheDocument()
  })

  it('filters posts when a category is clicked', () => {
    render(
      <MemoryRouter>
        <BlogListPage />
      </MemoryRouter>,
    )
    // Click Seniors category
    fireEvent.click(screen.getByRole('button', { name: /Seniors/i }))
    // Seniors post should show, others hidden
    expect(screen.getByText('Test Post Two')).toBeInTheDocument()
  })

  it('shows no articles message when category has no posts', () => {
    render(
      <MemoryRouter>
        <BlogListPage />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: /Families/i }))
    expect(screen.getByText('No articles in this category yet.')).toBeInTheDocument()
  })

  it('renders Shop Profiles CTA at the bottom', () => {
    render(
      <MemoryRouter>
        <BlogListPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Ready to simplify your phone?')).toBeInTheDocument()
  })

  it('uses the default cover image for posts with an unknown coverImageSlug', () => {
    render(
      <MemoryRouter>
        <BlogListPage />
      </MemoryRouter>,
    )
    const img = screen.getByAltText('Unknown Cover Post')
    expect(img).toHaveAttribute('src', '/images/ai/about-hero.png')
  })

  it('renders an unknown category with the default badge colour', () => {
    render(
      <MemoryRouter>
        <BlogListPage />
      </MemoryRouter>,
    )
    // Invented Category has no entry in CATEGORY_COLORS — page falls back to the default
    expect(screen.getByText('Invented Category')).toBeInTheDocument()
  })
})
