import React from 'react'
import type { Purpose } from '@/api/api.generatedTypes'
import { PurposeQueries } from '@/api/purpose'
import { vi } from 'vitest'
import { ClientVoucherIntructionsPurposeSelect } from '../ClientVoucherIntructionsPurposeSelect'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'

const mockUseGetSinglePurpose = (purpose: Purpose | undefined) => {
  vi.spyOn(PurposeQueries, 'useGetSingle').mockReturnValue({
    data: purpose,
    isLoading: false,
  } as unknown as ReturnType<typeof PurposeQueries.useGetSingle>)
}

describe('ClientVoucherInstructionsPurposeSelect', () => {
  it('should match snapshot', () => {
    const screen = renderWithApplicationContext(
      <ClientVoucherIntructionsPurposeSelect
        selectedPurposeId="purpose-id"
        onChange={vi.fn()}
        purposes={[{ purposeId: 'purpose-id', ...createMockPurpose() }]}
      />,
      {
        withReactQueryContext: true,
      }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with a failure reason', () => {
    mockUseGetSinglePurpose(createMockPurpose({ eservice: { descriptor: { state: 'ARCHIVED' } } }))
    const screen = renderWithApplicationContext(
      <ClientVoucherIntructionsPurposeSelect
        selectedPurposeId="purpose-id"
        onChange={vi.fn()}
        purposes={[
          {
            purposeId: 'purpose-id',
            ...createMockPurpose(),
          },
        ]}
      />,
      {
        withReactQueryContext: true,
      }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})
