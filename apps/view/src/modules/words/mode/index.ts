import type { LeafDictStorage } from '..'
import type { ModeIdentifier } from '../core/enums'
import type { CalendarData } from '../core/feat/calendar'
import type { Statistics } from '../core/feat/stats'
import { calendarManager } from '../core/feat/calendar'

export abstract class LeafPrepareSign<T, W, S extends Statistics<object>> {
  mode: T
  wordsQueue: Array<W>

  wordIndex = -1
  taskAmount = 0

  startTime = 0
  endTime = 0

  calendarData?: CalendarData<S> = undefined
  statistics?: S = undefined

  constructor(mode: T) {
    this.mode = mode
    this.wordsQueue = []

    this.onCreated()
    this.calendarData = calendarManager.createTodayData([], 0, false) as CalendarData<S>
    this.statistics = this.getStatistics()
  }

  abstract onCreated(): void
  abstract getTargetComponent(): Component
  abstract getStatistics(): S

  abstract preload(callback: (progress: number) => void): Promise<boolean>

  abstract next(success: boolean): Promise<boolean>
  abstract previous(): Promise<boolean>
  abstract finish(): Promise<boolean>

  abstract getLeftWords(): number

  get currentWord() {
    if (!this.wordsQueue.length)
      return null
    if (this.wordIndex < 0)
      return null

    return this.wordsQueue[this.wordIndex]
  }

  async loadImage(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }
}

export abstract class SignMode {
  dictionaryStorage: LeafDictStorage

  abstract getModeName(): string
  abstract getModeIcon(): string
  abstract getModeDesc(): string
  abstract getMainColor(): string
  // abstract randomWord(): IWord
  abstract prepareWords(): LeafPrepareSign<SignMode, any, Statistics<object>>

  /**
   * Unit: minute
   */
  abstract getEstimateCost(amount: number): number

  constructor(dictionaryStorage: LeafDictStorage) {
    this.dictionaryStorage = dictionaryStorage
  }
}

export const modeManager = new Map<ModeIdentifier, (dictionaryStorage: LeafDictStorage) => SignMode>()
