import type { EnglishWord } from '~/composables/api/clients/globals'
import type { WordContent } from '~/composables/api/types'

export interface IWordData {
  word: string
  learnedTime: number
}

export class EnglishWordData implements EnglishWord {
  content: WordContent

  ai_score?: number
  create_time?: string
  id?: number
  info?: string
  is_delete?: number
  manual_score?: number
  reviewer?: number
  status?: string
  update_time?: string
  word_head?: string

  constructor(data: EnglishWord) {
    Object.assign(this, data)

    this.content = JSON.parse(data.info || '{}')
  }
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

    return this
  }
}
