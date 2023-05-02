import React from 'react'
import { ApiInfoSection, ApiInfoSectionSkeleton } from '../ApiInfoSection'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMemoryHistory } from 'history'
import { routes } from '@/router/routes'
import { fireEvent, render } from '@testing-library/react'

const ids = [
  { name: 'eserviceId', id: 'test-eserviceId' },
  { name: 'descriptorId', id: 'test-descriptorId' },
  { name: 'agreementId', id: 'test-agreementId' },
  { name: 'purposeId', id: 'test-purposeId' },
  { name: 'clientId', id: 'test-clientId' },
  { name: 'providerId', id: 'test-providerId' },
  { name: 'consumerId', id: 'test-consumerId' },
]

describe("Checks that Accordion snapshot don't change", () => {
  it('renders correctly', () => {
    const { baseElement } = renderWithApplicationContext(<ApiInfoSection ids={ids} />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should navigate correctly when the link is pressed', () => {
    const history = createMemoryHistory()
    history.push('/it')

    const screen = renderWithApplicationContext(
      <ApiInfoSection ids={ids} />,
      {
        withRouterContext: true,
      },
      history
    )

    const link = screen.getByText('link')

    fireEvent.click(link)

    expect(history.location.pathname).toContain(routes.SUBSCRIBE_INTEROP_M2M.PATH.it)
  })

  it('renders correctly', () => {
    const { baseElement } = render(<ApiInfoSectionSkeleton />)

    expect(baseElement).toBeInTheDocument()
  })
})
