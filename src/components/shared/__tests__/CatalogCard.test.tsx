import React from 'react'
import { CatalogCard } from '../CatalogCard'
import { createMockCatalogEServiceTemplate } from '@/../__mocks__/data/eserviceTemplate.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import { AVATAR_BASEPATH } from '@/config/env'

mockUseJwt()

describe('Checks CatalogCard button', () => {
  it('navigate correctly when click on button inspect', async () => {
    const user = userEvent.setup()
    const eserviceTemplateMock = createMockCatalogEServiceTemplate()
    const { history, ...screen } = renderWithApplicationContext(
      <CatalogCard
        to="SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS"
        description={eserviceTemplateMock.description}
        producerName={eserviceTemplateMock.creator.name}
        prefetchFn={() => {}}
        title={eserviceTemplateMock.name}
        avatarURL={`${AVATAR_BASEPATH}/institutions/${eserviceTemplateMock.creator.selfcareId}/logo.png`}
        params={{
          eServiceTemplateId: eserviceTemplateMock.id,
          eServiceTemplateVersionId: eserviceTemplateMock.publishedVersion.id as string,
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
      `/it/erogazione/catalogo-template/${eserviceTemplateMock.id}/${eserviceTemplateMock.publishedVersion.id}`
    )
  })
})
