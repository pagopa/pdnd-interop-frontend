// TEMP REFACTOR: highly inefficient, there's probably a better way do to it
export function formatThousands(num: number) {
  const numAsString = num.toString()

  if (numAsString.length < 4) {
    return numAsString // no dots to add
  }

  // Reverse number so that we start counting from the end of it
  const reversed = numAsString.split('').reverse().join('')
  const groupsOfThree = /.{1,3}/g
  const reversedBits = reversed.match(groupsOfThree)
  // Add one dot every group of three
  const reversedFormatted = (reversedBits as RegExpMatchArray).join('.')
  // Reverse back
  const formatted = reversedFormatted.split('').reverse().join('')

  return formatted
}
