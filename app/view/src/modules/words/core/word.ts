import cet4 from '../../../composables/words/cet4'
import cet6 from '../../../composables/words/cet6'
import high from '../../../composables/words/high'
import ielts from '../../../composables/words/ielts'
import { modeManager, ModeType } from './mode/index'
import postGraduate from '../../../composables/words/post-graduate'
import type { IDict, Statistics } from './types'

export * from './types'
export * from './util'
``
export interface IWord {
  word: string
  img: string[]
  content: string
  translation: any
  examples: {
    sentence: string
    translation: string
    addon: string
    highlight: string
  }[]
  synonyms: {
    word: string
    translation: string
  }[]
  derived: {
    word: string
    translation: string
  }[]
  antonyms: {
    word: string
    translation: string
  }[]
  definition: any
  type: string[]
  story: string
  backgroundStory: string
  phonetic: {
    aloud: string // 英音
    sound: string // 美音
  }
  phrases: {
    phrase: string
    example: string
    translation: string
    usage: string
  }[]
  prefix: string
  suffix: string
  remember: string
  transform: {
    word: string
    single: string
    multiple: string
    tense: string
    translation: string
  }[]
}

export interface IWordItem {
  mainWord: IWord
  options: IWord[]

  // Choose other options
  wrongHistory: number[]
}

export interface IGlobalData {
  dict: string
  mode: keyof typeof ModeType
  amount: number
}

const obj: IGlobalData = {
  dict: 'CET-4',
  mode: 'COMPREHENSIVE',
  amount: 10,
}

export const dictionaries = reactive<IDict[]>([
  high,
  cet4,
  cet6,
  postGraduate,
  ielts,
])

export interface ISignData<S extends Statistics<any>> {
  day: number
  date: number
  words: string[]
  cost: number
  done: boolean
  statistics?: S
}

export interface ICalendarData<S extends Statistics<any>> {
  year: number
  month: number

  day: string

  data: ISignData<S>[]

  // statistics?: IStatistics<any>

  addData(data: ISignData<S>): void
  addDayData(day: number, data: ISignData<S>): void

  createSignData(words: string[], cost: number, done: boolean): ISignData<S>
}

export class CalendarData<S extends Statistics<any>> implements ICalendarData<S> {
  year: number
  month: number

  day: string

  data: ISignData<S>[] = []

  // statistics?: S

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

  static fromData<S extends Statistics<any>>(data: CalendarData<S>) {
    const calendar = new CalendarData(data.year, data.month, data.day)

    calendar.data = data.data
    // calendar.statistics = data.statistics

    return calendar
  }
}
if (localStorage.getItem('calendarData') === '{}')
  localStorage.removeItem('calendarData')

export const globalData = useLocalStorage<IGlobalData>('globalData', JSON.parse(JSON.stringify(obj)))
export const calendarData = useLocalStorage<CalendarData<Statistics<any>>[]>('calendarData', [])

export const useTargetData = createGlobalState(() => {
  const targetDict = computed(() => dictionaries.find(item => item.id === globalData.value.dict) || dictionaries[0])
  const targetMode = computed(() => {
    const manager = [...(modeManager?.keys?.() || [])]
    const result = manager?.find(item => item === globalData.value.mode)

    if (!result)
      return manager?.[0] || ModeType.COMPREHENSIVE

    return result
  })
  const targetSignMode = computed(() => {
    const manager = modeManager.get(targetMode.value!)!
    const managerIns = manager(targetDict.value.storage)

    return managerIns
  })

  return {
    targetDict,
    targetMode,
    targetSignMode,
  }
})

export class CalendarManager {
  createTodayData<S extends Statistics<any>>(words: string[], cost: number, done: boolean) {
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
    // const days = calendar.day.split('')

    // while (days.length < day) {
    //   days.push('0')
    // }

    // days[day] = '1'

    // calendar.day = days.join('')

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

  getDayData<S extends Statistics<any>>(year: number, month: number, day: number) {
    const _data = calendarData.value.find(item => item.year === year && item.month === month)

    if (!_data)
      return null

    const data = _data as CalendarData<S>

    const dayData = data.day
    const days = dayData.split('')

    return {
      signed: days?.[day] === '1',
      dataList: data.data,
      data: data.data.find(item => item.day === day),
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
