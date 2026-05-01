import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CustomizePage } from './CustomizePage'
import { useCartStore } from '@/store/cartStore'
import { useCustomizationStore } from '@/store/customizationStore'

describe('CustomizePage', () => {
  beforeEach(() => {
    useCartStore.setState({ itemCount: 1, profileId: 'essential' })
    useCustomizationStore.setState({
      profileId: 'essential',
      selectedAppIds: ['phone', 'sms', 'camera', 'gmaps', 'calculator', 'alarm', 'clock'],
      customAppsRequest: '',
    })
  })

  it('renders the page heading when a profile is selected', () => {
    render(
      <MemoryRouter>
        <CustomizePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Customise Your Phone')).toBeInTheDocument()
  })

  it('renders the step indicator', () => {
    render(
      <MemoryRouter>
        <CustomizePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('navigation', { name: 'Order progress' })).toBeInTheDocument()
  })

  it('renders null and redirects when no profile is selected', () => {
    useCartStore.setState({ itemCount: 0, profileId: null })
    const { container } = render(
      <MemoryRouter>
        <CustomizePage />
      </MemoryRouter>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('syncs customization store when cart profile differs', () => {
    // Cart has 'family' but customization has 'essential'
    useCartStore.setState({ itemCount: 1, profileId: 'family' })
    useCustomizationStore.setState({
      profileId: 'essential',
      selectedAppIds: [],
      customAppsRequest: '',
    })
    render(
      <MemoryRouter>
        <CustomizePage />
      </MemoryRouter>,
    )
    // After render, customization store should keep existing profile (not overwrite)
    // This allows users to switch profiles using preset buttons
    expect(useCustomizationStore.getState().profileId).toBe('essential')
  })

  it('initializes customization store when profileId is null', () => {
    useCartStore.setState({ itemCount: 1, profileId: 'senior' })
    useCustomizationStore.setState({
      profileId: null,
      selectedAppIds: [],
      customAppsRequest: '',
    })
    render(
      <MemoryRouter>
        <CustomizePage />
      </MemoryRouter>,
    )
    // When customProfileId is null, it should sync from cart
    expect(useCustomizationStore.getState().profileId).toBe('senior')
  })

  it('renders the AppSelectionForm', () => {
    render(
      <MemoryRouter>
        <CustomizePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /Continue to Review/i })).toBeInTheDocument()
  })
})
