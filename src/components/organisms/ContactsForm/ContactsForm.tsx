import { Plus, X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { useCustomizationStore } from '@/store/customizationStore'

interface ContactsFormProps {
  profileId: string
}

export function ContactsForm({ profileId }: ContactsFormProps) {
  const { seniorContacts, setSeniorContacts, familyEmergencyContact, setFamilyEmergencyContact } =
    useCustomizationStore()

  const isSenior = profileId === 'senior'
  const isFamily = profileId === 'family'

  if (!isSenior && !isFamily) return null

  // Senior: Multiple contacts
  if (isSenior) {
    const addContact = () => {
      if (seniorContacts.length < 10) {
        setSeniorContacts([...seniorContacts, { name: '', phone: '' }])
      }
    }

    const removeContact = (index: number) => {
      setSeniorContacts(seniorContacts.filter((_, i) => i !== index))
    }

    const updateContact = (index: number, field: 'name' | 'phone', value: string) => {
      const updated = [...seniorContacts]
      updated[index][field] = value
      setSeniorContacts(updated)
    }

    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#2C1503]">Pre-load Contacts (Optional)</h3>
            <p className="text-sm text-[#5A4A3A] mt-1">
              Add up to 10 contacts we'll pre-load on the phone for easy access.
            </p>
          </div>
          {seniorContacts.length < 10 && (
            <Button type="button" size="sm" variant="secondary" onClick={addContact}>
              <Plus size={16} />
              Add Contact
            </Button>
          )}
        </div>

        {seniorContacts.length === 0 && (
          <div className="bg-[#FFF8E7] border-2 border-[#F5EDD8] rounded-xl p-6 text-center">
            <p className="text-sm text-[#5A4A3A]">
              No contacts added yet. Click "Add Contact" to pre-load contacts on the phone.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {seniorContacts.map((contact, index) => (
            <div
              key={index}
              className="flex gap-3 p-4 bg-white border-2 border-[#F5EDD8] rounded-xl"
            >
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Input
                  label={`Name ${index + 1}`}
                  placeholder="John Smith"
                  value={contact.name}
                  onChange={(e) => updateContact(index, 'name', e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="07700 900000"
                  value={contact.phone}
                  onChange={(e) => updateContact(index, 'phone', e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="mt-6 text-[#E63946] hover:text-[#C62E3A] transition-colors"
                aria-label={`Remove ${contact.name || 'contact'}`}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Family: Single emergency contact
  if (isFamily) {
    const updateEmergencyContact = (field: 'name' | 'phone', value: string) => {
      setFamilyEmergencyContact({
        name: field === 'name' ? value : familyEmergencyContact?.name || '',
        phone: field === 'phone' ? value : familyEmergencyContact?.phone || '',
      })
    }

    return (
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#2C1503]">Emergency Contact (Optional)</h3>
          <p className="text-sm text-[#5A4A3A] mt-1">
            Add an emergency contact that will be pre-loaded in the phonebook.
          </p>
        </div>

        <div className="p-4 bg-white border-2 border-[#F5EDD8] rounded-xl">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Name"
              placeholder="Mum"
              value={familyEmergencyContact?.name || ''}
              onChange={(e) => updateEmergencyContact('name', e.target.value)}
            />
            <Input
              label="Phone Number"
              placeholder="07700 900000"
              value={familyEmergencyContact?.phone || ''}
              onChange={(e) => updateEmergencyContact('phone', e.target.value)}
            />
          </div>
          <p className="text-xs text-[#5A4A3A] mt-3">
            This contact will be added to the phone's contacts app for quick access.
          </p>
        </div>
      </section>
    )
  }

  return null
}
