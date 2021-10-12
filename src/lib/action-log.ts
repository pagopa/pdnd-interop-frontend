import { DISPLAY_LOGS } from './constants'

export function logAction(actionLabel: string, data: any) {
  if (DISPLAY_LOGS) {
    console.log(actionLabel, data)
  }
}

export function logError(error: any) {
  // console.log(error.name)
  // console.log(error.message)
  // console.log(error.stack)
  console.error(error)
}
