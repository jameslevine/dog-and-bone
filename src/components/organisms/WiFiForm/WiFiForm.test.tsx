import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WiFiForm } from './WiFiForm'
import { useCustomizationStore } from '@/store/customizationStore'

describe('WiFiForm', () => {
  it('renders both SSID and password fields', () => {
    render(<WiFiForm />)
    expect(screen.getByLabelText(/Network Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
  })

  it('writes SSID changes into the customization store', () => {
    useCustomizationStore.setState({ wifiSsid: '', wifiPassword: '' })
    render(<WiFiForm />)
    fireEvent.change(screen.getByLabelText(/Network Name/i), { target: { value: 'HomeWiFi' } })
    expect(useCustomizationStore.getState().wifiSsid).toBe('HomeWiFi')
  })

  it('writes password changes into the customization store', () => {
    useCustomizationStore.setState({ wifiSsid: 'HomeWiFi', wifiPassword: '' })
    render(<WiFiForm />)
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'secret123' } })
    expect(useCustomizationStore.getState().wifiPassword).toBe('secret123')
  })
})
