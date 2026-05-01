import { Link } from 'react-router-dom'
import { Shield, Zap, Heart, Users, Baby, Briefcase } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

const VALUES = [
  {
    icon: Zap,
    title: 'Simplicity',
    description:
      "Every decision we make is guided by one question: does this make the phone simpler? If not, it doesn't belong.",
  },
  {
    icon: Shield,
    title: 'Privacy',
    description:
      'No tracking. No analytics. No data sold. Dog and Bone phones do not phone home — they just phone.',
  },
  {
    icon: Heart,
    title: 'Real life',
    description:
      'Technology should serve your life, not compete with it. We build phones that help you be present in the moments that matter.',
  },
]

const WHO_WE_HELP = [
  {
    icon: Users,
    title: 'Seniors',
    description:
      'Large text, big icons, and an emergency SOS button. A phone that feels familiar and safe — without the confusion of a modern smartphone.',
    profile: 'senior',
  },
  {
    icon: Baby,
    title: 'Families',
    description:
      'Give children their first phone without handing them the internet. No browser, no social media, no app store — just the basics.',
    profile: 'family',
  },
  {
    icon: Briefcase,
    title: 'Professionals',
    description:
      'Reclaim your focus. The Balance profile gives you essential connectivity with scheduled downtime built in from day one.',
    profile: 'balance',
  },
]

const SPECS = [
  { label: 'Screen', value: '6.5" HD+ display' },
  { label: 'Battery', value: '5000mAh — all-day life' },
  { label: 'Camera', value: '48MP quad camera' },
  { label: 'Storage', value: '32GB + microSD' },
  { label: 'RAM', value: '3GB' },
  { label: 'OS', value: 'Android 12 (configured by us)' },
]

export function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#2C1503] overflow-hidden">
        <img
          src="/images/ai/about-hero.png"
          alt="A person sitting quietly with a simple phone in hand, looking out a window"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-28 text-center">
          <p className="text-[#FFB703] font-bold uppercase tracking-widest text-sm mb-6">
            Our story
          </p>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            We built the phone we wished existed
          </h1>
          <p className="text-xl text-[#C9A97A] max-w-2xl mx-auto leading-relaxed">
            A phone that rings and sends messages. That fits in your pocket without weighing on your
            mind. That works for you — not the other way around.
          </p>
        </div>
      </section>

      {/* Origin story */}
      <section className="bg-[#FFF8E7] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-8">
            Where it all started
          </h2>
          <div className="flex flex-col gap-6 text-[#5A4A3A] text-lg leading-relaxed">
            <p>
              We noticed something a few years ago. Our phones had become the most demanding
              relationships in our lives. Every notification, every app, every feed designed to pull
              our attention away from the people in front of us.
            </p>
            <p>
              It wasn't just us. We saw it in aging parents struggling with confusing interfaces. We
              saw it in children being handed connected devices before they were ready. We saw it in
              colleagues checking their phones under the table during dinner.
            </p>
            <p>
              Smartphone manufacturers weren't going to fix it — there's no business model in a
              phone you barely look at. So we built one ourselves.
            </p>
            <p>
              Dog and Bone is the Cockney rhyming slang for phone. It felt right — a little bit
              cheeky, a little bit British, and completely unpretentious. That's what we're about.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#FFB703] py-16 border-y-2 border-[#2C1503]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#2C1503] font-bold uppercase tracking-widest text-sm mb-6">
            Our mission
          </p>
          <blockquote className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] leading-snug">
            "Making technology work for people,
            <br className="hidden sm:block" /> not the other way around."
          </blockquote>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 border-b-2 border-[#F5EDD8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-4">
              What we stand for
            </h2>
            <p className="text-[#5A4A3A] text-lg max-w-xl mx-auto">
              Three values guide every product decision we make.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="bg-[#FFF8E7] border-2 border-[#2C1503] rounded-2xl p-8 flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFB703] border-2 border-[#2C1503] flex items-center justify-center">
                  <Icon size={24} className="text-[#2C1503]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-[#2C1503]">{title}</h3>
                <p className="text-[#5A4A3A] leading-relaxed">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who we help */}
      <section className="bg-[#FFF8E7] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-4">Who we help</h2>
            <p className="text-[#5A4A3A] text-lg max-w-xl mx-auto">
              Dog and Bone isn't for everyone — and that's the point. It's for people who want their
              phone to do less.
            </p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {WHO_WE_HELP.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="bg-white border-2 border-[#2C1503] rounded-2xl p-8 flex flex-col gap-4 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2C1503] flex items-center justify-center">
                  <Icon size={24} className="text-[#FFB703]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-[#2C1503]">{title}</h3>
                <p className="text-[#5A4A3A] leading-relaxed">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The phone */}
      <section className="bg-white py-20 border-t-2 border-[#F5EDD8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-6">
                Why the Samsung Galaxy A12?
              </h2>
              <div className="flex flex-col gap-5 text-[#5A4A3A] text-lg leading-relaxed">
                <p>
                  We spent months evaluating devices. We needed a phone that was reliable,
                  affordable, and — crucially — a perfect blank slate for our configuration
                  software.
                </p>
                <p>
                  The Galaxy A12 hit every mark. It's a mid-range Android device with a large
                  screen, a massive battery, and enough processing power to run our launcher and
                  essential apps without lag.
                </p>
                <p>
                  At <strong className="text-[#2C1503]">£149</strong>, it's priced to be accessible.
                  We don't believe a simpler life should cost more.
                </p>
              </div>
            </div>
            <div className="bg-[#FFF8E7] border-2 border-[#2C1503] rounded-2xl p-8">
              <h3 className="text-xl font-extrabold text-[#2C1503] mb-6">Device specs</h3>
              <dl className="flex flex-col gap-4">
                {SPECS.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-[#F5EDD8] pb-4 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm font-bold text-[#5A4A3A] uppercase tracking-wide">
                      {label}
                    </dt>
                    <dd className="text-[#2C1503] font-semibold text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FFB703] py-20 border-t-2 border-[#2C1503]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-4">
            Find your profile
          </h2>
          <p className="text-[#2C1503] text-lg mb-8">
            Not sure which configuration is right for you? Browse our four profiles and find the
            version of Dog and Bone that fits your life.
          </p>
          <Link to="/store">
            <Button size="lg" variant="secondary">
              Browse phones
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
