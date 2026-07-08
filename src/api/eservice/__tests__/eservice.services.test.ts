import { vi, describe, it, expect, beforeEach } from 'vitest'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import axiosInstance from '@/config/axios'
import { EServiceServices } from '../eservice.services'

// Mock axiosInstance
vi.mock('@/config/axios', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}))

describe('EServiceServices.importVersion', () => {
  const presignedUrl = { url: 'https://presigned.example.com/upload' }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: presignedUrl })
    vi.mocked(axiosInstance.put).mockResolvedValue({})
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} })
  })

  it('sends the sanitized file name to both the presigned-URL param and the imported FileResource', async () => {
    const eserviceFile = new File(['content'], 'abc123_def456 (1).zip')

    await EServiceServices.importVersion({ eserviceFile })

    // the presigned-URL request uses the sanitized name as `fileName` param
    expect(axiosInstance.get).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/import/eservices/presignedUrl`,
      { params: { fileName: 'abc123_def456.zip' } }
    )

    // the posted FileResource carries the sanitized name as `filename`
    expect(axiosInstance.post).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/import/eservices`,
      {
        filename: 'abc123_def456.zip',
        url: presignedUrl.url,
      }
    )
  })

  it('leaves an already-clean file name unchanged on both calls', async () => {
    const eserviceFile = new File(['content'], 'abc123_def456.zip')

    await EServiceServices.importVersion({ eserviceFile })

    expect(axiosInstance.get).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/import/eservices/presignedUrl`,
      { params: { fileName: 'abc123_def456.zip' } }
    )
    expect(axiosInstance.post).toHaveBeenCalledWith(
      `${BACKEND_FOR_FRONTEND_URL}/import/eservices`,
      {
        filename: 'abc123_def456.zip',
        url: presignedUrl.url,
      }
    )
  })
})
