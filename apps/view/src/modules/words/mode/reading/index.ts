import type { LeafWordData } from '../..'
import { SignMode } from '..'
import { ReadingPrepareWord } from './prepare'

export * from './prepare'

export interface IReadingWordItem {
  mainWord: LeafWordData
  options: LeafWordData[]

  type: 'new' | 'review'
  wrongHistory: number[]
}

export class ReadingMode extends SignMode {
  getModeIcon(): string {
    return '📖'
  }

  getModeDesc() {
    return '通过阅读与分析单词的语境和用法进行学习'
  }

  getModeName() {
    return '阅读分析'
  }

  getMainColor(): string {
    return '#7e57c2'
  }

  prepareWords() {
    return new ReadingPrepareWord(this)
  }

  getEstimateCost(amount: number): number {
    return Math.max(Math.ceil(amount / 7), 1)
  }
}