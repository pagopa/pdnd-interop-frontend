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
  EServiceTemplateGeneralInfoSection: ({ readonly }: { readonly: boolean }) => (
    <div data-testid="general-info-section" data-readonly={String(readonly)} />
  ),
  EServiceTemplateTechnicalInfoSection: ({ readonly }: { readonly: boolean }) => (
    <div data-testid="technical-info-section" data-readonly={String(readonly)} />
  ),
}))

vi.mock('../EServiceTemplateThresholdsAndAttributesSection', () => ({
  EServiceTemplateThresholdsAndAttributesSection: ({ readonly }: { readonly: boolean }) => (
    <div data-testid="thresholds-and-attributes-section" data-readonly={String(readonly)} />
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

    expect(screen.getByTestId('general-info-section')).toHaveAttribute('data-readonly', 'true')
    expect(screen.getByTestId('thresholds-and-attributes-section')).toHaveAttribute(
      'data-readonly',
      'true'
    )
  })

  it('sets readonly to false for admin users on a non-deprecated version', () => {
    renderWithApplicationContext(
      <ProviderEServiceTemplateDetailsTab eserviceTemplateVersionState="PUBLISHED" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByTestId('general-info-section')).toHaveAttribute('data-readonly', 'false')
    expect(screen.getByTestId('technical-info-section')).toHaveAttribute('data-readonly', 'false')
    expect(screen.getByTestId('thresholds-and-attributes-section')).toHaveAttribute(
      'data-readonly',
      'false'
    )
  })

  it('sets readonly to true for viewer users even on a non-deprecated version', () => {
    mockUseJwt({ isAdmin: false, isViewer: true })
    renderWithApplicationContext(
      <ProviderEServiceTemplateDetailsTab eserviceTemplateVersionState="PUBLISHED" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(screen.getByTestId('general-info-section')).toHaveAttribute('data-readonly', 'true')
    expect(screen.getByTestId('technical-info-section')).toHaveAttribute('data-readonly', 'true')
    expect(screen.getByTestId('thresholds-and-attributes-section')).toHaveAttribute(
      'data-readonly',
      'true'
    )
  })
})
