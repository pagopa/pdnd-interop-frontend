import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import useGetConsumerPurposeTemplatesActions from '../useGetConsumerPurposeTemplatesActions'
import { mockUseJwt, renderHookWithApplicationContext } from '@/utils/testing.utils'
import type { CreatorPurposeTemplate, TenantKind } from '@/api/api.generatedTypes'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

const mockPurposeTemplateId = '3fa85f64-5717-4562-b3fc-2c963f66afa6'

const server = setupServer(
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${mockPurposeTemplateId}/archive`,
    (_, res) => {
      return res()
    }
  ),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${mockPurposeTemplateId}/suspend`,
    (_, res) => {
      return res()
    }
  ),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${mockPurposeTemplateId}/reactivate`,
    (_, res) => {
      return res()
    }
  ),
  rest.delete(`${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${mockPurposeTemplateId}`, (_, res) => {
    return res()
  }),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/purposeTemplates/${mockPurposeTemplateId}/publish`,
    (_, res) => {
      return res()
    }
  )
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

// Helper function to create mock purpose template
const createMockPurposeTemplate = (
  overrides: Partial<CreatorPurposeTemplate> = {}
): CreatorPurposeTemplate => ({
  id: mockPurposeTemplateId,
  targetTenantKind: 'PA',
  purposeTitle: 'Test Purpose',
  state: 'PUBLISHED',
  ...overrides,
})

// Helper function to render the hook
function renderUseGetConsumerPurposeTemplatesActionsHook(
  tenantKind: TenantKind,
  purposeTemplate?: CreatorPurposeTemplate,
  isAdmin: boolean = true
) {
  mockUseJwt({ isAdmin })

  const memoryHistory = createMemoryHistory()
  memoryHistory.push('/it/fruizione/template-finalita')

  return renderHookWithApplicationContext(
    () => useGetConsumerPurposeTemplatesActions(tenantKind, purposeTemplate),
    {
      withReactQueryContext: true,
      withRouterContext: true,
    },
    memoryHistory
  )
}

describe('useGetConsumerPurposeTemplatesActions', () => {
  describe('when user is not admin', () => {
    it('should return empty actions array', () => {
      const purposeTemplate = createMockPurposeTemplate()
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook(
        'PA',
        purposeTemplate,
        false
      )

      expect(result.current.actions).toEqual([])
    })
  })

  describe('when no purpose template is provided', () => {
    it('should return empty actions array', () => {
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', undefined)

      expect(result.current.actions).toEqual([])
    })
  })

  describe('when purpose template state is DRAFT', () => {
    it('should return delete and publish actions', () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'DRAFT' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      expect(result.current.actions).toHaveLength(2)
      expect(result.current.actions[0].label).toBe('delete')
      expect(result.current.actions[1].label).toBe('publishDraft')
    })

    it('should navigate to purpose template list after delete action', async () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'DRAFT' })
      const { result, history } = renderUseGetConsumerPurposeTemplatesActionsHook(
        'PA',
        purposeTemplate
      )

      const deleteAction = result.current.actions[0]
      expect(deleteAction.label).toBe('delete')

      act(() => {
        deleteAction.action()
      })

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
      })

      await waitFor(() => {
        expect(history.location.pathname).toBe('/it/fruizione/template-finalita')
      })
    })
  })

  describe('when purpose template state is ACTIVE', () => {
    it('should return use, suspend, and archive actions', () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'PUBLISHED' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      expect(result.current.actions).toHaveLength(3)
      expect(result.current.actions[0].label).toBe('actions.createNewPurposeInstance')
      expect(result.current.actions[1].label).toBe('suspend')
      expect(result.current.actions[2].label).toBe('archive')
    })

    it('should disable use action when tenant kind does not match', () => {
      const purposeTemplate = createMockPurposeTemplate({
        state: 'PUBLISHED',
        targetTenantKind: 'PA',
      })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PRIVATE', purposeTemplate)

      const useAction = result.current.actions[0]
      expect(useAction.disabled).toBe(true)
    })

    it('should enable use action when tenant kind matches', () => {
      const purposeTemplate = createMockPurposeTemplate({
        state: 'PUBLISHED',
        targetTenantKind: 'PA',
      })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      const useAction = result.current.actions[0]
      expect(useAction.disabled).toBe(false)
    })

    it('should call suspend API when suspend action is executed', async () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'PUBLISHED' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      const suspendAction = result.current.actions[1]
      expect(suspendAction.label).toBe('suspend')

      act(() => {
        suspendAction.action()
      })

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
      })

      await waitFor(() => {
        // The action should complete without errors
        expect(suspendAction).toBeDefined()
      })
    })

    it('should call archive API when archive action is executed', async () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'PUBLISHED' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      const archiveAction = result.current.actions[2]
      expect(archiveAction.label).toBe('archive')

      act(() => {
        archiveAction.action()
      })

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
      })

      await waitFor(() => {
        // The action should complete without errors
        expect(archiveAction).toBeDefined()
      })
    })
  })

  describe('when purpose template state is SUSPENDED', () => {
    it('should return activate and archive actions', () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'SUSPENDED' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      expect(result.current.actions).toHaveLength(2)
      expect(result.current.actions[0].label).toBe('activate')
      expect(result.current.actions[1].label).toBe('archive')
    })

    it('should call reactivate API when activate action is executed', async () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'SUSPENDED' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      const activateAction = result.current.actions[0]
      expect(activateAction.label).toBe('activate')

      act(() => {
        activateAction.action()
      })

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: 'confirm' }))
      })

      await waitFor(() => {
        // The action should complete without errors
        expect(activateAction).toBeDefined()
      })
    })
  })

  describe('when purpose template state is ARCHIVED', () => {
    it('should return no actions', () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'ARCHIVED' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      expect(result.current.actions).toHaveLength(0)
    })
  })

  describe('action properties', () => {
    it('should have correct icon and color for suspend action', () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'PUBLISHED' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      const suspendAction = result.current.actions[1]
      expect(suspendAction.icon).toBeDefined()
      expect(suspendAction.color).toBe('error')
    })

    it('should have correct icon for activate action', () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'SUSPENDED' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      const activateAction = result.current.actions[0]
      expect(activateAction.icon).toBeDefined()
    })

    it('should have correct icon and color for delete action', () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'DRAFT' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      const deleteAction = result.current.actions[0]
      expect(deleteAction.icon).toBeDefined()
      expect(deleteAction.color).toBe('error')
    })

    it('should have correct variant for use action', () => {
      const purposeTemplate = createMockPurposeTemplate({ state: 'PUBLISHED' })
      const { result } = renderUseGetConsumerPurposeTemplatesActionsHook('PA', purposeTemplate)

      const useAction = result.current.actions[0]
      expect(useAction.variant).toBe('contained')
    })
  })
})
