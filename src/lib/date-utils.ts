export function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export function formatDate(date: Date) {
  const config = new Intl.DateTimeFormat('it', { day: '2-digit', month: 'long', year: 'numeric' })
  return config.format(date)
}

export function minutesToHHMMSS(minutes: number) {
  return new Date(minutes * 60 * 1000).toISOString().substr(11, 8)
}
