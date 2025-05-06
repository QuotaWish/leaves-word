import type { ISignData } from './sign'
import type { Statistics } from './stats'

export const calendarData = useLocalStorage<CalendarData<Statistics<object>>[]>('calendar-data', [])

export class CalendarManager {
  createTodayData<S extends Statistics<object>>(words: string[], cost: number, done: boolean) {
    let calendar = this.getTodayData()?.origin

    const [year, month, day] = this.getToday()
    if (!calendar) {
      calendar = new CalendarData<S>(year, month, '')

      calendarData.value.push(calendar)
    }
    else {
      calendar = reactive(CalendarData.fromData(calendar))
    }

    const data = calendar.createSignData(words, cost, done)

    calendar.data.push(data)

    calendar.signDay(day)

    return calendar
  }

  getTodayData() {
    return this.getDayData(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  }

  isTodaySigned() {
    return this.getTodayData()?.signed
  }

  isDaySigned(year: number, month: number, day: number) {
    return this.getDayData(year, month, day)?.signed
  }

  getDayData(year: number, month: number, day: number) {
    const _data = calendarData.value.find(item => item.year === year && item.month === month)

    if (!_data)
      return null

    const data = _data as CalendarData<Statistics<object>>

    const dayData = data.day
    const days = dayData.split('')

    const todayInnerData = data.data.find(item => item.day === day)

    return {
      // TODO 暂时这样 后续交给后端判断
      signed: days?.[day] === '1' && todayInnerData?.done,
      dataList: data.data,
      data: todayInnerData,
      origin: data,
    }
  }

  getToday() {
    return [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]
  }

  clear() {
    calendarData.value = []
  }
}

export const calendarManager = new CalendarManager()

export class CalendarData<S extends Statistics<object>> {
  year: number
  month: number

  day: string
  data: ISignData<S>[] = []

  constructor(year: number, month: number, day: string) {
    this.year = year
    this.month = month
    this.day = day
  }

  addData(data: ISignData<S>): void {
    this.data.push(data)
  }

  addDayData(day: number, data: ISignData<S>): void {
    const targetData = this.data.find(item => item.day === day)

    if (targetData) {
      Object.assign(targetData, data)
    } else {
      this.addData(data)
    }
  }

  createSignData(words: string[], cost: number, done: boolean): ISignData<S> {
    const [, , day] = calendarManager.getToday()

    const data: ISignData<S> = {
      day,
      date: Date.now(),
      words,
      cost,
      done,
    }

    return data
  }

  signDay(day: number) {
    const days = this.day.split('')

    while (days.length < day) {
      days.push('0')
    }

    days[day] = '1'

    this.day = days.join('')
  }

  signToday() {
    const [, , day] = calendarManager.getToday()

    this.signDay(day)
  }

  static fromData<S extends Statistics<object>>(data: CalendarData<S>) {
    const calendar = new CalendarData(data.year, data.month, data.day)

    calendar.data = data.data

    return calendar
  }
}

if (localStorage.getItem('calendar-data') === '{}')
  localStorage.removeItem('calendar-data')
