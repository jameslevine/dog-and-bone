import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '@/services/blog'

const CATEGORY_COLORS: Record<string, string> = {
  'Our Story': 'bg-[#FFB703] text-[#2C1503]',
  'Digital Wellbeing': 'bg-[#2C1503] text-[#FFF8E7]',
  Seniors: 'bg-[#E63946] text-white',
  Families: 'bg-[#5A4A3A] text-white',
}

function getCoverImage(slug: string): string {
  const imageMap: Record<string, string> = {
    'about-hero': '/images/ai/about-hero.png',
    'blog-screen-time': '/images/ai/blog-screen-time.png',
    'blog-senior-phone': '/images/ai/blog-senior-phone.png',
    'blog-digital-detox': '/images/ai/blog-digital-detox.png',
    'blog-teen-mental-health': '/images/ai/blog-teen-mental-health.png',
    'blog-balance': '/images/ai/blog-balance.png',
  }
  return imageMap[slug] ?? '/images/ai/about-hero.png'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-32 text-center">
        <p className="text-6xl mb-6">📰</p>
        <h1 className="text-3xl font-extrabold text-[#2C1503] mb-4">Article Not Found</h1>
        <p className="text-[#5A4A3A] mb-8">
          We couldn't find the article you were looking for. It may have moved or been removed.
        </p>
        <Link
          to="/blog"
          className="inline-block bg-[#FFB703] text-[#2C1503] font-bold px-8 py-3 rounded-full hover:bg-[#E6A500] transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    )
  }

  const { Component } = post

  return (
    <article className="bg-[#FFFDF7] min-h-screen">
      {/* Cover Image */}
      <div className="w-full h-64 sm:h-96 overflow-hidden">
        <img
          src={getCoverImage(post.coverImageSlug)}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A4A3A] hover:text-[#E63946] transition-colors mb-8"
        >
          ← Back to Blog
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? 'bg-[#FFB703] text-[#2C1503]'}`}
          >
            {post.category}
          </span>
          <span className="text-sm text-[#8A7A6A]">{post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2C1503] leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author + Date */}
        <div className="flex items-center gap-4 pb-8 mb-8 border-b border-[#E8D5B0]">
          <div className="w-10 h-10 rounded-full bg-[#FFB703] flex items-center justify-center text-[#2C1503] font-bold text-sm">
            DB
          </div>
          <div>
            <p className="font-semibold text-[#2C1503] text-sm">{post.author}</p>
            <time dateTime={post.date} className="text-xs text-[#8A7A6A]">
              {formatDate(post.date)}
            </time>
          </div>
        </div>

        {/* MDX Content */}
        <div className="blog-content">
          <Component />
        </div>

        {/* Share / Back CTA */}
        <div className="mt-16 pt-8 border-t border-[#E8D5B0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#5A4A3A] hover:text-[#E63946] transition-colors"
          >
            ← All Articles
          </Link>
          <Link
            to="/store"
            className="inline-block bg-[#FFB703] text-[#2C1503] font-bold px-6 py-3 rounded-full hover:bg-[#E6A500] transition-colors text-sm"
          >
            Shop Dog and Bone Profiles →
          </Link>
        </div>
      </div>
    </article>
  )
}
