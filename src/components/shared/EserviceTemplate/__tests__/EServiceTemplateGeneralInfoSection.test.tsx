import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type * as TanStackReactQuery from '@tanstack/react-query'
import type { EServiceTemplateVersionDetails } from '@/api/api.generatedTypes'
import { createMockEServiceTemplateVersionDetails } from '@/../__mocks__/data/eserviceTemplate.mocks'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  mockUseParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import {
  ESERVICE_DESCRIPTION_MAX_LENGTH,
  ESERVICE_TEMPLATE_NAME_MAX_LENGTH,
} from '@/config/constants'
import { EServiceTemplateGeneralInfoSection } from '../EServiceTemplateGeneralInfoSection'

let templateVersion: EServiceTemplateVersionDetails | undefined
const patchMetadata = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof TanStackReactQuery>()),
  useQuery: () => ({ data: templateVersion }),
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: { getSingle: vi.fn() },
  EServiceTemplateMutations: {
    usePatchUpdateEServiceTemplate: () => ({ mutate: patchMetadata }),
    useUpdateEServiceTemplateDescription: () => ({ mutate: vi.fn() }),
    useUpdateEServiceTemplateIntendedTarget: () => ({ mutate: vi.fn() }),
    useUpdateEServiceTemplateName: () => ({ mutate: vi.fn() }),
    useUpdateEServiceTemplatePersonalDataFlagAfterPublication: () => ({ mutate: vi.fn() }),
  },
}))

mockUseParams({
  eServiceTemplateId: 'template-id-001',
  eServiceTemplateVersionId: 'version-id-001',
})
mockUseCurrentRoute({ mode: 'provider' })

const renderSection = (
  props: React.ComponentProps<typeof EServiceTemplateGeneralInfoSection> = {
    readonly: false,
    routeKey: 'PROVIDE_ESERVICE_TEMPLATE_DETAILS',
  }
) =>
  renderWithApplicationContext(<EServiceTemplateGeneralInfoSection {...props} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })

describe('EServiceTemplateGeneralInfoSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt()
    templateVersion = createMockEServiceTemplateVersionDetails()
  })

  it.each([
    ['name'],
    ['description'],
    ['target'],
    ['name', 'description'],
    ['name', 'target'],
    ['description', 'target'],
    ['name', 'description', 'target'],
  ])('PATCHes only changed fields: %j', async (...fields) => {
    const user = userEvent.setup()
    patchMetadata.mockImplementationOnce((_payload: unknown, options: { onSuccess: () => void }) =>
      options.onSuccess()
    )
    renderSection()
    await user.click(screen.getByRole('button', { name: 'actions.edit' }))
    for (const field of fields) {
      const input = screen.getByRole('textbox', {
        name: `updateMetadataDrawer.${field}Field.label`,
      })
      await user.clear(input)
      await user.type(input, `Updated ${field} value`)
    }
    const nameInput = screen.getByRole('textbox', { name: 'updateMetadataDrawer.nameField.label' })
    await user.click(screen.getByRole('button', { name: 'actions.saveEdits' }))

    await waitFor(() =>
      expect(patchMetadata).toHaveBeenCalledWith(
        {
          eServiceTemplateId: templateVersion?.eserviceTemplate.id,
          ...(fields.includes('name') ? { name: 'Updated name value' } : {}),
          ...(fields.includes('description') ? { description: 'Updated description value' } : {}),
          ...(fields.includes('target') ? { intendedTarget: 'Updated target value' } : {}),
        },
        { onSuccess: expect.any(Function) }
      )
    )
    await waitForElementToBeRemoved(nameInput)
  })

  it('closes without PATCHing unchanged metadata', async () => {
    const user = userEvent.setup()
    renderSection()
    await user.click(screen.getByRole('button', { name: 'actions.edit' }))
    const nameInput = screen.getByRole('textbox', { name: 'updateMetadataDrawer.nameField.label' })
    const saveButton = screen.getByRole('button', { name: 'actions.saveEdits' })
    expect(saveButton).toBeEnabled()
    await user.click(saveButton)

    await waitForElementToBeRemoved(nameInput)
    expect(patchMetadata).not.toHaveBeenCalled()
  })

  it('keeps edited values open when the mutation does not succeed', async () => {
    const user = userEvent.setup()
    renderSection()
    await user.click(screen.getByRole('button', { name: 'actions.edit' }))
    const input = screen.getByRole('textbox', { name: 'updateMetadataDrawer.targetField.label' })
    await user.clear(input)
    await user.type(input, 'Updated target value')
    await user.click(screen.getByRole('button', { name: 'actions.saveEdits' }))

    await waitFor(() => expect(patchMetadata).toHaveBeenCalled())
    expect(input).toBeVisible()
    expect(input).toHaveValue('Updated target value')
  })

  it('groups metadata and version information on provider details with a single edit action', () => {
    renderSection()

    expect(screen.getByRole('heading', { name: 'generalInformationTitle' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'nameAndDescription.title' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'versionSection.title' })).toBeVisible()
    expect(screen.getByText('Test Template Name')).toBeVisible()
    expect(screen.getByText('Template description')).toBeVisible()
    expect(screen.getByText('Test intended target')).toBeVisible()
    expect(screen.getByText('Version description')).toBeVisible()
    expect(screen.getAllByRole('button', { name: 'actions.edit' })).toHaveLength(1)
  })

  it('opens the unified metadata drawer with current values and configured limits', async () => {
    const user = userEvent.setup()
    renderSection()
    await user.click(screen.getByRole('button', { name: 'actions.edit' }))

    const nameInput = screen.getByRole('textbox', { name: 'updateMetadataDrawer.nameField.label' })
    const descriptionInput = screen.getByRole('textbox', {
      name: 'updateMetadataDrawer.descriptionField.label',
    })
    const targetInput = screen.getByRole('textbox', {
      name: 'updateMetadataDrawer.targetField.label',
    })
    expect(nameInput).toHaveValue('Test Template Name')
    expect(nameInput).toHaveAttribute('maxlength', String(ESERVICE_TEMPLATE_NAME_MAX_LENGTH))
    expect(descriptionInput).toHaveValue('Template description')
    expect(descriptionInput).toHaveAttribute('maxlength', String(ESERVICE_DESCRIPTION_MAX_LENGTH))
    expect(targetInput).toHaveValue('Test intended target')
    expect(targetInput).toHaveAttribute('maxlength', '250')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('textbox')).not.toBeInTheDocument())
  })

  it('hides the provider edit action when readonly without hiding metadata', () => {
    mockUseJwt({ isAdmin: false, isViewer: true })
    renderSection({ readonly: true, routeKey: 'PROVIDE_ESERVICE_TEMPLATE_DETAILS' })

    expect(screen.queryByRole('button', { name: 'actions.edit' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'nameAndDescription.title' })).toBeVisible()
    expect(screen.getByText('Test Template Name')).toBeVisible()
  })

  it.each([true, false])(
    'uses the same catalog layout without editing when readonly is %s',
    (readonly) => {
      renderSection({ readonly, routeKey: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS' })

      expect(screen.getByRole('heading', { name: 'generalInformationTitle' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'nameAndDescription.title' })).toBeVisible()
      expect(screen.getByRole('heading', { name: 'versionSection.title' })).toBeVisible()
      expect(screen.getByText('Test Template Name')).toBeVisible()
      expect(screen.getByText('Template description')).toBeVisible()
      expect(screen.getByText('Test intended target')).toBeVisible()
      expect(screen.getByText('Version description')).toBeVisible()
      expect(screen.queryByRole('button', { name: 'actions.edit' })).not.toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    }
  )

  it('does not expose metadata editing before template data is available', () => {
    templateVersion = undefined
    renderSection()

    expect(screen.queryByRole('button', { name: 'actions.edit' })).not.toBeInTheDocument()
  })
})
