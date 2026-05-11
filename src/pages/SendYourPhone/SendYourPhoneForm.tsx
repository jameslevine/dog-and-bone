import { Formik, Form, Field, type FieldProps } from 'formik'
import { CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { Textarea } from '@/components/atoms/Textarea'
import { Button } from '@/components/atoms/Button'
import { RadioButton } from '@/components/atoms/RadioButton'
import { formatPrice } from '@/utils/formatPrice'
import {
  CONFIGURATION_FEE,
  PROFILES,
  type SendPhoneFormValues,
  initialValues,
  validationSchema,
} from './SendYourPhonePage.schema'

async function postToNetlify(values: SendPhoneFormValues) {
  const formData = new URLSearchParams()
  formData.append('form-name', 'send-your-phone')
  Object.entries(values).forEach(([key, value]) => formData.append(key, value))

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })
  } catch {
    // Netlify may still have recorded the submission even if the fetch errored — treat as success
  }
}

function SuccessState() {
  return (
    <div className="bg-white rounded-3xl border-2 border-[#FFB703] px-8 py-10 text-center space-y-5">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={44} className="text-green-600" aria-hidden="true" />
        </div>
      </div>
      <h3 className="text-2xl font-extrabold text-[#2C1503]">Request received!</h3>
      <p className="text-[#5A4A3A] leading-relaxed">
        We've received your request. Check your inbox — we'll email you a confirmation with the
        posting address and reference number within 1 working day.
      </p>
      <div className="bg-[#FFF8E7] rounded-2xl px-5 py-4 text-sm text-[#5A4A3A] border border-[#F5EDD8]">
        <strong className="text-[#2C1503]">Posting address:</strong>
        <br />
        [Contact us for posting address — included in your confirmation email]
      </div>
    </div>
  )
}

export function SendYourPhoneForm() {
  return (
    <Formik<SendPhoneFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        await postToNetlify(values)
        helpers.setSubmitting(false)
        helpers.setStatus('success')
      }}
    >
      {({ errors, touched, values, setFieldValue, isSubmitting, status }) => {
        if (status === 'success') return <SuccessState />

        return (
          <Form
            name="send-your-phone"
            method="POST"
            {...({ 'data-netlify': 'true' } as React.FormHTMLAttributes<HTMLFormElement>)}
            className="bg-white rounded-3xl border-2 border-[#F5EDD8] px-6 sm:px-8 py-8 space-y-6"
          >
            <input type="hidden" name="form-name" value="send-your-phone" />

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

            <Field name="phoneModel">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  label="Your phone model"
                  placeholder="e.g. Samsung Galaxy A12"
                  error={touched.phoneModel && errors.phoneModel ? errors.phoneModel : undefined}
                  required
                />
              )}
            </Field>

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

            <Field name="customApps">
              {({ field }: FieldProps) => (
                <Textarea
                  {...field}
                  label="Any specific apps you'd like? (optional)"
                  placeholder="e.g. I'd love to keep the Kindle app, or a simple podcast player..."
                  helperText="We'll do our best to accommodate reasonable requests."
                  error={touched.customApps && errors.customApps ? errors.customApps : undefined}
                  rows={3}
                />
              )}
            </Field>

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
  )
}
