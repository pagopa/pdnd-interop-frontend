import React from 'react'
import { ApiInfoSection, ApiInfoSectionSkeleton } from '../ApiInfoSection'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { render } from '@testing-library/react'

const ids = [
  { name: 'eserviceId', id: 'test-eserviceId' },
  { name: 'descriptorId', id: 'test-descriptorId' },
  { name: 'agreementId', id: 'test-agreementId' },
  { name: 'purposeId', id: 'test-purposeId' },
  { name: 'clientId', id: 'test-clientId' },
  { name: 'providerId', id: 'test-providerId' },
  { name: 'consumerId', id: 'test-consumerId' },
]

describe('ApiInfoSection', () => {
  it('should match snapshot', () => {
    const { baseElement } = renderWithApplicationContext(<ApiInfoSection ids={ids} />, {
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})

describe('ApiInfoSectionSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<ApiInfoSectionSkeleton />)
    expect(baseElement).toBeInTheDocument()
  })
})
