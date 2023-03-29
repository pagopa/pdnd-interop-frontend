import { useLoadingOverlay, useToastNotification } from '@/stores'
import { downloadFile } from './react-query-wrappers.utils'

export function useDownloadFile<T = unknown[]>(
  service: (args: T) => Promise<File | string>,
  config: { errorToastLabel?: string; loadingLabel: string }
) {
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { showToast } = useToastNotification()

  return async (args: T, filename?: string) => {
    showOverlay(config.loadingLabel)
    try {
      const data = await service(args)
      downloadFile(data, filename)
    } catch (error) {
      console.error(error)
      config.errorToastLabel && showToast(config.errorToastLabel, 'error')
    } finally {
      hideOverlay()
    }
  }
}
