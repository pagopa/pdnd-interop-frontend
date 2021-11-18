export const getKeys = Object.keys as <T extends Record<string, unknown>>(obj: T) => Array<keyof T>
