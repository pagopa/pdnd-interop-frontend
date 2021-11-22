export function includesAny(stringToTest: string, match: Array<string>) {
  return match.some((m) => stringToTest.includes(m))
}
