import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const envMock = vi.hoisted(() => ({
  APP_MODE: 'production',
  INTEROP_RESOURCES_BASE_URL: 'https://interop-resources.example.com',
}))

vi.mock('@/config/env', () => envMock)

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

async function importProductUpdatesServices() {
  vi.resetModules()
  const { ProductUpdatesServices } = await import('../productUpdates.services')
  return ProductUpdatesServices
}

describe('ProductUpdatesServices.getProductUpdatesJson', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    envMock.APP_MODE = 'production'
    envMock.INTEROP_RESOURCES_BASE_URL = 'https://interop-resources.example.com'
  })

  it('returns mocked banner data in development mode', async () => {
    envMock.APP_MODE = 'development'
    const ProductUpdatesServices = await importProductUpdatesServices()

    const result = await ProductUpdatesServices.getProductUpdatesJson()

    expect(result).toEqual({
      start: {
        date: '2023-05-25',
        time: '10:47',
      },
      end: {
        date: '2028-05-25',
        time: '12:47',
      },
    })
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('fetches the product updates banner data from the S3 banner info window path', async () => {
    const bannerData = {
      start: {
        date: '2026-06-11',
        time: '00:00',
      },
      end: {
        date: '2026-06-12',
        time: '23:59',
      },
    }
    vi.mocked(axios.get).mockResolvedValueOnce({ data: bannerData })
    const ProductUpdatesServices = await importProductUpdatesServices()

    const result = await ProductUpdatesServices.getProductUpdatesJson()

    expect(axios.get).toHaveBeenCalledWith(
      'https://interop-resources.example.com/banner-info-window/data.json'
    )
    expect(result).toEqual(bannerData)
  })
})
