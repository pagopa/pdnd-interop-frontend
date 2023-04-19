import React from 'react'
import { render } from '@testing-library/react'
import {
  OperatorGeneralInfoSection,
  OperatorGeneralInfoSectionSkeleton,
} from '../OperatorGeneralInfoSection'
import type { RelationshipInfo } from '@/api/api.generatedTypes'
import { ClientQueries } from '@/api/client'
import { vi } from 'vitest'
import { createMockSelfCareUser } from '__mocks__/data/user.mocks'

const mockUseGetSingleOperator = (result: RelationshipInfo | undefined) => {
  vi.spyOn(ClientQueries, 'useGetSingleOperator').mockReturnValue({
    data: result,
  } as unknown as ReturnType<typeof ClientQueries.useGetSingleOperator>)
}

describe('OperatorGeneralInfoSection', () => {
  it('should match the snapshot', () => {
    mockUseGetSingleOperator(createMockSelfCareUser())
    const { baseElement } = render(<OperatorGeneralInfoSection operatorId="operatorId" />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if the operator data is undefined', () => {
    mockUseGetSingleOperator(undefined)
    const { container } = render(<OperatorGeneralInfoSection operatorId="operatorId" />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('OperatorGeneralInfoSectionSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<OperatorGeneralInfoSectionSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
