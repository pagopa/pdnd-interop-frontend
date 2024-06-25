import { useLoadingOverlay, useToastNotification } from '@/stores'
import type { FileResource } from '../api.generatedTypes'

export function downloadFile(responseData: File | string, filename = 'download') {
  const blob = new Blob([responseData], { type: 'application/octet-stream' })
  // Create a pointer to the local memory where the blob is temporarily stored
  const href = window.URL.createObjectURL(blob)
  // Create link to append to the DOM, it will be clicked programmatically
  // to initiate file download
  const link = document.createElement('a')
  link.setAttribute('download', filename)
  // Set the link href to the local memory pointer
  link.setAttribute('href', href)
  document.body.appendChild(link)
  link.click()
  // Remove link
  document.body.removeChild(link)
  // Release memory
  URL.revokeObjectURL(link.href)
}

export function useDownloadFile<T = unknown[]>(
  service: (args: T) => Promise<File | string>,
  config: { errorToastLabel?: string; successToastLabel?: string; loadingLabel: string }
) {
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { showToast } = useToastNotification()

  return async (args: T, filename?: string) => {
    showOverlay(config.loadingLabel)
    try {
      const data = await service(args)
      downloadFile(data, filename)
      config.successToastLabel && showToast(config.successToastLabel, 'success')
    } catch (error) {
      console.error(error)
      config.errorToastLabel && showToast(config.errorToastLabel, 'error')
    } finally {
      hideOverlay()
    }
  }
}

/**
 * Downloads a file resource using the provided service function.
 *
 * It is intended for use with service functions that return a FileResource object.
 * This way we can avoid modifying the useDownloadFile function by adding a type check on the service response.
 */
export function useDownloadFileResource<T = unknown[]>(
  service: (args: T) => Promise<FileResource>,
  config: { errorToastLabel?: string; successToastLabel?: string; loadingLabel: string }
) {
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { showToast } = useToastNotification()

  return async (args: T) => {
    showOverlay(config.loadingLabel)
    try {
      const data = await service(args)
      console.log('data', data)
      downloadFile(data.url, data.filename)
      config.successToastLabel && showToast(config.successToastLabel, 'success')
    } catch (error) {
      console.error(error)
      config.errorToastLabel && showToast(config.errorToastLabel, 'error')
    } finally {
      hideOverlay()
    }
  }
}
