import React from 'react'
import { render, waitFor } from '@testing-library/react'
import {
  EServiceCreateStep2Version,
  EServiceCreateStep2VersionSkeleton,
} from '../EServiceCreateStep2Version'
import { vi } from 'vitest'
import * as EServiceCreateContext from '../../EServiceCreateContext'
import type { ProducerEServiceDescriptor, ProducerEServiceDetails } from '@/api/api.generatedTypes'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceRead,
} from '__mocks__/data/eservice.mocks'
import userEvent from '@testing-library/user-event'
import * as router from '@/router'
import { EServiceMutations } from '@/api/eservice'

const mockUseNavigateRouter = vi.spyOn(router, 'useNavigateRouter')

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId/descriptors`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.put(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId/descriptors/:descriptorId`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockUseEServiceCreateContext = (
  eservice: ProducerEServiceDetails | ProducerEServiceDescriptor['eservice'] | undefined,
  descriptor: ProducerEServiceDescriptor | undefined,
  forward = vi.fn(),
  back = vi.fn()
) => {
  vi.spyOn(EServiceCreateContext, 'useEServiceCreateContext').mockReturnValue({
    eservice,
    descriptor,
    forward,
    back,
  } as unknown as ReturnType<typeof EServiceCreateContext.useEServiceCreateContext>)
}

describe('EServiceCreateStep2Version', () => {
  it('should match snapshot', () => {
    mockUseEServiceCreateContext(undefined, undefined)
    const { baseElement } = renderWithApplicationContext(<EServiceCreateStep2Version />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should call the createVersionDraft mutation when submitting a new version', async () => {
    mockUseEServiceCreateContext(createMockEServiceRead(), undefined)
    const navigateFn = vi.fn()
    mockUseNavigateRouter.mockReturnValue({ navigate: navigateFn, getRouteUrl: () => '' })
    const screen = renderWithApplicationContext(<EServiceCreateStep2Version />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()
    await user.type(
      screen.getByLabelText('create.step2.descriptionField.label'),
      'description test'
    )
    await user.type(screen.getByLabelText('create.step2.audienceField.label'), 'audience')

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)
    await waitFor(() =>
      expect(navigateFn).toBeCalledWith('PROVIDE_ESERVICE_EDIT', {
        params: {
          descriptorId: undefined,
          eserviceId: 'ad474d35-7939-4bee-bde9-4e469cca1030',
        },
        replace: true,
      })
    )
  })

  it('should call the updateVersionDraft mutation when submitting an existing version', async () => {
    const forwardFn = vi.fn()
    mockUseEServiceCreateContext(
      createMockEServiceRead(),
      createMockEServiceDescriptorProvider(),
      forwardFn
    )
    const screen = renderWithApplicationContext(<EServiceCreateStep2Version />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()
    await user.type(
      screen.getByLabelText('create.step2.descriptionField.label'),
      'description test'
    )
    await user.type(screen.getByLabelText('create.step2.audienceField.label'), 'audience')

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)
    await waitFor(() => expect(forwardFn).toBeCalled())
  })

  it("should skip the updateVersionDraft call when the user doesn't change anything", async () => {
    const forwardFn = vi.fn()
    mockUseEServiceCreateContext(
      createMockEServiceRead(),
      createMockEServiceDescriptorProvider({
        description: 'test description',
        audience: ['test audience'],
        agreementApprovalPolicy: 'AUTOMATIC',
      }),
      forwardFn
    )
    const updateVersionDraftFn = vi.fn()
    vi.spyOn(EServiceMutations, 'useUpdateVersionDraft').mockReturnValue({
      mutate: updateVersionDraftFn,
    } as unknown as ReturnType<typeof EServiceMutations.useUpdateVersionDraft>)

    const screen = renderWithApplicationContext(<EServiceCreateStep2Version />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)
    expect(forwardFn).toBeCalled()
    expect(updateVersionDraftFn).not.toBeCalled()
  })
})

describe('EServiceCreateStep2VersionSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<EServiceCreateStep2VersionSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
