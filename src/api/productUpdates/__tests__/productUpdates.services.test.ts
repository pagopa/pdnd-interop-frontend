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
      title: 'Novita su PDND',
      description: 'Sono disponibili nuovi aggiornamenti di piattaforma.',
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
      title: 'Novita piattaforma',
      description: 'E disponibile una nuova funzionalita.',
    }
    vi.mocked(axios.get).mockResolvedValueOnce({ data: bannerData })
    const ProductUpdatesServices = await importProductUpdatesServices()

    const result = await ProductUpdatesServices.getProductUpdatesJson()

    expect(axios.get).toHaveBeenCalledWith(
      'https://interop-resources.example.com/banner-info-window/it/data.json'
    )
    expect(result).toEqual(bannerData)
  })

  it('fetches the product updates banner data for the current language', async () => {
    const bannerData = {
      start: { date: '2026-06-11', time: '00:00' },
      end: { date: '2026-06-12', time: '23:59' },
      title: 'Platform news',
      description: 'A new feature is available.',
      firstLink: {
        link: 'https://docs.example.com/feature',
        label: 'Read the guide',
      },
    }
    vi.mocked(axios.get).mockResolvedValueOnce({ data: bannerData })
    const ProductUpdatesServices = await importProductUpdatesServices()

    const result = await ProductUpdatesServices.getProductUpdatesJson('en')

    expect(axios.get).toHaveBeenCalledWith(
      'https://interop-resources.example.com/banner-info-window/en/data.json'
    )
    expect(result).toEqual(bannerData)
  })

  it('falls back to the Italian banner when the current language file cannot be loaded', async () => {
    const italianBannerData = {
      start: { date: '2026-06-11', time: '00:00' },
      end: { date: '2026-06-12', time: '23:59' },
      title: 'Novita piattaforma',
      description: 'E disponibile una nuova funzionalita.',
    }
    vi.mocked(axios.get)
      .mockRejectedValueOnce(new Error('Not found'))
      .mockResolvedValueOnce({ data: italianBannerData })
    const ProductUpdatesServices = await importProductUpdatesServices()

    const result = await ProductUpdatesServices.getProductUpdatesJson('en')

    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      'https://interop-resources.example.com/banner-info-window/en/data.json'
    )
    expect(axios.get).toHaveBeenNthCalledWith(
      2,
      'https://interop-resources.example.com/banner-info-window/it/data.json'
    )
    expect(result).toEqual(italianBannerData)
  })

  it('rejects invalid product updates banner data', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: {
        start: { date: '2026-06-11', time: '00:00' },
        end: { date: '2026-06-12', time: '23:59' },
        title: 'Novita piattaforma',
      },
    })
    const ProductUpdatesServices = await importProductUpdatesServices()

    await expect(ProductUpdatesServices.getProductUpdatesJson()).rejects.toThrow()
  })

  it('rejects banner links that do not use HTTP or HTTPS', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: {
        start: { date: '2026-06-11', time: '00:00' },
        end: { date: '2026-06-12', time: '23:59' },
        title: 'Novita piattaforma',
        description: 'E disponibile una nuova funzionalita.',
        firstLink: {
          link: 'javascript:alert(document.domain)',
          label: 'Read the guide',
        },
      },
    })
    const ProductUpdatesServices = await importProductUpdatesServices()

    await expect(ProductUpdatesServices.getProductUpdatesJson()).rejects.toThrow()
  })

  it('falls back to the Italian banner when the current language file has invalid data', async () => {
    const italianBannerData = {
      start: { date: '2026-06-11', time: '00:00' },
      end: { date: '2026-06-12', time: '23:59' },
      title: 'Novita piattaforma',
      description: 'E disponibile una nuova funzionalita.',
    }
    vi.mocked(axios.get)
      .mockResolvedValueOnce({
        data: {
          start: { date: '2026-06-11', time: '00:00' },
          end: { date: '2026-06-12', time: '23:59' },
          title: 'Platform news',
        },
      })
      .mockResolvedValueOnce({ data: italianBannerData })
    const ProductUpdatesServices = await importProductUpdatesServices()

    const result = await ProductUpdatesServices.getProductUpdatesJson('en')

    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      'https://interop-resources.example.com/banner-info-window/en/data.json'
    )
    expect(axios.get).toHaveBeenNthCalledWith(
      2,
      'https://interop-resources.example.com/banner-info-window/it/data.json'
    )
    expect(result).toEqual(italianBannerData)
  })
})
