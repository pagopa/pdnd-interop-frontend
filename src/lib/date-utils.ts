export function getRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

export function formatDate(date: Date) {
  const config = new Intl.DateTimeFormat('it', { day: '2-digit', month: 'long', year: 'numeric' })
  return config.format(date)
}
