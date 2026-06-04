const numFormatter = new Intl.NumberFormat('it-IT')
export function formatThousands(num: number) {
  return numFormatter.format(num)
}

const dateFormatter = new Intl.DateTimeFormat('it', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})
export function formatDateString(dateString: string) {
  return dateFormatter.format(new Date(dateString))
}

const dateFormatterNumeric = new Intl.DateTimeFormat('it', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})
export function formatDateStringNumeric(date: Date | string) {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateFormatterNumeric.format(dateObj)
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
