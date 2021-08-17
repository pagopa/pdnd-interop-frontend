export function includesAny(stringToTest: string, match: string[]) {
  return match.some((m) => stringToTest.includes(m))
}
