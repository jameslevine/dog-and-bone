import { Link } from 'react-router-dom'
import { Share2, ShoppingCart, DollarSign, Clock, BarChart2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

// Update this URL once your Endorsely program is live
const AFFILIATE_URL = 'https://endorsely.com/register' // Default Endorsely sign-up page

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: Share2,
    title: 'Share your link',
    description:
      'Get your unique referral link from the Rewardful dashboard. Share it on your blog, social channels, or with friends and family.',
  },
  {
    step: 2,
    icon: ShoppingCart,
    title: 'Friend buys a phone',
    description:
      'When someone clicks your link and purchases a Dog and Bone phone within 30 days, the sale is attributed to you.',
  },
  {
    step: 3,
    icon: DollarSign,
    title: 'You earn a reward',
    description:
      'Choose 10% cash commission paid monthly, or give your friend a £15 discount code — a great way to sweeten the deal.',
  },
]

const STATS = [
  { label: 'Average order value', value: '£149' },
  { label: 'Cash commission', value: '10%' },
  { label: 'Cookie duration', value: '30 days' },
  { label: 'Minimum payout', value: '£0' },
]

const BENEFITS = [
  'Monthly payouts via bank transfer or PayPal',
  'Real-time dashboard showing clicks, conversions, and earnings',
  'No minimum earnings threshold — get paid from your first sale',
  'Access to brand assets, copy, and promotional materials',
  'Dedicated affiliate support via email',
  'Early access to new products and promotions',
]

const FAQS = [
  {
    question: 'How do I get paid?',
    answer:
      'We pay out commissions monthly via bank transfer or PayPal. There is no minimum threshold — as soon as a sale is confirmed, your earnings are queued for the next payment run.',
  },
  {
    question: 'What counts as a confirmed sale?',
    answer:
      'A sale is confirmed once the order has been fulfilled and the 14-day return window has passed. This protects against refunded orders being paid out.',
  },
  {
    question: 'Can I choose between commission and a discount code?',
    answer:
      'Yes. You can switch between earning 10% cash commission per sale or generating a £15 discount code to pass on to your referral. You set this per link in the dashboard.',
  },
  {
    question: 'Is there an approval process?',
    answer:
      'We review applications to make sure affiliates are a good fit for the Dog and Bone brand. We typically respond within 2 working days.',
  },
]

export function AffiliatePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#FFB703] py-20 border-b-2 border-[#2C1503]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#2C1503] font-bold uppercase tracking-widest text-sm mb-4">
            Affiliate Programme
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C1503] mb-6 leading-tight">
            Earn money recommending Dog&nbsp;&amp;&nbsp;Bone
          </h1>
          <p className="text-lg sm:text-xl text-[#2C1503] mb-10 max-w-2xl mx-auto">
            Share something you genuinely believe in — a simpler phone that makes life better — and
            earn a reward every time someone buys.
          </p>
          <a href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="secondary">
              Join the Programme
            </Button>
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#2C1503] py-12 border-b-2 border-[#2C1503]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map(({ label, value }) => (
              <li key={label}>
                <p className="text-3xl font-extrabold text-[#FFB703] mb-1">{value}</p>
                <p className="text-sm text-[#FFF8E7]">{label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#FFF8E7] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-4">
              How it works
            </h2>
            <p className="text-[#5A4A3A] text-lg max-w-xl mx-auto">
              Three simple steps from sharing your link to money in your pocket.
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
              <li
                key={step}
                className="bg-white border-2 border-[#2C1503] rounded-2xl p-8 flex flex-col items-start gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-[#FFB703] border-2 border-[#2C1503] flex items-center justify-center font-extrabold text-[#2C1503] text-lg flex-shrink-0">
                    {step}
                  </span>
                  <Icon size={22} className="text-[#2C1503]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-extrabold text-[#2C1503]">{title}</h3>
                <p className="text-[#5A4A3A] leading-relaxed">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Commission details */}
      <section className="bg-white py-20 border-t-2 border-[#F5EDD8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-4">
              Choose your reward
            </h2>
            <p className="text-[#5A4A3A] text-lg max-w-xl mx-auto">
              You decide how to use your affiliate power — earn cash or pass savings to your
              community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Cash option */}
            <div className="border-2 border-[#2C1503] rounded-2xl p-8 bg-[#FFF8E7] flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFB703] border-2 border-[#2C1503] flex items-center justify-center">
                <DollarSign size={24} className="text-[#2C1503]" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#2C1503]">10% cash commission</h3>
              <p className="text-[#5A4A3A] leading-relaxed">
                Earn 10% on every confirmed sale. With an average order value of £149, that's{' '}
                <strong className="text-[#2C1503]">£14.90 per sale</strong> straight to your account
                each month.
              </p>
              <p className="text-sm text-[#5A4A3A] bg-white border border-[#E8D8C0] rounded-xl p-3">
                Best for: content creators, bloggers, and anyone who can drive consistent referrals.
              </p>
            </div>

            {/* Discount option */}
            <div className="border-2 border-[#2C1503] rounded-2xl p-8 bg-[#FFF8E7] flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFB703] border-2 border-[#2C1503] flex items-center justify-center">
                <Clock size={24} className="text-[#2C1503]" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#2C1503]">£15 discount code</h3>
              <p className="text-[#5A4A3A] leading-relaxed">
                Generate a unique £15 discount code to share with your audience. A brilliant way to
                boost conversions and give your community a genuine saving.
              </p>
              <p className="text-sm text-[#5A4A3A] bg-white border border-[#E8D8C0] rounded-xl p-3">
                Best for: community managers, teachers, and carers recommending to families or
                seniors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#FFF8E7] py-20 border-t-2 border-[#F5EDD8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-6">
                Everything you need to succeed
              </h2>
              <p className="text-[#5A4A3A] text-lg mb-8 leading-relaxed">
                We've made it simple to track your performance, get paid, and support your referrals
                — with no hoops to jump through.
              </p>
              <ul className="flex flex-col gap-4">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-[#FFB703] flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-[#2C1503]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2C1503] rounded-2xl p-8 text-center flex flex-col items-center gap-6">
              <BarChart2 size={48} className="text-[#FFB703]" aria-hidden="true" />
              <div>
                <p className="text-[#FFF8E7] text-2xl font-extrabold mb-2">Real-time dashboard</p>
                <p className="text-[#C9A97A] leading-relaxed">
                  Track clicks, conversions, and earnings in real time through your Rewardful
                  dashboard. No spreadsheets. No chasing invoices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 border-t-2 border-[#F5EDD8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-12 text-center">
            Frequently asked questions
          </h2>
          <dl className="flex flex-col gap-8">
            {FAQS.map(({ question, answer }) => (
              <div
                key={question}
                className="border-b-2 border-[#F5EDD8] pb-8 last:border-0 last:pb-0"
              >
                <dt className="text-xl font-extrabold text-[#2C1503] mb-3">{question}</dt>
                <dd className="text-[#5A4A3A] leading-relaxed">{answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FFB703] py-20 border-t-2 border-[#2C1503]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1503] mb-4">
            Ready to get started?
          </h2>
          <p className="text-[#2C1503] text-lg mb-8">
            Join the Dog &amp; Bone affiliate programme today and start earning from the first
            referral — no minimums, no fuss.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary">
                Join the Programme
              </Button>
            </a>
            <Link to="/store">
              <Button size="lg" variant="ghost">
                Browse phones first
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
