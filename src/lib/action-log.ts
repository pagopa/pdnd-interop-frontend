import { SingleLogType } from '../../types'
import { DISPLAY_LOGS } from './constants'

export function logAction(actionLabel: string, type: SingleLogType, data: any) {
  if (!DISPLAY_LOGS) {
    return
  }

  const showAllLogs = DISPLAY_LOGS === 'all'
  const showThisLogType = Array.isArray(DISPLAY_LOGS) && DISPLAY_LOGS.includes(type)

  if (showAllLogs || showThisLogType) {
    console.log(actionLabel, data)
  }
}
