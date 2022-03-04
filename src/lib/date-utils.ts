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

export function minutesToHoursMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return { hours, minutes }
}
