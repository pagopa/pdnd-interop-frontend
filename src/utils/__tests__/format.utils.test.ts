import {
  formatDateString,
  formatThousands,
  minutesToSeconds,
  secondsToHoursMinutes,
  secondsToMinutes,
} from '../format.utils'

describe('testing number formatter utility function', () => {
  it('should correctly format number to string', () => {
    expect(formatThousands(1000)).toBe('1.000')
    expect(formatThousands(10000)).toBe('10.000')
    expect(formatThousands(1000000)).toBe('1.000.000')
    expect(formatThousands(0.2)).toBe('0,2')
    expect(formatThousands(1000000000.4)).toBe('1.000.000.000,4')
    expect(formatThousands(9999999999.99)).toBe('9.999.999.999,99')
  })
})

describe('testing date formatter utility function', () => {
  it('should correctly format date', () => {
    expect(formatDateString('02-02-2023')).toBe('02 febbraio 2023')
    expect(formatDateString('01-01-1990')).toBe('01 gennaio 1990')
    expect(formatDateString('12-12-2012')).toBe('12 dicembre 2012')
    expect(formatDateString('01-31-2099')).toBe('31 gennaio 2099')
  })
})

describe('testing secondsToHoursMinutes utility function', () => {
  it('should correctly calculate the number of hours and minutes from the amount of seconds', () => {
    expect(secondsToHoursMinutes(120)).toEqual({
      hours: 0,
      minutes: 2,
    })

    expect(secondsToHoursMinutes(3000)).toEqual({
      hours: 0,
      minutes: 50,
    })

    expect(secondsToHoursMinutes(18000)).toEqual({
      hours: 5,
      minutes: 0,
    })
  })
})

describe('testing minutesToSeconds utility function', () => {
  it('should correctly calculate the number of seconds from the amount of minutes', () => {
    expect(minutesToSeconds(2)).toBe(120)
    expect(minutesToSeconds(50)).toBe(3000)
    expect(minutesToSeconds(9999)).toBe(599940)
  })
})

describe('testing secondsToMinutes utility function', () => {
  it('should correctly calculate the number of minutes from the amount of seconds', () => {
    expect(secondsToMinutes(120)).toBe(2)
    expect(secondsToMinutes(3000)).toBe(50)
    expect(secondsToMinutes(599940)).toBe(9999)
  })
})
