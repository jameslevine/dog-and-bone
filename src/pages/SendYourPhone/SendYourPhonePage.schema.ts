import * as Yup from 'yup'

export const CONFIGURATION_FEE = 4900

export interface SendPhoneFormValues {
  name: string
  email: string
  phoneNumber: string
  phoneModel: string
  profile: string
  customApps: string
  notes: string
}

export const initialValues: SendPhoneFormValues = {
  name: '',
  email: '',
  phoneNumber: '',
  phoneModel: '',
  profile: '',
  customApps: '',
  notes: '',
}

export const validationSchema = Yup.object({
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

export const PROFILES = [
  { id: 'essential', name: 'Essential', description: 'Calls, texts, maps, camera. Nothing more.' },
  {
    id: 'family',
    name: 'Family',
    description: 'Safe for children — no browser, no social media.',
  },
  { id: 'senior', name: 'Senior', description: 'Large text, big icons, emergency SOS.' },
  {
    id: 'balance',
    name: 'Balance',
    description: 'Browser and email with scheduled downtime.',
  },
]
