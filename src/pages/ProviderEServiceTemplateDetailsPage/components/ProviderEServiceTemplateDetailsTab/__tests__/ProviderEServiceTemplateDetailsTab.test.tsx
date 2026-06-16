import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { ProviderEServiceTemplateDetailsTab } from '../ProviderEServiceTemplateDetailsTab'
import {
  mockUseParams,
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'

mockUseJwt()

mockUseParams({
  eServiceTemplateId: 'template-id-001',
  eServiceTemplateVersionId: 'version-id-001',
})

mockUseCurrentRoute({ mode: 'provider' })

vi.mock('@/components/shared/EserviceTemplate', () => ({
  EServiceTemplateGeneralInfoSection: () => <div data-testid="general-info-section" />,
  EServiceTemplateTechnicalInfoSection: () => <div data-testid="technical-info-section" />,
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
