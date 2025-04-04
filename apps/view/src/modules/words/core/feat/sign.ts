import type { Statistics } from './stats'

export interface ISignData<S extends Statistics<object>> {
  day: number
  date: number
  words: string[]
  cost: number
  done: boolean
  statistics?: S
}
