import type { EnglishWord } from '~/composables/api/clients/globals'
import type { WordContent } from '~/composables/api/types'

export interface IWordData {
  word: string
  learnedTime: number
}

export interface EnglishWordData extends EnglishWord {
  content: WordContent
}

export class LeafWordData {
  word: string
  data?: EnglishWordData
  learnedTime: number

  constructor(word: string) {
    this.word = word
    this.learnedTime = Date.now()
  }

  setData(data: EnglishWordData) {
    this.data = data
  }
}
