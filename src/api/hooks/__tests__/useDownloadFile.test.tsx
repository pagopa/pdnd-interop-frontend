import { act, renderHook } from '@testing-library/react'
import { AxiosError, type AxiosResponse } from 'axios'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDownloadFile } from '../useDownloadFile'
import { useToastNotificationStore } from '@/stores'

describe('useDownloadFile', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows the backend userMessage and correlation ID when the download fails', async () => {
    const showToast = vi.spyOn(useToastNotificationStore.getState(), 'showToast')
    const error = new AxiosError(
      'Download failed',
      AxiosError.ERR_BAD_RESPONSE,
      undefined,
      undefined,
      {
        data: { userMessage: 'Download backend message', correlationId: 'download-corr' },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {},
      } as AxiosResponse
    )
    const service = vi.fn().mockRejectedValue(error)
    const logError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { result } = renderHook(() =>
      useDownloadFile(service, { errorToastLabel: 'Download fallback', loadingLabel: 'Loading' })
    )

    await act(async () => result.current([]))

    expect(showToast).toHaveBeenCalledExactlyOnceWith(
      'Download backend message',
      'error',
      'download-corr'
    )
    expect(service).toHaveBeenCalledOnce()
    expect(logError).toHaveBeenCalledWith(error)
  })
})
