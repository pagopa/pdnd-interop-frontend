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
  config: { errorToastLabel?: string; successToastLabel?: string; loadingLabel: string }
) {
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { showToast } = useToastNotification()

  return async (args: T, filename?: string) => {
    showOverlay(config.loadingLabel)
    try {
      const data = await service(args)

      if (typeof data === 'object') {
        downloadFile(data.file, data.filename)
      } else {
        downloadFile(data, filename)
      }

      config.successToastLabel && showToast(config.successToastLabel, 'success')
    } catch (error) {
      console.error(error)
      config.errorToastLabel && showToast(config.errorToastLabel, 'error')
    } finally {
      hideOverlay()
    }
  }
}
