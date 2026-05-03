import { Wifi } from 'lucide-react'
import { Input } from '@/components/atoms/Input'
import { useCustomizationStore } from '@/store/customizationStore'

export function WiFiForm() {
  const { wifiSsid, wifiPassword, setWifiCredentials } = useCustomizationStore()

  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <Wifi size={24} className="text-[#FFB703] mt-1" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#2C1503]">Wi-Fi Pre-configuration (Optional)</h3>
          <p className="text-sm text-[#5A4A3A] mt-1">
            Add your home Wi-Fi details and we'll connect the phone before shipping. Skip this if
            you prefer to set it up yourself.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-[#F5EDD8] rounded-xl p-6 space-y-4">
        <Input
          label="Network Name (SSID)"
          placeholder="e.g. HomeWiFi"
          value={wifiSsid}
          onChange={(e) => setWifiCredentials(e.target.value, wifiPassword)}
          helperText="The name of your Wi-Fi network"
        />
        <Input
          label="Password"
          type="password"
          placeholder="Your Wi-Fi password"
          value={wifiPassword}
          onChange={(e) => setWifiCredentials(wifiSsid, e.target.value)}
          helperText="We'll delete this after setup for security"
        />

        <div className="bg-[#FFF8E7] border-2 border-[#FFB703] rounded-lg p-4 text-xs text-[#5A4A3A] space-y-2">
          <p className="font-semibold text-[#2C1503]">🔒 Security Note:</p>
          <p>
            Your Wi-Fi password is encrypted in transit and deleted immediately after configuration.
            We never store Wi-Fi credentials.
          </p>
        </div>
      </div>
    </section>
  )
}
