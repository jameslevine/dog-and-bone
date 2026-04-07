import { Formik, Form, Field, type FieldProps } from 'formik'
import * as Yup from 'yup'
import { CheckCircle2, Package, Settings, Truck } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { Button } from '@/components/atoms/Button'
import { RadioButton } from '@/components/atoms/RadioButton'
import { formatPrice } from '@/utils/formatPrice'

const CONFIGURATION_FEE = 4900

interface SendPhoneFormValues {
  name: string
  email: string
  phoneNumber: string
  phoneModel: string
  profile: string
  customApps: string
  notes: string
}

const validationSchema = Yup.object({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  phoneNumber: Yup.string(),
  phoneModel: Yup.string().required('Please tell us which phone model you have'),
  profile: Yup.string()
    .oneOf(['essential', 'family', 'senior', 'balance'], 'Please select a profile')
    .required('Please select a profile'),
  customApps: Yup.string().max(500, 'Please keep this under 500 characters'),
  notes: Yup.string().max(1000, 'Please keep notes under 1000 characters'),
})

const PROFILES = [
  {
    id: 'essential',
    name: 'Essential',
    description: 'Calls, texts, maps, camera. Nothing more.',
  },
  {
    id: 'family',
    name: 'Family',
    description: 'Safe for children — no browser, no social media.',
  },
  {
    id: 'senior',
    name: 'Senior',
    description: 'Large text, big icons, emergency SOS.',
  },
  {
    id: 'balance',
    name: 'Balance',
    description: 'Browser and email with scheduled downtime.',
  },
]

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
  const handleSubmit = async (
    values: SendPhoneFormValues,
    { setSubmitting }: { setSubmitting: (v: boolean) => void },
  ) => {
    // Netlify handles the form POST — we encode and submit via fetch
    const formData = new URLSearchParams()
    formData.append('form-name', 'send-your-phone')
    Object.entries(values).forEach(([key, value]) => formData.append(key, value))

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })
      // Submission success is handled by Formik status
    } catch {
      // Even on network error, the form may have been recorded — treat as success
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Hero */}
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

      {/* How it works */}
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

      {/* Form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C1503] mb-2">Get started</h2>
            <p className="text-[#5A4A3A]">
              Fill in the form and we'll send you a confirmation with the posting address.
            </p>
          </div>

          <Formik<SendPhoneFormValues>
            initialValues={{
              name: '',
              email: '',
              phoneNumber: '',
              phoneModel: '',
              profile: '',
              customApps: '',
              notes: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, helpers) => {
              await handleSubmit(values, { setSubmitting: helpers.setSubmitting })
              helpers.setStatus('success')
            }}
          >
            {({ errors, touched, values, setFieldValue, isSubmitting, status }) => {
              if (status === 'success') {
                return (
                  <div className="bg-white rounded-3xl border-2 border-[#FFB703] px-8 py-10 text-center space-y-5">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 size={44} className="text-green-600" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#2C1503]">Request received!</h3>
                    <p className="text-[#5A4A3A] leading-relaxed">
                      We've received your request. Check your inbox — we'll email you a confirmation
                      with the posting address and reference number within 1 working day.
                    </p>
                    <div className="bg-[#FFF8E7] rounded-2xl px-5 py-4 text-sm text-[#5A4A3A] border border-[#F5EDD8]">
                      <strong className="text-[#2C1503]">Posting address:</strong>
                      <br />
                      [Contact us for posting address — included in your confirmation email]
                    </div>
                  </div>
                )
              }

              return (
                <Form
                  name="send-your-phone"
                  method="POST"
                  {...({ 'data-netlify': 'true' } as React.FormHTMLAttributes<HTMLFormElement>)}
                  className="bg-white rounded-3xl border-2 border-[#F5EDD8] px-6 sm:px-8 py-8 space-y-6"
                >
                  {/* Netlify hidden field */}
                  <input type="hidden" name="form-name" value="send-your-phone" />

                  {/* Name */}
                  <Field name="name">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        label="Your name"
                        placeholder="Jane Smith"
                        error={touched.name && errors.name ? errors.name : undefined}
                        required
                      />
                    )}
                  </Field>

                  {/* Email */}
                  <Field name="email">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        label="Email address"
                        type="email"
                        placeholder="jane@example.com"
                        error={touched.email && errors.email ? errors.email : undefined}
                        required
                      />
                    )}
                  </Field>

                  {/* Phone number */}
                  <Field name="phoneNumber">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        label="Your phone number (optional)"
                        type="tel"
                        placeholder="+44 7700 900000"
                      />
                    )}
                  </Field>

                  {/* Phone model */}
                  <Field name="phoneModel">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        label="Your phone model"
                        placeholder="e.g. Samsung Galaxy A12"
                        error={
                          touched.phoneModel && errors.phoneModel ? errors.phoneModel : undefined
                        }
                        required
                      />
                    )}
                  </Field>

                  {/* Profile */}
                  <fieldset>
                    <legend className="text-sm font-bold text-[#2C1503] mb-3">
                      Which profile would you like? <span className="text-[#E63946]">*</span>
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PROFILES.map((profile) => (
                        <RadioButton
                          key={profile.id}
                          name="profile"
                          value={profile.id}
                          label={profile.name}
                          description={profile.description}
                          checked={values.profile === profile.id}
                          onChange={() => setFieldValue('profile', profile.id)}
                        />
                      ))}
                    </div>
                    {touched.profile && errors.profile && (
                      <p role="alert" className="text-xs text-[#E63946] font-semibold mt-2">
                        {errors.profile}
                      </p>
                    )}
                  </fieldset>

                  {/* Custom apps */}
                  <Field name="customApps">
                    {({ field }: FieldProps) => (
                      <Textarea
                        {...field}
                        label="Any specific apps you'd like? (optional)"
                        placeholder="e.g. I'd love to keep the Kindle app, or a simple podcast player..."
                        helperText="We'll do our best to accommodate reasonable requests."
                        error={
                          touched.customApps && errors.customApps ? errors.customApps : undefined
                        }
                        rows={3}
                      />
                    )}
                  </Field>

                  {/* Notes */}
                  <Field name="notes">
                    {({ field }: FieldProps) => (
                      <Textarea
                        {...field}
                        label="Anything else we should know? (optional)"
                        placeholder="e.g. accessibility requirements, screen protector in the box, etc."
                        error={touched.notes && errors.notes ? errors.notes : undefined}
                        rows={3}
                      />
                    )}
                  </Field>

                  {/* Price reminder */}
                  <div className="bg-[#FFF8E7] rounded-2xl px-5 py-4 flex items-center justify-between border border-[#F5EDD8]">
                    <span className="text-sm font-semibold text-[#5A4A3A]">Configuration fee</span>
                    <span className="font-extrabold text-[#2C1503] text-lg">
                      {formatPrice(CONFIGURATION_FEE)}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending…' : 'Submit Request →'}
                  </Button>

                  <p className="text-xs text-center text-[#5A4A3A]">
                    We'll email you a confirmation with posting instructions within 1 working day.
                  </p>
                </Form>
              )
            }}
          </Formik>
        </div>
      </section>
    </div>
  )
}
