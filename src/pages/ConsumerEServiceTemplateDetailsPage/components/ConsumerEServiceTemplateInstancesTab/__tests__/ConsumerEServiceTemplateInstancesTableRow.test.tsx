import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import {
  ConsumerEServiceTemplateInstancesTableRow,
  ConsumerEServiceTemplateInstancesTableRowSkeleton,
} from '../ConsumerEServiceTemplateInstancesTableRow'
import type {
  CompactEServiceTemplateVersion,
  EServiceTemplateInstance,
} from '@/api/api.generatedTypes'

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

describe('ConsumerEServiceTemplateInstancesTableRow', () => {
  it('should render the instanceLabel when present', () => {
    mockUseJwt()
    const instance: EServiceTemplateInstance = {
      ...baseInstance,
      instanceLabel: 'my-label',
    }

    const { getByText } = renderWithApplicationContext(
      <table>
        <tbody>
          <ConsumerEServiceTemplateInstancesTableRow
            type="consumer"
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
          <ConsumerEServiceTemplateInstancesTableRow
            type="consumer"
            instance={instance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(getAllByText('-').length).toBeGreaterThanOrEqual(1)
  })

  it('should render "-" when instanceLabel is an empty string', () => {
    mockUseJwt()
    const instance: EServiceTemplateInstance = {
      ...baseInstance,
      instanceLabel: '',
    }

    const { getAllByText } = renderWithApplicationContext(
      <table>
        <tbody>
          <ConsumerEServiceTemplateInstancesTableRow
            type="consumer"
            instance={instance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(getAllByText('-').length).toBeGreaterThanOrEqual(1)
  })

  it('should navigate to PROVIDE_ESERVICE_MANAGE when instance is owned', async () => {
    mockUseJwt({ jwt: { organizationId: 'producer-1' } })

    const { getByRole, history } = renderWithApplicationContext(
      <table>
        <tbody>
          <ConsumerEServiceTemplateInstancesTableRow
            type="consumer"
            instance={baseInstance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    const user = userEvent.setup()
    await user.click(getByRole('link'))

    expect(history.location.pathname).toBe('/it/erogazione/e-service/eservice-1/descriptor-1')
  })

  it('should navigate to SUBSCRIBE_CATALOG_VIEW when instance is not owned', async () => {
    mockUseJwt({ jwt: { organizationId: 'other-org' } })

    const { getByRole, history } = renderWithApplicationContext(
      <table>
        <tbody>
          <ConsumerEServiceTemplateInstancesTableRow
            type="consumer"
            instance={baseInstance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    const user = userEvent.setup()
    await user.click(getByRole('link'))

    expect(history.location.pathname).toBe('/it/catalogo-e-service/eservice-1/descriptor-1')
  })

  it('should show ByDelegationChip when instance is not owned', () => {
    mockUseJwt({ jwt: { organizationId: 'other-org' } })

    const { getByText } = renderWithApplicationContext(
      <table>
        <tbody>
          <ConsumerEServiceTemplateInstancesTableRow
            type="consumer"
            instance={baseInstance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(getByText('label.default')).toBeInTheDocument()
  })

  it('should not show ByDelegationChip when instance is owned', () => {
    mockUseJwt({ jwt: { organizationId: 'producer-1' } })

    const { queryByText } = renderWithApplicationContext(
      <table>
        <tbody>
          <ConsumerEServiceTemplateInstancesTableRow
            type="consumer"
            instance={baseInstance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(queryByText('label.default')).not.toBeInTheDocument()
  })

  it('should render without latestDescriptor', () => {
    mockUseJwt()
    const instance: EServiceTemplateInstance = {
      ...baseInstance,
      latestDescriptor: undefined,
    }

    const { queryByRole } = renderWithApplicationContext(
      <table>
        <tbody>
          <ConsumerEServiceTemplateInstancesTableRow
            type="consumer"
            instance={instance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(queryByRole('link')).not.toBeInTheDocument()
  })

  it('should render "-" when templateVersionId does not match any version', () => {
    mockUseJwt()
    const instance: EServiceTemplateInstance = {
      ...baseInstance,
      latestDescriptor: {
        ...baseInstance.latestDescriptor!,
        templateVersionId: 'non-existent-version',
      },
    }

    const { getAllByText } = renderWithApplicationContext(
      <table>
        <tbody>
          <ConsumerEServiceTemplateInstancesTableRow
            type="consumer"
            instance={instance}
            eserviceTemplateVersions={eserviceTemplateVersions}
          />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    expect(getAllByText('-').length).toBeGreaterThanOrEqual(1)
  })
})

describe('ConsumerEServiceTemplateInstancesTableRowSkeleton', () => {
  it('should render skeleton cells', () => {
    const { container } = renderWithApplicationContext(
      <table>
        <tbody>
          <ConsumerEServiceTemplateInstancesTableRowSkeleton />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    const skeletons = container.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThanOrEqual(4)
  })
})
