import { useLoadingOverlay, useToastNotification } from '@/contexts'
import { logger } from '@/utils/common.utils'
import { downloadFile } from './react-query-wrappers.utils'

export function useDownloadFile<T = unknown[]>(
  service: (args?: T) => Promise<string>,
  config: { errorToastLabel?: string; loadingLabel: string }
) {
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { showToast } = useToastNotification()

  return async (args?: T, filename?: string) => {
    showOverlay(config.loadingLabel)
    try {
      const data = await service(args)
      downloadFile(data, filename)
    } catch (error) {
      logger.error(error)
      config.errorToastLabel && showToast(config.errorToastLabel, 'error')
    } finally {
      hideOverlay()
    }
  }
}
