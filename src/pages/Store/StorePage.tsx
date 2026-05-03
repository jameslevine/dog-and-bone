import { Camera, Battery, Monitor, Smartphone } from 'lucide-react'
import { ProfileSelector } from '@/components/organisms/ProfileSelector'

interface DeviceSpec {
  icon: React.ReactNode
  label: string
  value: string
}

const DEVICE_SPECS: DeviceSpec[] = [
  {
    icon: <Monitor size={20} aria-hidden="true" />,
    label: 'Screen',
    value: '6.5" HD+ display',
  },
  {
    icon: <Camera size={20} aria-hidden="true" />,
    label: 'Camera',
    value: '48MP quad camera',
  },
  {
    icon: <Battery size={20} aria-hidden="true" />,
    label: 'Battery',
    value: '5000mAh — all-day life',
  },
  {
    icon: <Smartphone size={20} aria-hidden="true" />,
    label: 'Software',
    value: 'Android 12 (configured by us)',
  },
]

export function StorePage() {
  return (
    <main>
      {/* Page header */}
      <section className="bg-[#FFF8E7] py-16 border-b-2 border-[#F5EDD8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2C1503] mb-4">
            Choose Your Phone
          </h1>
          <p className="text-lg text-[#5A4A3A] max-w-2xl mx-auto leading-relaxed">
            Every Dog and Bone phone is a reliable Android device hand-configured by our team before
            it ships to you. Currently using Samsung Galaxy A12 (subject to availability).
          </p>
        </div>
      </section>

      {/* Profile selector */}
      <section className="bg-white py-20" aria-labelledby="store-profiles-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            id="store-profiles-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[#2C1503] mb-10 text-center"
          >
            Pick the setup that suits you
          </h2>
          <ProfileSelector />
        </div>
      </section>

      {/* Device specs */}
      <section
        className="bg-[#FFF8E7] py-16 border-t-2 border-[#F5EDD8]"
        aria-labelledby="specs-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2
            id="specs-heading"
            className="text-2xl sm:text-3xl font-extrabold text-[#2C1503] mb-4 text-center"
          >
            The hardware
          </h2>
          <p className="text-center text-[#5A4A3A] mb-10 max-w-lg mx-auto">
            A solid, affordable Android device with excellent battery life and everything you need.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {DEVICE_SPECS.map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border-2 border-[#2C1503] p-6 shadow-[3px_3px_0px_#2C1503] flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFB703] border-2 border-[#2C1503] flex items-center justify-center text-[#2C1503]">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5A4A3A] mb-0.5">
                    {label}
                  </p>
                  <p className="font-extrabold text-[#2C1503]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
