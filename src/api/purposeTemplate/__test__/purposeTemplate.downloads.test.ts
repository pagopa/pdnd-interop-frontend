import { vi } from 'vitest'
import { PurposeTemplateDownloads } from '../purposeTemplate.downloads'
import { PurposeTemplateServices } from '../purposeTemplate.services'
import { useDownloadFile } from '../../hooks'

vi.mock('../purposeTemplate.services', () => ({
  PurposeTemplateServices: {
    getRiskAnalysisTemplateAnswerAnnotationDocument: vi.fn(),
    downloadDocumentFromAnnotation: vi.fn(),
  },
}))

vi.mock('../../hooks', () => ({
  useDownloadFile: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string, options?: { keyPrefix?: string }) => {
    const keyPrefix = options?.keyPrefix || ''
    return {
      t: (key: string) => {
        if (ns === 'mutations-feedback' && keyPrefix === 'purposeTemplate.downloadDocument') {
          return `mutations-feedback:purposeTemplate.downloadDocument.${key}`
        }
        return key
      },
    }
  },
}))

describe('PurposeTemplateDownloads', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useDownloadDocument', () => {
    it('should call useDownloadFile with correct service and labels', () => {
      const mockUseDownloadFile = vi.fn().mockReturnValue(vi.fn())
      vi.mocked(useDownloadFile).mockImplementation(mockUseDownloadFile)

      PurposeTemplateDownloads.useDownloadDocument()

      expect(useDownloadFile).toHaveBeenCalledWith(
        PurposeTemplateServices.getRiskAnalysisTemplateAnswerAnnotationDocument,
        {
          errorToastLabel: 'mutations-feedback:purposeTemplate.downloadDocument.outcome.error',
          loadingLabel: 'mutations-feedback:purposeTemplate.downloadDocument.loading',
        }
      )
    })

    it('should return the function from useDownloadFile', () => {
      const mockDownloadFn = vi.fn()
      vi.mocked(useDownloadFile).mockReturnValue(mockDownloadFn)

      const result = PurposeTemplateDownloads.useDownloadDocument()

      expect(result).toBe(mockDownloadFn)
    })
  })

  describe('useDownloadAnnotationDocument', () => {
    it('should call useDownloadFile with correct service and labels', () => {
      const mockUseDownloadFile = vi.fn().mockReturnValue(vi.fn())
      vi.mocked(useDownloadFile).mockImplementation(mockUseDownloadFile)

      PurposeTemplateDownloads.useDownloadAnnotationDocument()

      expect(useDownloadFile).toHaveBeenCalledWith(
        PurposeTemplateServices.downloadDocumentFromAnnotation,
        {
          errorToastLabel: 'mutations-feedback:purposeTemplate.downloadDocument.outcome.error',
          loadingLabel: 'mutations-feedback:purposeTemplate.downloadDocument.loading',
        }
      )
    })

    it('should return the function from useDownloadFile', () => {
      const mockDownloadFn = vi.fn()
      vi.mocked(useDownloadFile).mockReturnValue(mockDownloadFn)

      const result = PurposeTemplateDownloads.useDownloadAnnotationDocument()

      expect(result).toBe(mockDownloadFn)
    })
  })
})
