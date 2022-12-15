import { createMockEServiceProvider } from '@/__mocks__/data/eservice.mocks'
import useGetProviderEServiceTableActions from '../useGetProviderEServiceTableActions'
import { renderHookWithApplicationContext } from '@/__mocks__/mock.utils'

function renderUseGetProviderEServiceTableActionsHook(
  ...hookParams: Parameters<typeof useGetProviderEServiceTableActions>
) {
  return renderHookWithApplicationContext(
    () => useGetProviderEServiceTableActions(...(hookParams ?? [])),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('useGetProviderEServiceTableActions tests', () => {
  it('should return the correct actions if the e-service has no descriptors', () => {
    const descriptorMock = createMockEServiceProvider()
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('delete')
  })

  it('should return the correct actions if the e-service has an active descriptor in PUBLISHED state and has no version draft', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('suspend')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('createNewDraft')
  })

  it('should return the correct actions if the e-service has an active descriptor in PUBLISHED state and has a version draft', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'PUBLISHED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('suspend')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('editDraft')
  })

  it('should return no actions if the e-service has an active descriptor in ARCHIVED state', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'ARCHIVED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(0)
  })

  it('should return the correct actions if the e-service has an active descriptor in DEPRECATED state', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'DEPRECATED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(1)
    expect(result.current.actions[0].label).toBe('suspend')
  })

  it('should return the correct actions if the e-service has no active descriptor', () => {
    const descriptorMock = createMockEServiceProvider({
      draftDescriptor: { id: 'test-1', state: 'DRAFT', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(2)
    expect(result.current.actions[0].label).toBe('publish')
    expect(result.current.actions[1].label).toBe('delete')
  })

  it('should return the correct actions if the e-service has an active descriptor in SUSPENDED state and has no version draft', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('createNewDraft')
  })

  it('should return the correct actions if the e-service has an active descriptor in SUSPENDED state and has a version draft', () => {
    const descriptorMock = createMockEServiceProvider({
      activeDescriptor: { id: 'test-1', state: 'SUSPENDED', version: '1' },
      draftDescriptor: { id: 'test-2', state: 'DRAFT', version: '2' },
    })
    const { result } = renderUseGetProviderEServiceTableActionsHook(descriptorMock)
    expect(result.current.actions).toHaveLength(3)
    expect(result.current.actions[0].label).toBe('activate')
    expect(result.current.actions[1].label).toBe('clone')
    expect(result.current.actions[2].label).toBe('editDraft')
  })
})
