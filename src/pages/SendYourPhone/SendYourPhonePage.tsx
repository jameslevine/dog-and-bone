import { CheckCircle2, Package, Settings, Truck } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'
import { SendYourPhoneForm } from './SendYourPhoneForm'
import { CONFIGURATION_FEE } from './SendYourPhonePage.schema'

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: Package,
    title: 'Fill in the form',
    description: 'Tell us what phone you have and which apps you want.',
  },
  {
    step: 2,
    icon: Truck,
    title: 'Post your phone',
    description: 'Send it to our address with the confirmation email reference.',
  },
  {
    step: 3,
    icon: Settings,
    title: "We'll send it back",
    description: 'Configured exactly as you ordered, within 3–5 working days.',
  },
]

export function SendYourPhonePage() {
  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <section className="bg-[#FFB703] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C1503] leading-tight">
                Already have a phone?
                <br />
                Send it to us.
              </h1>
              <p className="text-lg text-[#2C1503]/80 leading-relaxed">
                We'll configure it as a Dog and Bone phone and send it back. Takes 3–5 working days.
                Just <strong>{formatPrice(CONFIGURATION_FEE)}</strong>.
              </p>
              <div className="inline-flex items-center gap-2 bg-[#2C1503] text-[#FFB703] px-4 py-2 rounded-2xl font-bold text-sm">
                <CheckCircle2 size={16} aria-hidden="true" />
                Configuration fee: {formatPrice(CONFIGURATION_FEE)}
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/images/ai/send-phone-hero.png"
                alt="Send your phone to Dog and Bone for configuration"
                className="w-full max-w-sm rounded-3xl shadow-xl object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-[#F5EDD8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1503] text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FFB703] flex items-center justify-center relative">
                  <Icon size={28} className="text-[#2C1503]" aria-hidden="true" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#2C1503] text-[#FFB703] text-xs font-extrabold flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[#2C1503] mb-1">{title}</h3>
                  <p className="text-sm text-[#5A4A3A] leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1503] mb-2">Get started</h2>
            <p className="text-[#5A4A3A]">
              Fill in the form and we'll send you a confirmation with the posting address.
            </p>
          </div>
          <SendYourPhoneForm />
        </div>
      </section>
    </div>
  )
}
