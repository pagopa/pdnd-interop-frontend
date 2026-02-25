import React from 'react'
import { vi } from 'vitest'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import * as router from '@/router'
import userEvent from '@testing-library/user-event'
import { ProviderEServiceTemplateUsingTenantsTableRow } from '../ProviderEServiceTemplateUsingTenantsTableRow'
import type {
  CompactEServiceTemplateVersion,
  EServiceTemplateInstance,
} from '@/api/api.generatedTypes'

const navigateRouterFn = vi.fn()
vi.spyOn(router, 'useNavigate').mockReturnValue(navigateRouterFn)

const eserviceTemplateVersions: CompactEServiceTemplateVersion[] = [
  { id: 'template-version-1', version: 1, state: 'PUBLISHED' },
]

const baseInstance: EServiceTemplateInstance = {
  id: 'eservice-1',
  name: 'Test EService',
  producerId: 'producer-1',
  producerName: 'Producer Name',
  latestDescriptor: {
    id: 'descriptor-1',
    state: 'PUBLISHED',
    version: '1',
    audience: [],
    templateVersionId: 'template-version-1',
  },
  descriptors: [],
}

afterEach(() => {
  navigateRouterFn.mockReset()
})

describe('ProviderEServiceTemplateUsingTenantsTableRow', () => {
  it('should render the instanceLabel when present', () => {
    mockUseJwt()
    const instance: EServiceTemplateInstance = {
      ...baseInstance,
      instanceLabel: 'my-label',
    }

    const { getByText } = renderWithApplicationContext(
      <table>
        <tbody>
          <ProviderEServiceTemplateUsingTenantsTableRow
            instance={instance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(getByText('my-label')).toBeInTheDocument()
  })

  it('should render "-" when instanceLabel is not present', () => {
    mockUseJwt()
    const instance: EServiceTemplateInstance = {
      ...baseInstance,
      instanceLabel: undefined,
    }

    const { getAllByText } = renderWithApplicationContext(
      <table>
        <tbody>
          <ProviderEServiceTemplateUsingTenantsTableRow
            instance={instance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(getAllByText('-').length).toBeGreaterThanOrEqual(1)
  })

  it('should navigate to PROVIDE_ESERVICE_MANAGE when the instance is owned by the current user', async () => {
    mockUseJwt({ jwt: { organizationId: 'producer-1' } })

    const { getByRole, history } = renderWithApplicationContext(
      <table>
        <tbody>
          <ProviderEServiceTemplateUsingTenantsTableRow
            instance={baseInstance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    const user = userEvent.setup()
    await user.click(getByRole('link', { name: 'actions.inspect' }))

    expect(history.location.pathname).toBe('/it/erogazione/e-service/eservice-1/descriptor-1')
  })

  it('should navigate to SUBSCRIBE_CATALOG_VIEW when the instance is not owned by the current user', async () => {
    mockUseJwt({ jwt: { organizationId: 'other-org' } })

    const { getByRole, history } = renderWithApplicationContext(
      <table>
        <tbody>
          <ProviderEServiceTemplateUsingTenantsTableRow
            instance={baseInstance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    const user = userEvent.setup()
    await user.click(getByRole('link', { name: 'actions.inspect' }))

    expect(history.location.pathname).toBe('/it/catalogo-e-service/eservice-1/descriptor-1')
  })
})
