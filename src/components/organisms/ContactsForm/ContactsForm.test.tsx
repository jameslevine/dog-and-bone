import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactsForm } from './ContactsForm'
import { useCustomizationStore } from '@/store/customizationStore'

describe('ContactsForm', () => {
  beforeEach(() => {
    useCustomizationStore.setState({
      seniorContacts: [],
      familyEmergencyContact: null,
    })
  })

  it('renders nothing for non-senior, non-family profiles', () => {
    const { container } = render(<ContactsForm profileId="essential" />)
    expect(container).toBeEmptyDOMElement()
  })

  describe('senior profile', () => {
    it('shows the empty-state prompt when no contacts have been added', () => {
      render(<ContactsForm profileId="senior" />)
      expect(screen.getByText(/No contacts added yet/i)).toBeInTheDocument()
    })

    it('adds a new contact row when Add Contact is clicked', () => {
      render(<ContactsForm profileId="senior" />)
      fireEvent.click(screen.getByRole('button', { name: /Add Contact/i }))
      expect(useCustomizationStore.getState().seniorContacts).toHaveLength(1)
    })

    it('writes contact edits back to the store', () => {
      useCustomizationStore.setState({ seniorContacts: [{ name: '', phone: '' }] })
      render(<ContactsForm profileId="senior" />)
      fireEvent.change(screen.getByLabelText(/Name 1/i), { target: { value: 'Jane' } })
      expect(useCustomizationStore.getState().seniorContacts[0].name).toBe('Jane')
    })

    it('removes a contact when the X button is clicked', () => {
      useCustomizationStore.setState({
        seniorContacts: [{ name: 'Jane', phone: '07700900000' }],
      })
      render(<ContactsForm profileId="senior" />)
      fireEvent.click(screen.getByRole('button', { name: /Remove Jane/i }))
      expect(useCustomizationStore.getState().seniorContacts).toHaveLength(0)
    })
  })

  describe('family profile', () => {
    it('renders the emergency contact fields', () => {
      render(<ContactsForm profileId="family" />)
      expect(screen.getByLabelText(/Contact Name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()
    })

    it('writes emergency contact edits to the store', () => {
      render(<ContactsForm profileId="family" />)
      fireEvent.change(screen.getByLabelText(/Contact Name/i), { target: { value: 'Mum' } })
      expect(useCustomizationStore.getState().familyEmergencyContact?.name).toBe('Mum')
    })
  })
})
