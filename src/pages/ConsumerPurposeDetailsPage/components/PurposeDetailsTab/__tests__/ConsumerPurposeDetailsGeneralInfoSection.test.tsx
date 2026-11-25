import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ConsumerPurposeDetailsGeneralInfoSection } from '../ConsumerPurposeDetailsGeneralInfoSection'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

mockUseJwt()

const renderSection = (producer: Parameters<typeof createMockPurpose>[0]) =>
  renderWithApplicationContext(
    <ConsumerPurposeDetailsGeneralInfoSection purpose={createMockPurpose(producer)} />,
    { withReactQueryContext: true, withRouterContext: true }
  )

describe('ConsumerPurposeDetailsGeneralInfoSection producer field', () => {
  it('shows only the producer name when it has no parent tenants', () => {
    renderSection({ eservice: { producer: { name: 'Comune di Torino' } } })

    expect(screen.getByText('Comune di Torino')).toBeInTheDocument()
  })

  it('shows the producer hierarchy from the sub-unit up to the root tenant', () => {
    renderSection({
      eservice: {
        producer: {
          name: 'Ufficio permessi ZTL',
          subUnitType: 'UO',
          parentTenants: [
            { id: 'aoo-id', name: 'Direzione Mobilità', subUnitType: 'AOO' },
            { id: 'comune-id', name: 'Comune di Milano' },
          ],
        },
      },
    })

    expect(
      screen.getByText('Ufficio permessi ZTL - Direzione Mobilità - Comune di Milano')
    ).toBeInTheDocument()
  })
})
