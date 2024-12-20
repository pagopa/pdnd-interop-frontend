import { useLoadingOverlay, useToastNotification } from '@/stores'

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
  service: (args: T) => Promise<File | string | { file: File; filename: string }>,
  labels: {
    errorToastLabel?: string
    successToastLabel?: string
    loadingLabel: string
  }
) {
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { showToast } = useToastNotification()

  return async (
    args: T,
    filename?: string,
    config?: {
      onSuccess?: () => void
      onError?: (error: unknown) => void
    }
  ) => {
    showOverlay(labels.loadingLabel)
    try {
      const data = await service(args)

      /**
       * The service can return either a file or an object with a file and a filename
       * If it's an object, we'll use the filename from the object
       * Otherwise, we'll use the filename passed as an argument
       */
      if (typeof data === 'object' && 'file' in data && 'filename' in data) {
        downloadFile(data.file, data.filename)
      } else {
        downloadFile(data, filename)
      }
      labels.successToastLabel && showToast(labels.successToastLabel, 'success')
      config?.onSuccess?.()
    } catch (error) {
      console.error(error)
      labels.errorToastLabel && showToast(labels.errorToastLabel, 'error')
      config?.onError?.(error)
    } finally {
      hideOverlay()
    }
  }
}
