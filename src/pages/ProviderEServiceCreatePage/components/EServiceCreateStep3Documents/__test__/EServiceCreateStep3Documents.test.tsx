import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import * as router from '@/router'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import { vi } from 'vitest'
import * as EServiceCreateContext from '../../EServiceCreateContext'
import * as toast from '@/stores'
import {
  EServiceCreateStep3Documents,
  EServiceCreateStep3DocumentsSkeleton,
} from '../EServiceCreateStep3Documents'
import { render, waitFor } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '__mocks__/data/eservice.mocks'
import userEvent from '@testing-library/user-event'

const mockUseNavigateRouter = vi.spyOn(router, 'useNavigateRouter')
const mockUseToastNotification = vi.spyOn(toast, 'useToastNotification')
const server = setupServer(
  rest.delete(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId/descriptors/:descriptorId`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  ),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId/descriptors/:descriptorId/publish`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  )
)

const original = window.crypto.getRandomValues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.crypto.getRandomValues = () => [0, undefined] as any

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => {
  server.close()
  window.crypto.getRandomValues = original
})

const mockUseEServiceCreateContext = (
  descriptor: ProducerEServiceDescriptor | undefined,
  back = vi.fn()
) => {
  vi.spyOn(EServiceCreateContext, 'useEServiceCreateContext').mockReturnValue({
    descriptor,
    back,
  } as unknown as ReturnType<typeof EServiceCreateContext.useEServiceCreateContext>)
}

describe('EServiceCreateStep3Documents', () => {
  it('should match snapshot if descriptor has interface', () => {
    const descriptor = createMockEServiceDescriptorProvider()
    mockUseEServiceCreateContext(descriptor)
    const { baseElement } = renderWithApplicationContext(<EServiceCreateStep3Documents />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot if descriptor has no interface', () => {
    const descriptor = createMockEServiceDescriptorProvider({ interface: undefined })
    mockUseEServiceCreateContext(descriptor)
    const { baseElement } = renderWithApplicationContext(<EServiceCreateStep3Documents />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should call the deleteVersionDraft mutation', async () => {
    const navigateFn = vi.fn()
    mockUseNavigateRouter.mockReturnValue({ navigate: navigateFn, getRouteUrl: () => '' })
    const descriptor = createMockEServiceDescriptorProvider()
    mockUseEServiceCreateContext(descriptor)
    const screen = renderWithApplicationContext(<EServiceCreateStep3Documents />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()

    const deleteButton = screen.getByRole('button', { name: 'create.quickPublish.deleteBtn' })
    await user.click(deleteButton)
    const confirmButton = screen.getByRole('button', { name: 'confirm' })
    await user.click(confirmButton)
    await waitFor(() => expect(navigateFn).toBeCalledWith('PROVIDE_ESERVICE_LIST'))
  })

  it('should skip the deleteVersionDraft mutation call if there is no descriptor', async () => {
    const navigateFn = vi.fn()
    mockUseNavigateRouter.mockReturnValue({ navigate: navigateFn, getRouteUrl: () => '' })
    mockUseEServiceCreateContext(undefined)
    const screen = renderWithApplicationContext(<EServiceCreateStep3Documents />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()

    const deleteButton = screen.getByRole('button', { name: 'create.quickPublish.deleteBtn' })
    await user.click(deleteButton)
    await waitFor(() => expect(navigateFn).not.toBeCalled())
  })

  it('should call the publishVersionDraft mutation', async () => {
    const navigateFn = vi.fn()
    mockUseNavigateRouter.mockReturnValue({ navigate: navigateFn, getRouteUrl: () => '' })
    const descriptor = createMockEServiceDescriptorProvider()
    mockUseEServiceCreateContext(descriptor)
    const screen = renderWithApplicationContext(<EServiceCreateStep3Documents />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()

    const publishButton = screen.getByRole('button', { name: 'create.quickPublish.publishBtn' })
    await user.click(publishButton)
    const confirmButton = screen.getByRole('button', { name: 'confirm' })
    await user.click(confirmButton)
    await waitFor(() =>
      expect(navigateFn).toBeCalledWith('PROVIDE_ESERVICE_MANAGE', {
        params: {
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
        },
      })
    )
  })

  it('should call the showToast and navigate if saveDraft is called', async () => {
    const navigateFn = vi.fn()
    mockUseNavigateRouter.mockReturnValue({ navigate: navigateFn, getRouteUrl: () => '' })
    const showToastFn = vi.fn()
    mockUseToastNotification.mockReturnValue({ showToast: showToastFn, hideToast: vi.fn() })
    const descriptor = createMockEServiceDescriptorProvider()
    mockUseEServiceCreateContext(descriptor)
    const screen = renderWithApplicationContext(<EServiceCreateStep3Documents />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()

    const saveButton = screen.getByRole('button', { name: 'create.endWithSaveBtn' })
    await user.click(saveButton)
    await waitFor(() => {
      expect(showToastFn).toBeCalledWith('eservice.updateVersionDraft.outcome.success', 'success')
      expect(navigateFn).toBeCalledWith('PROVIDE_ESERVICE_LIST')
    })
  })
})

describe('EServiceCreateStep3DocumentsSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<EServiceCreateStep3DocumentsSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
