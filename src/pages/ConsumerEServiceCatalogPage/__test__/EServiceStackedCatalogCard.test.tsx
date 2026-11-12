import React from 'react'
import { screen } from '@testing-library/react'
import type { CatalogQueryTemplateInstancesGroup } from '@/api/api.generatedTypes'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import { EServiceStackedCatalogCard } from '../components/EServiceStackedCatalogCard'

mockUseJwt()

const templateInstancesGroup: CatalogQueryTemplateInstancesGroup = {
  resultType: 'template',
  id: 'template-id',
  name: 'Template group',
  description: 'Template group description',
  numInstances: 2,
}

const renderCard = (disabled: boolean, prefetchFn = vi.fn()) =>
  renderWithApplicationContext(
    <EServiceStackedCatalogCard
      templateInstancesGroup={templateInstancesGroup}
      disabled={disabled}
      disabledTooltip="Disabled tooltip"
      prefetchFn={prefetchFn}
    />,
    {
      withRouterContext: true,
      withReactQueryContext: true,
    }
  )

describe('EServiceStackedCatalogCard', () => {
  it('renders the template group details and inspect action', () => {
    renderCard(false)

    expect(screen.getByRole('heading', { name: templateInstancesGroup.name })).toBeInTheDocument()
    expect(screen.getByText(templateInstancesGroup.description)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'list.inspectCollection' })).toBeInTheDocument()
  })

  it('navigates to the template instances group when the inspect action is clicked', async () => {
    const user = userEvent.setup()
    const { history } = renderCard(false)

    await user.click(screen.getByRole('link', { name: 'list.inspectCollection' }))

    expect(history.location.pathname).toBe(`/it/catalogo-e-service/${templateInstancesGroup.id}`)
  })

  it('renders a disabled tooltip wrapper when disabled', () => {
    renderCard(true)

    const disabledTooltipWrapper = screen.getByRole('button', { name: 'Disabled tooltip' })

    expect(disabledTooltipWrapper).toHaveAttribute('aria-disabled', 'true')
  })

  it('does not render the disabled tooltip wrapper when enabled', () => {
    renderCard(false)

    expect(screen.queryByRole('button', { name: 'Disabled tooltip' })).not.toBeInTheDocument()
  })

  it('prefetches the template group when the inspect action receives keyboard focus', async () => {
    const user = userEvent.setup()
    const prefetchFn = vi.fn()
    renderCard(false, prefetchFn)

    await user.tab()

    expect(prefetchFn).toHaveBeenCalledOnce()
  })
})
