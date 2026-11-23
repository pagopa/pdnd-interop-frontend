import { afterEach, describe, expect, it, vi } from 'vitest'
import { TextDecoder as NodeTextDecoder } from 'node:util'
import { AxiosError, type AxiosResponse } from 'axios'
import axiosInstance from '../axios'

describe('axios params serializer', () => {
  it('URL-encodes reserved characters in query params while preserving comma-separated arrays', () => {
    const uri = axiosInstance.getUri({
      url: '/catalog',
      params: {
        q: '% & "\'',
        states: ['PUBLISHED', undefined, null, 'DRAFT'],
        eserviceIds: [undefined],
        offset: 0,
        empty: '',
        omitted: undefined,
      },
    })

    expect(uri).toBe(
      '/catalog?q=%25%20%26%20%22%27&states=PUBLISHED,DRAFT&eserviceIds=&offset=0&empty='
    )
  })
})

describe('axios response error interceptor', () => {
  afterEach(() => vi.unstubAllGlobals())

  const setupTextDecoder = () => vi.stubGlobal('TextDecoder', NodeTextDecoder)

  const rejectedHandler = () => {
    const { handlers } = axiosInstance.interceptors.response as unknown as {
      handlers: Array<{ rejected?: (error: unknown) => Promise<unknown> }>
    }
    const rejected = handlers[0]?.rejected
    if (!rejected) throw new Error('Axios response error interceptor is not registered')
    return rejected
  }

  const axiosErrorWithData = (data: unknown) => {
    const response = {
      data,
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {},
    } as AxiosResponse
    return new AxiosError(
      'request failed',
      AxiosError.ERR_BAD_RESPONSE,
      undefined,
      undefined,
      response
    )
  }

  it('decodes a Blob JSON problem body before rejecting', async () => {
    setupTextDecoder()
    const blob = new Blob(['ignored'])
    Object.defineProperty(blob, 'text', {
      value: async () => '{"userMessage":"Blob message","correlationId":"blob-corr"}',
    })
    const error = axiosErrorWithData(blob)

    await expect(rejectedHandler()(error)).rejects.toBe(error)
    expect(error.response?.data).toEqual({
      userMessage: 'Blob message',
      correlationId: 'blob-corr',
    })
  })

  it('decodes an ArrayBuffer JSON problem body before rejecting', async () => {
    setupTextDecoder()
    const encoded = new TextEncoder().encode('{"userMessage":"Buffer message"}')
    const error = axiosErrorWithData(new Uint8Array(encoded).buffer)

    await expect(rejectedHandler()(error)).rejects.toBe(error)
    expect(error.response?.data).toEqual({ userMessage: 'Buffer message' })
  })

  it('leaves binary non-JSON and non-binary response data unchanged', async () => {
    setupTextDecoder()
    const blob = new Blob(['ignored'])
    Object.defineProperty(blob, 'text', { value: async () => 'not JSON' })
    const dataValues = [
      blob,
      new Uint8Array(new TextEncoder().encode('not JSON')).buffer,
      { userMessage: 'unchanged' },
    ]

    for (const data of dataValues) {
      const error = axiosErrorWithData(data)
      await expect(rejectedHandler()(error)).rejects.toBe(error)
      expect(error.response?.data).toBe(data)
    }
  })
})
