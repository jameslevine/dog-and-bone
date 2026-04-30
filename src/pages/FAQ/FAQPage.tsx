export function FAQPage() {
  const faqs = [
    {
      category: `About the Phone`,
      questions: [
        {
          q: `What phone model do you use?`,
          a: `We use the Samsung Galaxy A12, a reliable Android device with a large screen, long battery life, and excellent camera. It's been factory-configured to be a minimalist phone.`,
        },
        {
          q: `Can I add more apps later?`,
          a: `The phone is configured in Device Owner mode with complete lockdown. This means you cannot add apps without a factory reset. Choose your apps carefully during checkout!`,
        },
        {
          q: `What happens if I factory reset the phone?`,
          a: `A factory reset removes all configuration and returns the phone to standard Samsung settings. You'll have access to all apps again.`,
        },
        {
          q: `Can I use the phone with my existing SIM card?`,
          a: `Yes! The phone is unlocked and works with any UK carrier SIM card.`,
        },
      ],
    },
    {
      category: `Ordering & Delivery`,
      questions: [
        {
          q: `How long does delivery take?`,
          a: `We configure your phone within 2-3 business days of receiving your order. Delivery takes an additional 2-3 days via Royal Mail.`,
        },
        {
          q: `Do you ship internationally?`,
          a: `Currently we only ship within the UK. International shipping coming soon!`,
        },
        {
          q: `What's included in the box?`,
          a: `Your configured Samsung Galaxy A12 phone, USB-C charging cable, and setup instructions.`,
        },
        {
          q: `Can I return the phone?`,
          a: `30-day money-back guarantee. If you're not satisfied, return it for a full refund (minus shipping).`,
        },
      ],
    },
    {
      category: `Profiles`,
      questions: [
        {
          q: `Which profile should I choose?`,
          a: `Essential: Maximum simplicity. Family: For children with parental controls. Senior: Large text and emergency SOS. Balance: Includes browser with intentional limits.`,
        },
        {
          q: `What's the difference between Essential and Balance?`,
          a: `Essential has NO browser - perfect for digital detox. Balance includes a browser for when you need it, with scheduled downtime features.`,
        },
        {
          q: `Can I switch profiles later?`,
          a: `No - the profile configuration is permanent without a factory reset. Choose the profile that best matches your needs.`,
        },
      ],
    },
    {
      category: `Features & Limitations`,
      questions: [
        {
          q: `Can I access Settings?`,
          a: `Settings is not included in the launcher by default for maximum minimalism. If you need Wi-Fi or display settings, you can request Settings access during checkout.`,
        },
        {
          q: `Does WhatsApp work?`,
          a: `Yes! If you select WhatsApp during checkout, we'll pre-install and configure it. WhatsApp calls and messages work normally.`,
        },
        {
          q: `Can I use Google Maps for navigation?`,
          a: `Yes! Maps is available on all profiles and works exactly as expected for navigation and location services.`,
        },
        {
          q: `How does the Emergency SOS button work? (Senior profile)`,
          a: `The red SOS button calls 999 (UK emergency services) immediately. It's always visible on the home screen for quick access.`,
        },
        {
          q: `How does the PIN lock work? (Family profile)`,
          a: `You'll set a 4-digit PIN on first launch. The PIN prevents children from changing apps or accessing settings.`,
        },
      ],
    },
    {
      category: `Technical`,
      questions: [
        {
          q: `Is the phone locked to your service?`,
          a: `No! The phone is unlocked and works with any carrier. We just pre-configure the software.`,
        },
        {
          q: `Can I install apps from the Play Store?`,
          a: `No. The phone is in complete lockdown mode - only the apps you selected during checkout are accessible.`,
        },
        {
          q: `What Android version does it run?`,
          a: `Samsung Galaxy A12 runs Android 11 or 12 depending on when it was manufactured, with Samsung One UI.`,
        },
        {
          q: `Will the phone receive software updates?`,
          a: `The phone can receive Samsung security updates through Wi-Fi. The Dog and Bone launcher configuration persists through updates.`,
        },
      ],
    },
    {
      category: `Support`,
      questions: [
        {
          q: `What if I forget my PIN? (Family profile)`,
          a: `Factory reset the device. This will remove all configuration and return it to standard Android. You can then use it as a normal phone.`,
        },
        {
          q: `The phone won't turn on. What do I do?`,
          a: `Charge it for at least 30 minutes using the included cable. If it still doesn't turn on, contact our support team.`,
        },
        {
          q: `How do I contact support?`,
          a: `Email us at support@dogandbonephone.co.uk - we typically respond within 24 hours.`,
        },
        {
          q: `Can you add more apps after I receive the phone?`,
          a: `Not without a factory reset. The complete lockdown is the feature - it ensures the minimal experience stays minimal!`,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Header */}
      <div className="bg-[#2C1503] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#FFB703] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#F5EDD8]/80 text-lg">
            Everything you need to know about Dog and Bone
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-12">
          {faqs.map((section, idx) => (
            <section key={idx} className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2C1503] border-b-2 border-[#FFB703] pb-3">
                {section.category}
              </h2>
              <div className="space-y-6">
                {section.questions.map((faq, qIdx) => (
                  <div key={qIdx} className="bg-white rounded-2xl p-6 border-2 border-[#F5EDD8]">
                    <h3 className="text-lg font-bold text-[#2C1503] mb-3">{faq.q}</h3>
                    <p className="text-[#5A4A3A] leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-[#FFB703] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#2C1503] mb-3">Still have questions?</h2>
          <p className="text-[#2C1503]/80 mb-6">
            We're here to help. Email us and we'll get back to you within 24 hours.
          </p>
          <a
            href="mailto:support@dogandbonephone.co.uk"
            className="inline-block px-8 py-3 bg-[#2C1503] text-white font-bold rounded-xl hover:bg-[#1A1209] transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
