import { Formik, Form, Field, type FieldProps } from 'formik'
import * as Yup from 'yup'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Textarea } from '@/components/atoms/Textarea'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { getAppsByCategory, APP_CATEGORIES } from '@/data/apps'
import { PROFILES } from '@/data/profiles'
import { useCustomizationStore } from '@/store/customizationStore'
import { type ProfileId } from '@/types'

interface AppSelectionFormProps {
  profileId: string
  onSubmit: () => void
}

interface FormValues {
  customRequest: string
}

const validationSchema = Yup.object({
  customRequest: Yup.string().max(500, 'Please keep your request under 500 characters'),
})

export function AppSelectionForm({ profileId, onSubmit }: AppSelectionFormProps) {
  const { selectedAppIds, toggleApp, setProfile, customAppsRequest, setCustomAppsRequest } =
    useCustomizationStore()

  const appsByCategory = getAppsByCategory()
  const categoryKeys = Object.keys(appsByCategory)

  const handleSubmit = (values: FormValues) => {
    setCustomAppsRequest(values.customRequest)
    onSubmit()
  }

  return (
    <div className="space-y-8">
      {/* Profile presets */}
      <div>
        <p className="text-sm font-bold text-[#2C1503] mb-3">Start from a profile preset:</p>
        <div className="flex flex-wrap gap-2">
          {PROFILES.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => setProfile(profile.id as ProfileId)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-150 cursor-pointer
                ${
                  profileId === profile.id
                    ? 'bg-[#FFB703] border-[#2C1503] text-[#2C1503]'
                    : 'bg-white border-[#F5EDD8] text-[#5A4A3A] hover:border-[#FFB703] hover:bg-[#FFF8E7]'
                }`}
            >
              {profile.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected count badge */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-[#2C1503]">Choose your apps</h2>
        <Badge variant="popular">{selectedAppIds.length} selected</Badge>
      </div>

      <Formik
        initialValues={{ customRequest: customAppsRequest }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-8">
            {/* Apps by category */}
            {categoryKeys.map((category) => {
              const apps = appsByCategory[category]
              const categoryLabel = APP_CATEGORIES[category] ?? category

              return (
                <section key={category} aria-labelledby={`category-${category}`}>
                  <h3
                    id={`category-${category}`}
                    className="text-sm font-bold uppercase tracking-widest text-[#9C8870] mb-3 border-b border-[#F5EDD8] pb-2"
                  >
                    {categoryLabel}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {apps.map((app) => (
                      <div
                        key={app.id}
                        className={`p-4 rounded-2xl border-2 transition-all duration-150
                          ${
                            selectedAppIds.includes(app.id)
                              ? 'border-[#FFB703] bg-[#FFF8E7]'
                              : 'border-[#F5EDD8] bg-white hover:border-[#FFB703]/50'
                          }`}
                      >
                        <Checkbox
                          label={app.name}
                          description={app.description}
                          checked={selectedAppIds.includes(app.id)}
                          onChange={() => toggleApp(app.id)}
                          id={`app-${app.id}`}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}

            {/* Custom request */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#9C8870] mb-3 border-b border-[#F5EDD8] pb-2">
                Anything else?
              </h3>
              <Field name="customRequest">
                {({ field }: FieldProps) => (
                  <Textarea
                    {...field}
                    label="Any other apps you'd like?"
                    placeholder="e.g. I'd also like a simple weather widget, or a specific podcast app..."
                    helperText="Optional — we'll do our best to accommodate reasonable requests."
                    error={
                      touched.customRequest && errors.customRequest
                        ? errors.customRequest
                        : undefined
                    }
                    rows={4}
                  />
                )}
              </Field>
            </section>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Continue to Review →
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
