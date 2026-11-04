import userEvent from '@testing-library/user-event'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockPurposeTemplate } from '../../../../../__mocks__/data/purposeTemplate.mocks'
import { PurposeTemplateGeneralInfoSection } from '../PurposeTemplateDetailsTab/PurposeTemplateGeneralnfoSection'

mockUseJwt()

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
        'purposeTemplate.read.detailsTab.sections.generalInformation.purposeTemplateUpdateMetadataDrawer.title'
      )
    ).toBeInTheDocument()
    expect(
      view.getByRole('textbox', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.purposeTemplateUpdateMetadataDrawer.nameField.label',
      })
    ).toHaveValue(purposeTemplate.purposeTitle)
    expect(
      view.getByRole('textbox', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.purposeTemplateUpdateMetadataDrawer.descriptionField.label',
      })
    ).toHaveValue(purposeTemplate.purposeDescription)
    expect(
      view.getByRole('textbox', {
        name: 'purposeTemplate.read.detailsTab.sections.generalInformation.purposeTemplateUpdateMetadataDrawer.targetField.label',
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
