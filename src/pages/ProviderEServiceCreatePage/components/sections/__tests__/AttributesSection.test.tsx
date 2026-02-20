import React from 'react'
import { screen } from '@testing-library/react'
import { AttributesSection } from '../AttributesSection'
import { vi, describe, it, expect } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'

let lastRenderedProps: Record<string, Record<string, unknown>> = {}

vi.mock('@/components/shared/AddAttributesToForm', () => ({
  AddAttributesToForm: (props: Record<string, unknown>) => {
    const key = String(props.attributeKey)
    lastRenderedProps[key] = props
    return (
      <div data-testid={`add-attributes-form-${key}`}>
        {`attributeKey=${key}`}
        {` readOnly=${String(props.readOnly)}`}
        {props.withThreshold ? ' withThreshold' : ''}
        {props.openCreateAttributeDrawer ? ' hasOpenCreateAttributeDrawer' : ''}
      </div>
    )
  },
}))

const renderComponent = (isEServiceCreatedFromTemplate = false) => {
  lastRenderedProps = {}
  const handleOpenAttributeCreateDrawerFactory = vi.fn(() => vi.fn())

  return {
    handleOpenAttributeCreateDrawerFactory,
    ...renderWithApplicationContext(
      <AttributesSection
        isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate}
        handleOpenAttributeCreateDrawerFactory={handleOpenAttributeCreateDrawerFactory}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    ),
  }
}

describe('AttributesSection', () => {
  it('should render the title', () => {
    renderComponent()
    expect(screen.getByText('step3.attributesTitle')).toBeInTheDocument()
  })

  it('should render 3 tabs (certified, verified, declared)', () => {
    renderComponent()
    expect(screen.getByText('step2.attributes.tabs.certified')).toBeInTheDocument()
    expect(screen.getByText('step2.attributes.tabs.verified')).toBeInTheDocument()
    expect(screen.getByText('step2.attributes.tabs.declared')).toBeInTheDocument()
  })

  it('should show the certified tab content by default', () => {
    renderComponent()
    const certifiedForm = screen.getByTestId('add-attributes-form-certified')
    expect(certifiedForm).toBeVisible()
  })

  it('should render AddAttributesToForm with attributeKey="certified" in the active tab', () => {
    renderComponent()
    expect(screen.getByText('attributeKey=certified', { exact: false })).toBeInTheDocument()
  })

  it('should pass readOnly={true} when isEServiceCreatedFromTemplate is true', () => {
    renderComponent(true)
    const certifiedForm = screen.getByTestId('add-attributes-form-certified')
    expect(certifiedForm.textContent).toContain('readOnly=true')
  })

  it('should pass readOnly={false} when isEServiceCreatedFromTemplate is false', () => {
    renderComponent(false)
    const certifiedForm = screen.getByTestId('add-attributes-form-certified')
    expect(certifiedForm.textContent).toContain('readOnly=false')
  })

  it('should show withThreshold for certified', () => {
    renderComponent()
    expect(lastRenderedProps['certified']?.withThreshold).toBe(true)
  })

  it('should not pass openCreateAttributeDrawer to certified', () => {
    renderComponent()
    // Certified is the active tab, so lastRenderedProps captures its props
    expect(lastRenderedProps['certified']?.openCreateAttributeDrawer).toBeUndefined()
  })

  it('should call handleOpenAttributeCreateDrawerFactory for verified and declared', () => {
    const { handleOpenAttributeCreateDrawerFactory } = renderComponent()

    // The factory is called during render to generate props for verified and declared
    expect(handleOpenAttributeCreateDrawerFactory).toHaveBeenCalledWith('verified')
    expect(handleOpenAttributeCreateDrawerFactory).toHaveBeenCalledWith('declared')
    // Should NOT be called with 'certified'
    expect(handleOpenAttributeCreateDrawerFactory).not.toHaveBeenCalledWith('certified')
  })
})
