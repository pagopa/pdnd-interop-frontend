import userEvent from '@testing-library/user-event'
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockPurposeTemplate } from '../../../../../__mocks__/data/purposeTemplate.mocks'
import { PurposeTemplateGeneralInfoSection } from '../PurposeTemplateDetailsTab/PurposeTemplateGeneralnfoSection'

mockUseJwt()

const patchMetadata = vi.fn()
vi.mock('@/api/purposeTemplate/purposeTemplate.mutations', () => ({
  PurposeTemplateMutations: {
    usePatchUpdatePurposeTemplate: () => ({ mutate: patchMetadata }),
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: (namespace?: string, options?: { keyPrefix?: string }) => ({
    t: (key: string) => [namespace, options?.keyPrefix, key].filter(Boolean).join('.'),
  }),
}))

const purposeTemplate = createMockPurposeTemplate()
const renderSection = (
  routeKey: 'SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS' | 'SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS',
  isAdmin = true
) => {
  mockUseCurrentRoute({ routeKey })
  mockUseJwt({ isAdmin })
  return renderWithApplicationContext(
    <PurposeTemplateGeneralInfoSection purposeTemplate={purposeTemplate} />,
    { withReactQueryContext: true }
  )
}

describe('PurposeTemplateGeneralInfoSection', () => {
  beforeEach(() => vi.resetAllMocks())

  it.each([
    ['name'],
    ['description'],
    ['target'],
    ['name', 'description'],
    ['name', 'target'],
    ['description', 'target'],
    ['name', 'description', 'target'],
  ])('submits only changed metadata: %j', async (...fields) => {
    const user = userEvent.setup()
    const view = renderSection('SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS')
    patchMetadata.mockImplementationOnce((_payload: unknown, options: { onSuccess: () => void }) =>
      options.onSuccess()
    )
    await user.click(
      view.getByRole('button', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.nameAndDescription.edit',
      })
    )

    for (const field of fields) {
      const input = view.getByRole('textbox', {
        name: `purposeTemplate.read.detailsTab.sections.generalInformation.updateMetadataDrawer.${field}Field.label`,
      })
      await user.clear(input)
      await user.type(input, `Updated ${field} value`)
    }
    const nameInput = view.getByRole('textbox', {
      name: 'purposeTemplate.read.detailsTab.sections.generalInformation.updateMetadataDrawer.nameField.label',
    })
    await user.click(view.getByRole('button', { name: 'common.actions.saveEdits' }))

    await waitFor(() =>
      expect(patchMetadata).toHaveBeenCalledWith(
        {
          purposeTemplateId: purposeTemplate.id,
          ...(fields.includes('name') ? { purposeTitle: 'Updated name value' } : {}),
          ...(fields.includes('description')
            ? { purposeDescription: 'Updated description value' }
            : {}),
          ...(fields.includes('target') ? { targetDescription: 'Updated target value' } : {}),
        },
        { onSuccess: expect.any(Function) }
      )
    )
    await waitForElementToBeRemoved(nameInput)
  })

  it('closes without submitting unchanged metadata', async () => {
    const user = userEvent.setup()
    const view = renderSection('SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS')
    await user.click(
      view.getByRole('button', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.nameAndDescription.edit',
      })
    )
    const nameInput = view.getByRole('textbox', {
      name: 'purposeTemplate.read.detailsTab.sections.generalInformation.updateMetadataDrawer.nameField.label',
    })
    const saveButton = view.getByRole('button', { name: 'common.actions.saveEdits' })
    expect(saveButton).toBeEnabled()
    await user.click(saveButton)

    await waitForElementToBeRemoved(nameInput)
    expect(patchMetadata).not.toHaveBeenCalled()
  })

  it('keeps edited values open until the mutation succeeds', async () => {
    const user = userEvent.setup()
    const view = renderSection('SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS')
    await user.click(
      view.getByRole('button', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.nameAndDescription.edit',
      })
    )
    const targetInput = view.getByRole('textbox', {
      name: 'purposeTemplate.read.detailsTab.sections.generalInformation.updateMetadataDrawer.targetField.label',
    })
    await user.clear(targetInput)
    await user.type(targetInput, 'Updated target value')
    await user.click(view.getByRole('button', { name: 'common.actions.saveEdits' }))

    await waitFor(() => expect(patchMetadata).toHaveBeenCalled())
    expect(targetInput).toBeVisible()
    expect(targetInput).toHaveValue('Updated target value')
  })

  it('should display template metadata and specifications', () => {
    const view = renderSection('SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG_DETAILS')

    expect(
      view.getByRole('heading', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.title',
      })
    ).toBeInTheDocument()
    expect(view.getByText(purposeTemplate.purposeTitle)).toBeInTheDocument()
    expect(view.getByText(purposeTemplate.purposeDescription)).toBeInTheDocument()
    expect(view.getByText(purposeTemplate.targetDescription)).toBeInTheDocument()
    expect(view.getByText(purposeTemplate.creator.name)).toBeInTheDocument()
    expect(
      view.queryByRole('button', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.nameAndDescription.edit',
      })
    ).not.toBeInTheDocument()
  })

  it('should open the metadata drawer with current values when editable', async () => {
    const user = userEvent.setup()
    const view = renderSection('SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS')

    await user.click(
      view.getByRole('button', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.nameAndDescription.edit',
      })
    )

    expect(
      view.getByText(
        'purposeTemplate.read.detailsTab.sections.generalInformation.updateMetadataDrawer.title'
      )
    ).toBeInTheDocument()
    expect(
      view.getByRole('textbox', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.updateMetadataDrawer.nameField.label',
      })
    ).toHaveValue(purposeTemplate.purposeTitle)
    expect(
      view.getByRole('textbox', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.updateMetadataDrawer.descriptionField.label',
      })
    ).toHaveValue(purposeTemplate.purposeDescription)
    expect(
      view.getByRole('textbox', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.updateMetadataDrawer.targetField.label',
      })
    ).toHaveValue(purposeTemplate.targetDescription)
  })

  it('should not show the edit action to non-admin users on the details route', () => {
    const view = renderSection('SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS', false)

    expect(
      view.queryByRole('button', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.nameAndDescription.edit',
      })
    ).not.toBeInTheDocument()
  })
})
