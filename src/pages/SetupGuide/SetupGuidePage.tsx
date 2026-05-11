import { useState, useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SECTIONS } from './SetupGuidePage.sections'

export function SetupGuidePage() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headings = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )

    headings.forEach((el) => {
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start gap-3 bg-[#FFF3CD] border-2 border-[#FFB703] rounded-xl p-4 mb-10">
        <AlertTriangle
          size={20}
          className="text-[#2C1503] flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-sm text-[#2C1503] font-medium">
          <strong>Internal use only.</strong> This guide is intended for Dog and Bone staff and
          authorised technicians configuring customer devices. Do not share externally.
        </p>
      </div>

      <div className="flex gap-12">
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <nav className="sticky top-24" aria-label="Setup guide sections">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5A4A3A] mb-4">
              On this page
            </p>
            <ul className="flex flex-col gap-1">
              {SECTIONS.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={cn(
                      'block text-sm py-1.5 px-3 rounded-lg transition-colors duration-150',
                      activeSection === id
                        ? 'bg-[#FFB703] text-[#2C1503] font-bold'
                        : 'text-[#5A4A3A] hover:text-[#2C1503] hover:bg-[#F5EDD8]',
                    )}
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="flex-1 min-w-0 prose-custom">
          <h1 className="text-4xl font-extrabold text-[#2C1503] mb-3">Android Setup Guide</h1>
          <p className="text-[#5A4A3A] text-lg mb-12">
            Step-by-step instructions for configuring a Samsung Galaxy A12 as a Dog and Bone phone
            using our setup script.
          </p>

          {SECTIONS.map(({ id, title, content }, i) => (
            <section key={id} aria-labelledby={id}>
              {i > 0 && <hr className="border-[#F5EDD8] my-10" />}
              <h2 id={id} className="text-2xl font-extrabold text-[#2C1503] mb-6 pt-2 scroll-mt-24">
                {title}
              </h2>
              {content}
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
