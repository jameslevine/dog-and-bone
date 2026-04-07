import { describe, it, expect, beforeEach } from 'vitest'
import { useCustomizationStore } from './customizationStore'

describe('useCustomizationStore', () => {
  beforeEach(() => {
    useCustomizationStore.setState({
      profileId: null,
      selectedAppIds: [],
      customAppsRequest: '',
    })
  })

  it('starts with null profileId and empty selections', () => {
    const { profileId, selectedAppIds, customAppsRequest } = useCustomizationStore.getState()
    expect(profileId).toBeNull()
    expect(selectedAppIds).toEqual([])
    expect(customAppsRequest).toBe('')
  })

  it('setProfile sets profileId and pre-populates apps from profile defaults', () => {
    useCustomizationStore.getState().setProfile('essential')
    const { profileId, selectedAppIds } = useCustomizationStore.getState()
    expect(profileId).toBe('essential')
    expect(selectedAppIds.length).toBeGreaterThan(0)
    // Essential profile includes phone
    expect(selectedAppIds).toContain('phone')
  })

  it('setProfile with an unknown id leaves selectedAppIds empty', () => {
    // @ts-expect-error — testing invalid input
    useCustomizationStore.getState().setProfile('nonexistent')
    const { selectedAppIds } = useCustomizationStore.getState()
    expect(selectedAppIds).toEqual([])
  })

  it('toggleApp adds an app that is not selected', () => {
    useCustomizationStore.setState({ selectedAppIds: [] })
    useCustomizationStore.getState().toggleApp('camera')
    expect(useCustomizationStore.getState().selectedAppIds).toContain('camera')
  })

  it('toggleApp removes an app that is already selected', () => {
    useCustomizationStore.setState({ selectedAppIds: ['camera', 'phone'] })
    useCustomizationStore.getState().toggleApp('camera')
    expect(useCustomizationStore.getState().selectedAppIds).not.toContain('camera')
    expect(useCustomizationStore.getState().selectedAppIds).toContain('phone')
  })

  it('setSelectedApps replaces all selected apps', () => {
    useCustomizationStore.setState({ selectedAppIds: ['phone'] })
    useCustomizationStore.getState().setSelectedApps(['camera', 'sms'])
    expect(useCustomizationStore.getState().selectedAppIds).toEqual(['camera', 'sms'])
  })

  it('setCustomAppsRequest stores the custom text', () => {
    useCustomizationStore.getState().setCustomAppsRequest('I want Spotify')
    expect(useCustomizationStore.getState().customAppsRequest).toBe('I want Spotify')
  })

  it('reset clears all state', () => {
    useCustomizationStore.getState().setProfile('balance')
    useCustomizationStore.getState().setCustomAppsRequest('some text')
    useCustomizationStore.getState().reset()
    const { profileId, selectedAppIds, customAppsRequest } = useCustomizationStore.getState()
    expect(profileId).toBeNull()
    expect(selectedAppIds).toEqual([])
    expect(customAppsRequest).toBe('')
  })

  it('serialiseApps returns a comma-separated string of selected app ids', () => {
    useCustomizationStore.setState({ selectedAppIds: ['phone', 'camera', 'sms'] })
    const result = useCustomizationStore.getState().serialiseApps()
    expect(result).toBe('phone,camera,sms')
  })

  it('serialiseApps returns an empty string when no apps are selected', () => {
    useCustomizationStore.setState({ selectedAppIds: [] })
    const result = useCustomizationStore.getState().serialiseApps()
    expect(result).toBe('')
  })
})
