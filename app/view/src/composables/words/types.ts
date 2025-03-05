import { DictStorage } from './storage'
import type { CalendarData, IWord, IWordItem } from '.'

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

  addData(data: keyof T, value: T[keyof T]): void
  removeData(data: keyof T): void
  clearData(): void
  getStatistics(): T
  getData(data: keyof T): T[keyof T]
  getDataDefault(data: keyof T, defaultValue: T[keyof T]): T[keyof T]

  getCost(): number
  getCostString(): string
}

export class Statistics<T extends Record<string, any>> implements IStatistics<T> {
  startTime: number
  endTime: number
  cost: number
  data: T

  storage: CalendarData

  constructor(storage: CalendarData, startTime: number, endTime: number, cost: number, data: T) {
    this.storage = storage
    this.startTime = startTime
    this.endTime = endTime
    this.cost = cost
    this.data = data
  }

  addData(data: keyof T, value: T[keyof T]): void {
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

  getData(data: keyof T): T[keyof T] {
    return this.data[data]
  }

  getDataDefault(data: keyof T, defaultValue: T[keyof T]): T[keyof T] {
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
}