import React from 'react'
import { CatalogCard } from '../CatalogCard'
import { createMockEServiceCatalog } from '@/../__mocks__/data/eservice.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import { AVATAR_BASEPATH } from '@/config/env'

mockUseJwt()

describe('Checks CatalogCard button', () => {
  it('navigate correctly when click on button inspect', async () => {
    const user = userEvent.setup()
    const eserviceMock = createMockEServiceCatalog()
    const { history, ...screen } = renderWithApplicationContext(
      <CatalogCard
        to="SUBSCRIBE_CATALOG_VIEW"
        description={eserviceMock.description}
        producerName={eserviceMock.producer.name}
        prefetchFn={() => {}}
        title={eserviceMock.name}
        avatarURL={`${AVATAR_BASEPATH}/institutions/${eserviceMock.producer.selfcareId}/logo.png`}
        params={{
          eserviceId: eserviceMock.id,
          descriptorId: eserviceMock.activeDescriptor?.id as string,
        }}
      />,
      {
        withRouterContext: true,
        withReactQueryContext: true,
      }
    )
    const inspectLink = screen.getByRole('link', { name: 'actions.inspect' })
    expect(history.location.pathname).toEqual('/')
    await user.click(inspectLink)
    expect(history.location.pathname).toBe(
      `/it/catalogo-e-service/${eserviceMock.id}/${eserviceMock.activeDescriptor?.id}`
    )
  })
})
