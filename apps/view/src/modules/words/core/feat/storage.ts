import type { Dictionary, IWord, IWordItem } from '.'

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
  getLearnedWords: () => IWord[]

  /** 获取未学习单词 */
  getUnlearnedWords: () => IWord[]

  /** 获取所有单词 */
  getAllWords: () => IWord[]
}

export interface IWordData {
  word: string
  learnedTime: number
}

export class WordData {
  word: string
  learnedTime: number

  constructor(word: string) {
    this.word = word
    this.learnedTime = Date.now()
  }
}

export class DictStorage implements IStorage {
  dict: Dictionary
  data: WordData[]

  constructor(dict: Dictionary) {
    this.dict = dict

    this.data = useLocalStorage<WordData[]>(`word-data-${dict.id}`, []) as unknown as WordData[]
  }

  randomUnlearnedWordsWithOptiohns(): IWordItem {
    const totalWords = [...this.getAllWords()]
    const unlearnedWords = [...this.getUnlearnedWords()]

    const randomIndex = Math.floor(Math.random() * unlearnedWords.length)
    const mainWord = unlearnedWords[randomIndex]

    const options: IWord[] = []
    while (options.length < 3) {
      const randomIndex = Math.floor(Math.random() * totalWords.length)
      const selectWord = totalWords[randomIndex]

      if (options.includes(selectWord) || mainWord.word === selectWord.word)
        continue

      options.push(selectWord)

      totalWords.splice(randomIndex, 1)
    }

    return { mainWord, options, wrongHistory: [] }
  }

  dataContainsWord(word: string) {
    if (!this.data)
      this.data = []

    return this.data.some(item => item.word === word)
  }

  setLearned(word: string) {
    if (this.dataContainsWord(word))
      return

    this.data.push(new WordData(word))

    console.log('cur', this.data)
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

    return totalWords.filter(item => !learnedWords.map((item: any) => item.word).includes(item.word))
  }

  getAllWords() {
    return this.dict.words
  }
}
