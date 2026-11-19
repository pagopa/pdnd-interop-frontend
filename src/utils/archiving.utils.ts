import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

type ArchivingRelativeDate =
  | { kind: 'pastDue' }
  | { kind: 'today' }
  | { kind: 'inDays'; count: number }

/** Calendar-day distance in the user's local timezone between now and the archiving date. */
export function getArchivingRelativeDate(
  archivableOn: string,
  now: Date = new Date()
): ArchivingRelativeDate | undefined {
  const date = new Date(archivableOn)
  if (Number.isNaN(date.getTime())) return undefined
  const count = differenceInCalendarDays(date, now)
  if (count < 0) return { kind: 'pastDue' }
  if (count === 0) return { kind: 'today' }
  return { kind: 'inDays', count }
}
