import { useState } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '@/services/blog'

const CATEGORIES = ['All', 'Our Story', 'Digital Wellbeing', 'Seniors', 'Families']

const CATEGORY_COLORS: Record<string, string> = {
  'Our Story': 'bg-[#FFB703] text-[#2C1503]',
  'Digital Wellbeing': 'bg-[#2C1503] text-[#FFF8E7]',
  Seniors: 'bg-[#E63946] text-white',
  Families: 'bg-[#5A4A3A] text-white',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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

export function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All' ? blogPosts : blogPosts.filter((p) => p.category === activeCategory)

  return (
    <div className="bg-[#FFFDF7] min-h-screen">
      {/* Hero */}
      <section className="bg-[#2C1503] text-[#FFF8E7] py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#FFB703] font-semibold tracking-widest uppercase text-sm mb-4">
            The Dog and Bone Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Thoughts on simplicity, balance,
            <br className="hidden sm:block" /> and intentional technology.
          </h1>
          <p className="text-lg text-[#C9B99A] max-w-2xl mx-auto">
            We write about the science of screen time, real stories from people who made the switch,
            and the philosophy behind building a phone that respects your time.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-10 bg-[#FFF8E7] border-b border-[#E8D5B0] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#FFB703] text-[#2C1503]'
                    : 'bg-white text-[#5A4A3A] border border-[#D4C5A9] hover:border-[#FFB703] hover:text-[#2C1503]'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({blogPosts.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {filtered.length === 0 ? (
          <p className="text-center text-[#5A4A3A] py-20">No articles in this category yet.</p>
        ) : (
          <>
            {/* Featured first article */}
            {activeCategory === 'All' && filtered.length > 0 && (
              <Link
                to={`/blog/${filtered[0].slug}`}
                className="group block mb-12 rounded-2xl overflow-hidden bg-white border border-[#E8D5B0] hover:shadow-xl transition-shadow"
              >
                <div className="sm:flex">
                  <div className="sm:w-1/2 h-64 sm:h-auto overflow-hidden">
                    <img
                      src={getCoverImage(filtered[0].coverImageSlug)}
                      alt={filtered[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="sm:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${CATEGORY_COLORS[filtered[0].category] ?? 'bg-[#FFB703] text-[#2C1503]'}`}
                      >
                        {filtered[0].category}
                      </span>
                      <span className="text-xs text-[#8A7A6A]">{filtered[0].readTime}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1503] mb-4 group-hover:text-[#E63946] transition-colors leading-tight">
                      {filtered[0].title}
                    </h2>
                    <p className="text-[#5A4A3A] leading-relaxed mb-6">{filtered[0].excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-[#8A7A6A]">
                      <span>{filtered[0].author}</span>
                      <span>{formatDate(filtered[0].date)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining articles grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeCategory === 'All' ? filtered.slice(1) : filtered).map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-[#E8D5B0] hover:shadow-xl transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={getCoverImage(post.coverImageSlug)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${CATEGORY_COLORS[post.category] ?? 'bg-[#FFB703] text-[#2C1503]'}`}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs text-[#8A7A6A]">{post.readTime}</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#2C1503] mb-3 group-hover:text-[#E63946] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[#5A4A3A] leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#8A7A6A] border-t border-[#F0E6D3] pt-4">
                      <span>{post.author}</span>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#FFB703] py-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#2C1503] mb-4">
            Ready to simplify your phone?
          </h2>
          <p className="text-[#5A3000] mb-8 text-lg">
            Choose a profile and get your Dog and Bone phone shipped in 48 hours.
          </p>
          <Link
            to="/store"
            className="inline-block bg-[#2C1503] text-[#FFB703] font-bold px-8 py-4 rounded-full hover:bg-[#3D2106] transition-colors text-lg"
          >
            Shop Profiles
          </Link>
        </div>
      </section>
    </div>
  )
}
