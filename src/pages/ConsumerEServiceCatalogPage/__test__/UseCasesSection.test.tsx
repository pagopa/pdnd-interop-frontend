import React from 'react'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CatalogUseCase } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import UseCasesSection from '../components/UseCasesSection'

const createUseCases = (count: number): CatalogUseCase[] =>
  Array.from({ length: count }, (_, index) => ({
    name: `Use case ${index + 1}`,
    description: `Description ${index + 1}`,
    slug: `/use-cases/${index + 1}`,
    fieldId: 'CITIZEN_SERVICES',
    subscribedEservices: [],
    unsubscribedEservices: [],
  }))

describe('UseCasesSection', () => {
  it('shows four use cases per page and changes pages', async () => {
    const user = userEvent.setup()
    const useCases = createUseCases(6)

    renderWithApplicationContext(<UseCasesSection useCases={useCases} />, {})

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
    useCases.slice(0, 4).forEach(({ name }) => {
      expect(screen.getAllByText(name)).toHaveLength(2)
    })
    expect(screen.queryAllByText('Use case 5')).toHaveLength(0)
    expect(screen.getByRole('navigation')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go to page 2' }))

    expect(screen.queryAllByText('Use case 1')).toHaveLength(0)
    useCases.slice(4).forEach(({ name }) => {
      expect(screen.getAllByText(name)).toHaveLength(2)
    })
  })

  it('opens the selected use case drawer', async () => {
    const user = userEvent.setup()
    const [useCase] = createUseCases(1)

    renderWithApplicationContext(<UseCasesSection useCases={[useCase]} />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'buttonLabel' }))

    expect(screen.getByRole('link', { name: 'readButtonAriaLabel' })).toHaveAttribute(
      'href',
      useCase.slug
    )
  })
})
