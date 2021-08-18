import { LOGS } from './constants'

export function logAction(actionLabel: string, type: string, data: any) {
  if (LOGS.SHOULD_DISPLAY && (LOGS.DISPLAY_TYPE === 'all' || LOGS.DISPLAY_TYPE.includes(type))) {
    console.log(actionLabel, data)
  }
}
