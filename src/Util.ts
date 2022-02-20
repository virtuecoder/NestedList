export const isProd = process.env.NODE_ENV == 'production'
console.log(isProd)

export function getWeek (date: Date) {
  date.setHours(0, 0, 0, 0)
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4)
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 -
    3 + (week1.getDay() + 6) % 7) / 7)
}

/** Returns object containing (d)ay, (w)eek, (m)onth, (y)ear of the given date */
export function getDWMY (time: number) {
  const date = new Date(time)
  const d = date.getDate()
  const w = getWeek(date)
  const m = date.getMonth()
  const y = date.getFullYear()
  return { d, w, m, y }
}

export function formatDuration (duration: number) {
  const h = Math.floor(duration / 3600_000)
  const m = Math.floor((duration - h * 3600_000) / 60_000)
  const s = Math.floor((duration - h * 3600_000 - m * 60_000) / 1000)
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function formatTimeDurationMinutes (ms: number) {
  return new Date(ms).toISOString().substr(11, 5) //.replace(/^[0:]+/, '')
}
