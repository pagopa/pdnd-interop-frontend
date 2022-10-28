/*
 * Numbers
 */
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

/*
 * Dates
 */
export function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export function formatDate(date: Date) {
  const config = new Intl.DateTimeFormat('it', { day: '2-digit', month: 'long', year: 'numeric' })
  return config.format(date)
}

export function formatDateString(dateString: string) {
  return formatDate(new Date(dateString))
}

export function secondsToHoursMinutes(totalSeconds: number) {
  const totalMinutes = totalSeconds / 60
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return { hours, minutes }
}

export function minutesToSeconds(minutes: number) {
  return minutes * 60
}

export function secondsToMinutes(seconds: number) {
  return seconds / 60
}
