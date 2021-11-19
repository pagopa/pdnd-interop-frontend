import { DISPLAY_LOGS } from './constants'

export function logAction(actionLabel: string, data: unknown) {
  if (DISPLAY_LOGS) {
    console.log(actionLabel, data)
  }
}

export function logError(error: unknown) {
  // console.log(error.name)
  // console.log(error.message)
  // console.log(error.stack)
  console.error(error)
}
