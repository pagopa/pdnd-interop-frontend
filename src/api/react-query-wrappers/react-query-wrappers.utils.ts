import { waitFor } from '@/utils/common.utils'

class ExponentialInterval {
  #action: VoidFunction
  #duration: number

  #isActive = true
  #numRetry = 1
  #totalWaitTime = 0
  #_promise: Promise<void> | undefined

  constructor(action: VoidFunction, duration: number) {
    this.#action = action
    this.#duration = duration

    this.#_promise = this.#start()
  }

  #getTimeoutMs() {
    return 2 ** (this.#numRetry + 1) * 100
  }

  async #start() {
    this.#action()
    while (this.#isActive && this.#totalWaitTime < this.#duration) {
      const timeoutMs = this.#getTimeoutMs()
      this.#totalWaitTime += timeoutMs
      await waitFor(timeoutMs)
      if (!this.#isActive) return
      this.#numRetry += 1
      this.#action()
    }
  }

  cancel() {
    this.#isActive = false
  }
}

const exponentialIntervalInstances = new Map()

export function setExponentialInterval(action: VoidFunction, duration: number) {
  const instanceId = crypto.randomUUID()
  const newInstance = new ExponentialInterval(action, duration)
  exponentialIntervalInstances.set(instanceId, newInstance)
  return instanceId
}

export function clearExponentialInterval(instanceId: string | undefined) {
  if (!instanceId) return
  const instance = exponentialIntervalInstances.get(instanceId)

  if (instance) {
    instance.cancel()
    exponentialIntervalInstances.delete(instanceId)
  }
}

export function downloadFile(responseData: string, filename = 'download') {
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
