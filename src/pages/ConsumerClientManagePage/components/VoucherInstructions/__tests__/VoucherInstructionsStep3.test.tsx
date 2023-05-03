import React from 'react'
import type { VoucherInstructionsStepProps } from '@/pages/ConsumerClientManagePage/types/voucher-instructions.types'
import { mockUseClientKind, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPublicKey } from '__mocks__/data/key.mocks'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import { VoucherInstructionsStep3 } from '../VoucherInstructionsStep3'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'

const commonProps: VoucherInstructionsStepProps = {
  clientId: 'test-client-id',
  clientKeys: {
    keys: [
      createMockPublicKey({ keyId: '1', name: 'key1' }),
      createMockPublicKey({ keyId: '2', name: 'key2' }),
    ],
  },
  purpose: createMockPurpose(),
  purposeId: 'test-purpose-id',
  forward: vi.fn(),
  back: vi.fn(),
}

const mockUseGetDescriptorCatalog = (descriptor?: CatalogEServiceDescriptor, isLoading = false) => {
  vi.spyOn(EServiceQueries, 'useGetDescriptorCatalog').mockReturnValue({
    data: descriptor,
    isLoading,
  } as unknown as ReturnType<typeof EServiceQueries.useGetDescriptorCatalog>)
}

describe('VoucherInstructionsStep3', () => {
  it('should match snapshot (API)', () => {
    mockUseClientKind('API')
    const screen = renderWithApplicationContext(<VoucherInstructionsStep3 {...commonProps} />, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot (CONSUMER)', () => {
    mockUseClientKind('CONSUMER')
    mockUseGetDescriptorCatalog(createMockEServiceDescriptorCatalog())
    const screen = renderWithApplicationContext(<VoucherInstructionsStep3 {...commonProps} />, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot (CONSUMER) while loading descriptor', () => {
    mockUseClientKind('CONSUMER')
    mockUseGetDescriptorCatalog(undefined, true)
    const screen = renderWithApplicationContext(<VoucherInstructionsStep3 {...commonProps} />, {
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })
})
