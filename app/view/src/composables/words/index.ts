import cet4 from './cet4'
import cet6 from './cet6'
import high from './high'
import ielts from './ielts'
import { modeManager, ModeType } from './mode'
import postGraduate from './post-graduate'
import type { IDict, IStatistics } from './types'

export * from './types'
export * from './util'

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
  mode: ModeType
  amount: number
}

const obj: IGlobalData = {
  dict: 'CET-4',
  mode: ModeType.COMPREHENSIVE,
  amount: 10,
}

export const dictionaries = reactive<IDict[]>([
  high,
  cet4,
  cet6,
  postGraduate,
  ielts,
])

export interface ISignData {
  day: number
  date: number
  words: string[]
  cost: number
  done: boolean
}

export interface CalendarData {
  year: number
  month: number

  day: string

  data: ISignData[]

  statistics?: IStatistics<any>
}

if (localStorage.getItem('calendarData') === '{}')
  localStorage.removeItem('calendarData')

export const globalData = useLocalStorage<IGlobalData>('globalData', JSON.parse(JSON.stringify(obj)))
export const calendarData = useLocalStorage<CalendarData[]>('calendarData', [])

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
  createTodayData(words: string[], cost: number, done: boolean) {
    let calendar: CalendarData | undefined = this.getTodayData()?.origin

    const [year, month, day] = this.getToday()
    if (!calendar) {
      calendar = reactive({
        year,
        month,
        day: '',
        data: [],
      })

      calendarData.value.push(calendar)
    }
    else {
      calendar = reactive(calendar)
    }

    const data: ISignData = {
      day,
      date: Date.now(),
      words,
      cost,
      done,
    }

    calendar.data.push(data)

    const days = calendar.day.split('')

    while (days.length < day) {
      days.push('0')
    }

    days[day] = '1'

    calendar.day = days.join('')

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
    const data = calendarData.value.find(item => item.year === year && item.month === month)

    if (!data)
      return null

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
