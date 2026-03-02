import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceTemplateDetailsTab } from '../ProviderEServiceTemplateDetailsTab'
import {
  mockUseParams,
  mockUseCurrentRoute,
  renderWithApplicationContext,
} from '@/utils/testing.utils'

mockUseParams({
  eServiceTemplateId: 'template-id-001',
  eServiceTemplateVersionId: 'version-id-001',
})

mockUseCurrentRoute({ mode: 'provider' })

vi.mock('@/components/shared/EserviceTemplate', () => ({
  EServiceTemplateGeneralInfoSection: () => <div data-testid="general-info-section" />,
  EServiceTemplateTechnicalInfoSection: ({ hideThresholds }: { hideThresholds?: boolean }) => (
    <div data-testid="technical-info-section" data-hide-thresholds={hideThresholds} />
  ),
}))

vi.mock('../EServiceTemplateThresholdsAndAttributesSection', () => ({
  EServiceTemplateThresholdsAndAttributesSection: () => (
    <div data-testid="thresholds-and-attributes-section" />
  ),
}))

describe('ProviderEServiceTemplateDetailsTab', () => {
  it('renders all sections', () => {
    renderWithApplicationContext(
      <ProviderEServiceTemplateDetailsTab eserviceTemplateVersionState="PUBLISHED" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByTestId('general-info-section')).toBeInTheDocument()
    expect(screen.getByTestId('technical-info-section')).toBeInTheDocument()
    expect(screen.getByTestId('thresholds-and-attributes-section')).toBeInTheDocument()
  })

  it('passes hideThresholds to EServiceTemplateTechnicalInfoSection', () => {
    renderWithApplicationContext(
      <ProviderEServiceTemplateDetailsTab eserviceTemplateVersionState="PUBLISHED" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const technicalSection = screen.getByTestId('technical-info-section')
    expect(technicalSection).toHaveAttribute('data-hide-thresholds', 'true')
  })

  it('sets readonly to true when state is DEPRECATED', () => {
    renderWithApplicationContext(
      <ProviderEServiceTemplateDetailsTab eserviceTemplateVersionState="DEPRECATED" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByTestId('general-info-section')).toBeInTheDocument()
    expect(screen.getByTestId('thresholds-and-attributes-section')).toBeInTheDocument()
  })
})
