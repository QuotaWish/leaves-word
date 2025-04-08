import type { LeafDict } from './dict'
import { LeafWordData } from './word'

type IStorageData = any

export interface IStorage {
  data: IStorageData

  /** 设置单词已学习 */
  setLearned: (word: string) => void

  /** 设置单词未学习 */
  setUnlearned: (word: string) => void

  /** 获取单词是否已学习 */
  getLearned: (word: string) => boolean

  /** 获取已学习单词 */
  getLearnedWords: () => LeafWordData[]

  /** 获取未学习单词 */
  getUnlearnedWords: () => LeafWordData[]

  /** 获取所有单词 */
  getAllWords: () => LeafWordData[]
}

export class LeafDictStorage implements IStorage {
  dict: LeafDict
  data: LeafWordData[]

  constructor(dict: LeafDict) {
    this.dict = dict

    this.data = useLocalStorage<LeafWordData[]>(`word-data-${dict.id}`, []) as unknown as LeafWordData[]
  }

  dataContainsWord(word: string) {
    if (!this.data)
      this.data = []

    return this.data.some(item => item.word === word)
  }

  setLearned(word: string) {
    if (this.dataContainsWord(word))
      return

    this.data.push(new LeafWordData(word))
  }

  setUnlearned(word: string) {
    this.data = this.data.filter(item => item.word !== word)
  }

  getLearned(word: string) {
    return this.dataContainsWord(word)
  }

  getLearnedWords() {
    return JSON.parse(JSON.stringify(this.data))
  }

  getUnlearnedWords() {
    const totalWords = this.getAllWords()
    const learnedWords = this.getLearnedWords()

    return totalWords.filter((item: LeafWordData) => !learnedWords.map((item: LeafWordData) => item.word).includes(item.word))
  }

  getAllWords() {
    return []
  }
}
