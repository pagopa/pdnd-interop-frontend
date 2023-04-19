import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { KeyGeneralInfoSection, KeyGeneralInfoSectionSkeleton } from '../KeyGeneralInfoSection'
import { vi } from 'vitest'
import { ClientQueries } from '@/api/client'
import { createMockPublicKey } from '../../../../../__mocks__/data/key.mocks'
import type { PublicKey } from '@/api/api.generatedTypes'

const mockUseGetSingleKey = (publicKey: PublicKey | undefined) => {
  vi.spyOn(ClientQueries, 'useGetSingleKey').mockReturnValue({
    data: publicKey,
  } as unknown as ReturnType<typeof ClientQueries.useGetSingleKey>)
}

describe('KeyGeneralInfoSection', () => {
  it('should match the snapshot', () => {
    mockUseGetSingleKey(createMockPublicKey())
    const { baseElement } = renderWithApplicationContext(
      <KeyGeneralInfoSection clientId="clientId" kid="kid" />,
      {
        withReactQueryContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if the public key is undefined', () => {
    mockUseGetSingleKey(undefined)
    const { container } = renderWithApplicationContext(
      <KeyGeneralInfoSection clientId="clientId" kid="kid" />,
      {
        withReactQueryContext: true,
      }
    )
    expect(container).toBeEmptyDOMElement()
  })
})

describe('KeyGeneralInfoSectionSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(<KeyGeneralInfoSectionSkeleton />, {
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})
