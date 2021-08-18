import { DISPLAY_LOGS } from './constants'

export function logAction(action: string, data: any) {
  if (DISPLAY_LOGS) {
    console.log(action, data)
  }
}
