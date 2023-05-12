import React from 'react'
import { mockUseCurrentRoute } from '@/utils/testing.utils'
import { vi } from 'vitest'
import * as router from '@/router'
import { render } from '@testing-library/react'
import { EServiceVersionHistorySection } from '../EServiceVersionHistorySection'
import { mockEServiceDetailsContext } from './test.commons'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'
import type { CompactDescriptor } from '@/api/api.generatedTypes'
import userEvent from '@testing-library/user-event'

const navigateFn = vi.fn()
vi.spyOn(router, 'useNavigateRouter').mockReturnValue({
  navigate: navigateFn,
  getRouteUrl: () => '',
})

afterEach(() => {
  navigateFn.mockClear()
})

const descriptors: Array<CompactDescriptor> = [
  { audience: [''], id: 'descriptor-1', state: 'DEPRECATED', version: '1' },
  { audience: [''], id: 'descriptor-2', state: 'DEPRECATED', version: '2' },
  { audience: [''], id: 'descriptor-3', state: 'PUBLISHED', version: '3' },
]

describe('EServiceVersionHistorySection', () => {
  it('should match the snapshot', () => {
    mockUseCurrentRoute({ mode: 'provider' })
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog({
        eservice: {
          descriptors,
        },
      }),
    })
    const { baseElement } = render(<EServiceVersionHistorySection />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if there is just one descriptor', () => {
    mockUseCurrentRoute({ mode: 'provider' })
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog({
        eservice: {
          descriptors: [descriptors[0]],
        },
      }),
    })
    const { container } = render(<EServiceVersionHistorySection />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should navigate to the selected descriptor (provider)', async () => {
    mockUseCurrentRoute({ mode: 'provider' })
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog({
        eservice: { id: 'e-service-id', descriptors },
      }),
    })

    const screen = render(<EServiceVersionHistorySection />)
    const user = userEvent.setup()

    const select = screen.getByLabelText('historyField.label')
    await user.click(select)

    const option = screen.getAllByRole('option')[0]
    await user.click(option)

    const submitBtn = screen.getByRole('button', { name: 'submitBtn' })
    await user.click(submitBtn)

    expect(navigateFn).toBeCalledWith('PROVIDE_ESERVICE_MANAGE', {
      params: {
        descriptorId: 'descriptor-1',
        eserviceId: 'e-service-id',
      },
    })
  })

  it('should navigate to the selected descriptor (consumer)', async () => {
    mockUseCurrentRoute({ mode: 'consumer' })
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog({
        eservice: { id: 'e-service-id', descriptors },
      }),
    })

    const screen = render(<EServiceVersionHistorySection />)
    const user = userEvent.setup()

    const select = screen.getByLabelText('historyField.label')
    await user.click(select)

    const option = screen.getAllByRole('option')[0]
    await user.click(option)

    const submitBtn = screen.getByRole('button', { name: 'submitBtn' })
    await user.click(submitBtn)

    expect(navigateFn).toBeCalledWith('SUBSCRIBE_CATALOG_VIEW', {
      params: {
        descriptorId: 'descriptor-1',
        eserviceId: 'e-service-id',
      },
    })
  })
})
