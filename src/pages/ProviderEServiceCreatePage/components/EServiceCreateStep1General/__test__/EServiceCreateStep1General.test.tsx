import React from 'react'
import { render, waitFor } from '@testing-library/react'
import {
  EServiceCreateStep1General,
  EServiceCreateStep1GeneralSkeleton,
} from '../EServiceCreateStep1General'
import { vi } from 'vitest'
import * as router from '@/router'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { ProducerEServiceDescriptor, ProducerEServiceDetails } from '@/api/api.generatedTypes'
import * as EServiceCreateContext from '../../EServiceCreateContext'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceRead,
} from '__mocks__/data/eservice.mocks'
import userEvent from '@testing-library/user-event'
import * as language from '@/hooks/useCurrentLanguage'
import { URL_FRAGMENTS } from '@/router/router.utils'
import { EServiceMutations } from '@/api/eservice'
import { createMockJwtUser } from '__mocks__/data/user.mocks'

const mockUseNavigateRouter = vi.spyOn(router, 'useNavigateRouter')
vi.spyOn(language, 'default').mockReturnValue('it')

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/eservices`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'ad474d35-7939-4bee-bde9-4e469cca1030',
      })
    )
  }),
  rest.put(`${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId`, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockUseEServiceCreateContext = (
  eservice: ProducerEServiceDetails | ProducerEServiceDescriptor['eservice'] | undefined,
  descriptor: ProducerEServiceDescriptor | undefined,
  isNewEService: boolean,
  forward = vi.fn()
) => {
  vi.spyOn(EServiceCreateContext, 'useEServiceCreateContext').mockReturnValue({
    eservice,
    descriptor,
    isNewEService,
    forward,
  } as unknown as ReturnType<typeof EServiceCreateContext.useEServiceCreateContext>)
}

describe('EServiceCreateStep1General', () => {
  it('should match snapshot if isNewEService is true', () => {
    mockUseJwt()
    mockUseEServiceCreateContext(undefined, undefined, true)
    const { baseElement } = renderWithApplicationContext(<EServiceCreateStep1General />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot if isNewEService is false and EService defined', () => {
    mockUseJwt()
    const eservice = createMockEServiceRead()
    mockUseEServiceCreateContext(eservice, undefined, false)
    const { baseElement } = renderWithApplicationContext(<EServiceCreateStep1General />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot if isNewEService is false and EService and descriptor defined and isEditable', () => {
    mockUseJwt()
    const eservice = createMockEServiceRead()
    const descriptor = createMockEServiceDescriptorProvider({ version: '1', state: 'DRAFT' })
    mockUseEServiceCreateContext(eservice, descriptor, false)
    const { baseElement } = renderWithApplicationContext(<EServiceCreateStep1General />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot if isNewEService is false and EService and descriptor defined but isEditable is false', () => {
    mockUseJwt()
    const eservice = createMockEServiceRead()
    const descriptor = createMockEServiceDescriptorProvider({ state: 'PUBLISHED' })
    mockUseEServiceCreateContext(eservice, descriptor, false)
    const { baseElement } = renderWithApplicationContext(<EServiceCreateStep1General />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should call the createDraft mutation when submitting a new eservice', async () => {
    mockUseJwt()
    mockUseEServiceCreateContext(undefined, undefined, true)
    const navigateFn = vi.fn()
    mockUseNavigateRouter.mockReturnValue({ navigate: navigateFn, getRouteUrl: () => '' })
    const screen = renderWithApplicationContext(<EServiceCreateStep1General />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('create.step1.eserviceNameField.label'), 'name test')
    await user.type(
      screen.getByLabelText('create.step1.eserviceDescriptionField.label'),
      'description test'
    )

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)
    await waitFor(() =>
      expect(navigateFn).toBeCalledWith('PROVIDE_ESERVICE_EDIT', {
        params: {
          eserviceId: 'ad474d35-7939-4bee-bde9-4e469cca1030',
          descriptorId: URL_FRAGMENTS.FIRST_DRAFT['it'],
        },
        replace: true,
        state: { stepIndexDestination: 1 },
      })
    )
  })

  it('should skip the createDraft mutation when jwt has not an organizationId', async () => {
    mockUseJwt({ jwt: createMockJwtUser({ organizationId: undefined }) })
    mockUseEServiceCreateContext(undefined, undefined, true)
    const navigateFn = vi.fn()
    mockUseNavigateRouter.mockReturnValue({ navigate: navigateFn, getRouteUrl: () => '' })
    const createDraftFn = vi.fn()
    vi.spyOn(EServiceMutations, 'useCreateDraft').mockReturnValue({
      mutate: createDraftFn,
    } as unknown as ReturnType<typeof EServiceMutations.useCreateDraft>)
    const screen = renderWithApplicationContext(<EServiceCreateStep1General />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('create.step1.eserviceNameField.label'), 'name test')
    await user.type(
      screen.getByLabelText('create.step1.eserviceDescriptionField.label'),
      'description test'
    )

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)
    expect(navigateFn).not.toBeCalled()
    expect(createDraftFn).not.toBeCalled()
  })

  it('should call the updateDraft mutation when submitting an existing eservice', async () => {
    mockUseJwt()
    const forwardFn = vi.fn()
    const eservice = createMockEServiceRead()
    mockUseEServiceCreateContext(eservice, undefined, false, forwardFn)
    const screen = renderWithApplicationContext(<EServiceCreateStep1General />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('create.step1.eserviceNameField.label'), 'name test')
    await user.type(
      screen.getByLabelText('create.step1.eserviceDescriptionField.label'),
      'description test'
    )

    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)
    await waitFor(() => expect(forwardFn).toBeCalled())
  })

  it("should skip the updateDraft mutation call when the user doesn't change anything", async () => {
    mockUseJwt()
    const forwardFn = vi.fn()
    const eservice = createMockEServiceRead()
    mockUseEServiceCreateContext(eservice, undefined, false, forwardFn)
    const updateDraftFn = vi.fn()
    vi.spyOn(EServiceMutations, 'useUpdateDraft').mockReturnValue({
      mutate: updateDraftFn,
    } as unknown as ReturnType<typeof EServiceMutations.useUpdateDraft>)

    const screen = renderWithApplicationContext(<EServiceCreateStep1General />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: 'create.forwardWithSaveBtn' })
    await user.click(submitButton)

    expect(forwardFn).toBeCalled()
    expect(updateDraftFn).not.toBeCalled()
  })
})

describe('EServiceCreateStep1GeneralSkeleton', () => {
  it('should match snapshot', () => {
    mockUseJwt()
    const { baseElement } = render(<EServiceCreateStep1GeneralSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
