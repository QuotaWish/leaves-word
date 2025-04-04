import { SignMode } from '..'
import { type LeafWordData } from '../..'

export interface IComprehensiveWordItem {
  mainWord: LeafWordData
  options: LeafWordData[]

  type: 'new' | 'review'
  wrongHistory: number[]
}


export class ComprehensiveMode extends SignMode {
  getModeIcon(): string {
    return '👁️'
  }

  getModeDesc() {
    return '采用图片、音频、拼写进行综合学习'
  }

  getModeName() {
    return '综合沉浸'
  }

  getMainColor(): string {
    return '#0078d4'
  }

  prepareWords() {
    return new ComprehensivePrepareWord(this)
  }

  getEstimateCost(amount: number): number {
    return Math.max(Math.ceil(amount / 7), 1)
  }
}
