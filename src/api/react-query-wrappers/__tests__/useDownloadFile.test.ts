import axiosInstance from '@/config/axios'
import { renderHookWithApplicationContext } from '@/__mocks__/mock.utils'
import { screen, waitForElementToBeRemoved } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { act } from 'react-dom/test-utils'
import { vitest } from 'vitest'
import { useDownloadFile } from '../useDownloadFile'
import * as _downloadFile from '../react-query-wrappers.utils'
import noop from 'lodash/noop'

const server = setupServer(
  rest.post('/test-success', (_, res, ctx) => {
    return res(ctx.json('test'))
  }),
  rest.post('/test-error', (_, res, ctx) => {
    return res(ctx.status(500))
  })
)

const downloadFileSpyFn = vitest.spyOn(_downloadFile, 'downloadFile')
downloadFileSpyFn.mockImplementation(noop)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

const mockDownloadServices = {
  success: async () => {
    const response = await axiosInstance.post<string>('/test-success')
    return response.data
  },
  error: async () => {
    const response = await axiosInstance.post<string>('/test-error')
    return response.data
  },
}

describe('useDownloadFile tests', () => {
  it('Should show and hide the loading overlay on download file', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useDownloadFile(mockDownloadServices.success, {
          errorToastLabel: 'error',
          loadingLabel: 'loading',
        }),
      { withLoadingOverlayContext: true, withToastNotificationsContext: true }
    )

    act(() => {
      result.current()
    })

    screen.getByRole('progressbar', { hidden: true })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))
  })

  it('Should show error toast notification if something goes wrong', async () => {
    const { result } = renderHookWithApplicationContext(
      () =>
        useDownloadFile(mockDownloadServices.error, {
          errorToastLabel: 'error',
          loadingLabel: 'loading',
        }),
      { withLoadingOverlayContext: true, withToastNotificationsContext: true }
    )

    act(() => {
      result.current()
    })

    await waitForElementToBeRemoved(screen.getByRole('progressbar', { hidden: true }))

    expect(await screen.findByRole('alert', { name: 'error' })).toBeInTheDocument()
  })
})
