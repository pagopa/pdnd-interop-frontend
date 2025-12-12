import differenceInHours from 'date-fns/differenceInHours'

export type BannerData = {
  start: { date: string; time: string }
  end: { date: string; time: string }
}

export type BannerDurationType = 'hours' | 'days'

const DATE_FORMATTERS = {
  hours: new Intl.DateTimeFormat('it', {
    day: '2-digit',
    month: '2-digit',
  }),
  days: new Intl.DateTimeFormat('it', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }),
} as const

const SINGLE_DAY_THRESHOLD_HOURS = 24

export function formatBannerDate(dateString: string | undefined, type: BannerDurationType): string {
  if (!dateString) return ''
  return DATE_FORMATTERS[type].format(new Date(dateString))
}

export function getBannerDurationType(durationInHours: number): BannerDurationType {
  return durationInHours <= SINGLE_DAY_THRESHOLD_HOURS ? 'hours' : 'days'
}

export function calculateBannerDuration(startTimestamp: number, endTimestamp: number): number {
  return differenceInHours(endTimestamp, startTimestamp)
}

function parseBannerDateTime(date: string, time: string): number {
  return Date.parse(`${date} ${time}`)
}

export function getBannerTimestamps(data: BannerData | undefined) {
  if (!data?.start || !data?.end) {
    return null
  }

  const startString = `${data.start.date} ${data.start.time}`
  const endString = `${data.end.date} ${data.end.time}`
  const startTimestamp = parseBannerDateTime(data.start.date, data.start.time)
  const endTimestamp = parseBannerDateTime(data.end.date, data.end.time)

  return {
    startString,
    endString,
    startTimestamp,
    endTimestamp,
  }
}
