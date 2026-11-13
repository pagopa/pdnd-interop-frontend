import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CatalogUseCase } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import UseCaseCard from '../components/UseCaseCard'

const useCase: CatalogUseCase = {
  name: 'Citizen services',
  description: 'Services for citizens',
  slug: '/use-cases/citizens',
  fieldId: 'CITIZEN_SERVICES',
  subscribedEservices: [],
  unsubscribedEservices: [],
}

describe('UseCaseCard', () => {
  it('renders the use case details and opens it when selected', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderWithApplicationContext(<UseCaseCard useCase={useCase} onClick={onClick} />, {})

    expect(screen.getAllByText(useCase.name)).toHaveLength(2)
    expect(screen.getByText('field.CITIZEN_SERVICES')).toBeInTheDocument()
    expect(screen.getByText('ESERVICESCHIPLABEL')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'buttonLabel' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
