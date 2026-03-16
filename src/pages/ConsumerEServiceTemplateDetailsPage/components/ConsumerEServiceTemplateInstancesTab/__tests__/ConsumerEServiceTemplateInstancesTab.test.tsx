import React from 'react'
import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { ConsumerEServiceTemplateInstancesTab } from '../ConsumerEServiceTemplateInstancesTab'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { CompactEServiceTemplateVersion } from '@/api/api.generatedTypes'

vi.mock('@/router', () => ({
  useParams: () => ({ eServiceTemplateId: 'template-id' }),
}))

vi.mock('../ConsumerEServiceTemplateInstancesTable', () => ({
  ConsumerEServiceTemplateInstancesTable: ({
    eserviceTemplateId,
    eserviceTemplateVersions,
  }: {
    eserviceTemplateId: string
    eserviceTemplateVersions: CompactEServiceTemplateVersion[]
  }) => (
    <div data-testid="instances-table">
      {eserviceTemplateId} - {eserviceTemplateVersions.length} versions
    </div>
  ),
}))

describe('ConsumerEServiceTemplateInstancesTab', () => {
  it('renders the instances table with correct props', () => {
    const versions: CompactEServiceTemplateVersion[] = [
      { id: 'v1', version: 1, state: 'PUBLISHED' },
    ]

    renderWithApplicationContext(
      <ConsumerEServiceTemplateInstancesTab eserviceTemplateVersions={versions} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByTestId('instances-table')).toHaveTextContent('template-id - 1 versions')
  })
})
