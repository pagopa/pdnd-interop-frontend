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

export function isToday(date: Date | null) {
  if (!date) return false

  const todayDate = new Date()

  return (
    date &&
    date.getDate() === todayDate.getDate() &&
    date.getMonth() === todayDate.getMonth() &&
    date.getFullYear() === todayDate.getFullYear()
  )
}
