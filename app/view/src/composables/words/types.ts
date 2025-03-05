import { DictStorage } from './storage'
import type { IWord } from '.'
import { ModeType } from './mode'

export interface IDict {
  id: string
  name: string
  type: 'English'
  style: {
    color: string
    colorLight: string
    icon: string
  }
  words: IWord[]
  storage: DictStorage
}

export class Dictionary implements IDict {
  id: string
  name: string
  type: 'English'
  style: {
    color: string
    colorLight: string
    icon: string
  }

  words: IWord[]
  storage: DictStorage

  constructor(id: string, name: string, words: IWord[], style: IDict['style']) {
    this.id = id
    this.name = name
    this.type = 'English'
    this.style = style
    this.words = words

    this.storage = new DictStorage(this)
  }
}

export interface IStatistics<T extends Record<string, any>> {
  startTime: number
  endTime: number
  cost: number
  data: T
  type: keyof typeof ModeType

  addData(data: keyof T, value: T[keyof T]): void
  removeData(data: keyof T): void
  clearData(): void
  getStatistics(): T
  getData(data: keyof T): T[keyof T] | undefined
  getDataDefault(data: keyof T, defaultValue: T[keyof T]): NonNullable<T[keyof T]>

  getCost(): number
  getCostString(): string

  getDisplayComponent(): Component
}

export abstract class Statistics<T extends Record<string, any>> implements IStatistics<T> {
  startTime: number
  endTime: number
  cost: number
  data: T
  type: keyof typeof ModeType

  // storage: CalendarData

  constructor(/* storage: CalendarData, */ type: keyof typeof ModeType, startTime: number, endTime: number, cost: number, data: T) {
    // this.storage = storage
    this.type = type
    this.startTime = startTime
    this.endTime = endTime
    this.cost = cost
    this.data = data
  }

  addData<K extends keyof T>(data: K, value: T[K]): void {
    this.data[data] = value
  }

  removeData(data: keyof T): void {
    delete this.data[data]
  }

  clearData(): void {
    this.data = {} as T
  }

  getStatistics(): T {
    return this.data
  }

  getData<K extends keyof T>(data: K): T[K] | undefined {
    if (data in this.data) {
      return this.data[data]
    }

    return undefined
  }

  getDataDefault<K extends keyof T, D extends T[K]>(data: K, defaultValue: D): NonNullable<T[K] | D> {
    return this.data[data] ?? defaultValue
  }

  getCost(): number {
    return this.endTime - this.startTime
  }

  getCostString(): string {
    const hours = Math.floor(this.cost / 3600)
    const minutes = Math.floor((this.cost % 3600) / 60)
    const seconds = this.cost % 60
    return `${hours}:${minutes}:${seconds}`
  }

  abstract getDisplayComponent(): Component
}