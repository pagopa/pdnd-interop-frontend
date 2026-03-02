import React from 'react'
import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import {
  ConsumerEServiceTemplateInstancesTable,
  ConsumerEServiceTemplateInstancesTableSkeleton,
} from '../ConsumerEServiceTemplateInstancesTable'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type {
  CompactEServiceTemplateVersion,
  EServiceTemplateInstances,
} from '@/api/api.generatedTypes'

const eserviceTemplateVersions: CompactEServiceTemplateVersion[] = [
  { id: 'template-version-1', version: 1, state: 'PUBLISHED' },
]

let mockQueryData: EServiceTemplateInstances

vi.mock('@/router', () => ({
  useParams: () => ({ eServiceTemplateId: 'template-id' }),
  Link: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    to: string
    params: Record<string, string>
  }) => <a href={`/${props.to}`}>{children}</a>,
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getMyEServiceTemplateInstancesList: vi.fn(),
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-query')>()),
  useSuspenseQuery: () => ({ data: mockQueryData }),
  useQuery: () => ({ data: mockQueryData?.pagination.totalCount }),
}))

describe('ConsumerEServiceTemplateInstancesTable', () => {
  it('renders the table with instances', () => {
    mockQueryData = {
      results: [
        {
          id: 'eservice-1',
          name: 'Test EService',
          producerId: 'producer-1',
          producerName: 'Producer',
          instanceLabel: 'label-1',
          latestDescriptor: {
            id: 'descriptor-1',
            state: 'PUBLISHED',
            version: '1',
            audience: [],
            templateVersionId: 'template-version-1',
          },
          descriptors: [],
        },
      ],
      pagination: { offset: 0, limit: 10, totalCount: 1 },
    }

    renderWithApplicationContext(
      <ConsumerEServiceTemplateInstancesTable
        eserviceTemplateId="template-id"
        eserviceTemplateVersions={eserviceTemplateVersions}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText('label-1')).toBeInTheDocument()
    expect(screen.getByText('actions.inspect')).toBeInTheDocument()
  })

  it('renders an info alert when there are no instances', () => {
    mockQueryData = {
      results: [],
      pagination: { offset: 0, limit: 10, totalCount: 0 },
    }

    renderWithApplicationContext(
      <ConsumerEServiceTemplateInstancesTable
        eserviceTemplateId="template-id"
        eserviceTemplateVersions={eserviceTemplateVersions}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('noDataLabel')).toBeInTheDocument()
  })
})

describe('ConsumerEServiceTemplateInstancesTableSkeleton', () => {
  it('renders skeleton rows', () => {
    const { container } = renderWithApplicationContext(
      <ConsumerEServiceTemplateInstancesTableSkeleton />,
      { withReactQueryContext: true }
    )

    const skeletons = container.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBeGreaterThanOrEqual(5)
  })
})
