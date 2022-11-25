/*
 * Numbers
 */
const numFormatter = new Intl.NumberFormat('it-IT')
export function formatThousands(num: number) {
  return numFormatter.format(num)
}

/*
 * Dates
 */
export function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const dateFormatter = new Intl.DateTimeFormat('it', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})
export function formatDate(date: Date) {
  return dateFormatter.format(date)
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
