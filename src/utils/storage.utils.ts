type StorageValue = string | number | Record<string, unknown>
export type StorageValueType = 'string' | 'number' | 'object'

export function storageDelete(key: string) {
  window.localStorage.removeItem(key)
}

export function storageWrite(key: string, value: StorageValue, type: StorageValueType) {
  const stringifyFn: Record<StorageValueType, () => string> = {
    string: () => value as string,
    number: () => String(value),
    object: () => JSON.stringify(value),
  }

  const stringified = stringifyFn[type]()

  window.localStorage.setItem(key, stringified)
}

export function storageRead(key: string, type: StorageValueType) {
  const value: string | null = window.localStorage.getItem(key)

  if (value === null) {
    return
  }

  const parseFn = {
    string: () => value,
    number: () => Number(value),
    object: () => JSON.parse(value),
  }

  return parseFn[type]()
}
