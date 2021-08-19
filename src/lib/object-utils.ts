export function objectIsEmpty(obj: any) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}
