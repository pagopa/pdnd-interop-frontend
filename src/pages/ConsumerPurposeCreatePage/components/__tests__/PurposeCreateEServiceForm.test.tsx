import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { PurposeCreateEServiceForm } from '../PurposeCreateEServiceForm'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'
import { createMockEServiceCatalog } from '__mocks__/data/eservice.mocks'
import { PurposeMutations, PurposeQueries } from '@/api/purpose'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import type { Purpose } from '@/api/api.generatedTypes'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { fireEvent, waitFor } from '@testing-library/react'

mockUseJwt()

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/purposes`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 'test-id' }))
  }),
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/purposes/:purposeId/versions`, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

vi.spyOn(EServiceQueries, 'useGetCatalogList').mockReturnValue({
  data: {
    results: [
      createMockEServiceCatalog({
        name: 'e-service name',
        producer: { name: 'producer name' },
      }),
    ],
  },
} as unknown as ReturnType<typeof EServiceQueries.useGetCatalogList>)

vi.spyOn(PurposeQueries, 'useGetConsumersList').mockReturnValue({
  data: { results: [createMockPurpose()] },
  isInitialLoading: false,
} as unknown as ReturnType<typeof PurposeQueries.useGetConsumersList>)

const createUseGetSinglePurposeMock = (data: Purpose | undefined) => {
  vi.spyOn(PurposeQueries, 'useGetSingle').mockReturnValue({ data } as unknown as ReturnType<
    typeof PurposeQueries.useGetSingle
  >)
}

describe('PurposeCreateEServiceForm', () => {
  it('should match snapshot', () => {
    const { baseElement } = renderWithApplicationContext(<PurposeCreateEServiceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should navigate to the edit page on submit success', async () => {
    const { getByRole, history } = renderWithApplicationContext(<PurposeCreateEServiceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const button = getByRole('button', { name: 'create.createNewPurposeBtn' })
    fireEvent.click(button)

    await waitFor(() =>
      expect(history.location.pathname).toEqual('/it/fruizione/finalita/test-id/modifica')
    )
  })

  it("should prefill the new purpose data with template's data if the user selects a template", async () => {
    createUseGetSinglePurposeMock(
      createMockPurpose({ title: 'test title', description: 'test description' })
    )
    const createPurposeDraftFn = vi.fn()
    vi.spyOn(PurposeMutations, 'useCreateDraft').mockReturnValue({
      mutate: createPurposeDraftFn,
    } as unknown as ReturnType<typeof PurposeMutations.useCreateDraft>)

    const { getByRole } = renderWithApplicationContext(<PurposeCreateEServiceForm />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const useTemplateCheckbox = getByRole('checkbox', { name: 'create.isTemplateField.label' })
    fireEvent.click(useTemplateCheckbox)
    const submitButton = getByRole('button', { name: 'create.createNewPurposeBtn' })
    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(createPurposeDraftFn).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'test title — clone',
          description: 'test description',
        }),
        expect.any(Object)
      )
    )
  })
})
