import { Heart, Shield, Leaf, type LucideIcon } from 'lucide-react'

interface ValueProp {
  icon: LucideIcon
  title: string
  body: string
}

const VALUE_PROPS: ValueProp[] = [
  {
    icon: Heart,
    title: 'For Seniors',
    body: 'Big text, emergency SOS, one-tap contacts. A phone that actually makes life easier.',
  },
  {
    icon: Shield,
    title: 'For Families',
    body: 'Give your child a phone without giving them the internet. You choose what they can access.',
  },
  {
    icon: Leaf,
    title: 'For Balance',
    body: 'Connected, not consumed. Reclaim your time without going completely off-grid.',
  },
]

export function ValuePropsSection() {
  return (
    <section className="bg-[#FFB703] py-20" aria-labelledby="value-props-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          id="value-props-heading"
          className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] text-center mb-14"
        >
          A phone made for real life
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUE_PROPS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white rounded-3xl p-8 border-2 border-[#2C1503] shadow-[4px_4px_0px_#2C1503] flex flex-col items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FFB703] border-2 border-[#2C1503] flex items-center justify-center shrink-0">
                <Icon size={28} className="text-[#2C1503]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-extrabold text-[#2C1503]">{title}</h3>
              <p className="text-[#5A4A3A] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
