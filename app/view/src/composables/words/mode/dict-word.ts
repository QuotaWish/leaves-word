import DictWordWord from '~/components/words/mode/ComprehensiveWord.vue'
import { PrepareWord, SignMode } from '.'
import { calendarManager, globalData, type IWord, type IWordItem, useWordSound } from '..'
import type { DictStorage } from '../storage'

// 定义常量
const PRELOAD_WORD_AMO = 5 // 提前加载的单词数量
const NEW_WORDS_PER_SESSION = 10 // 每次学习新单词的数量
const REVIEW_WORDS_PER_SESSION = 10 // 每次复习单词的数量

export interface IDictWordWordItem {
  word: IWordItem
  type: 'new' | 'review'
}

export class DictWordPrepareWord extends PrepareWord<DictWordMode, IDictWordWordItem> {
  onCreated(): void {
    const globalAmo = globalData.value.amount
    const storage = this.mode.dictionaryStorage
    const unlearedWords = storage.getUnlearnedWords()
    const amo = Math.min(globalAmo, unlearedWords.length)

    this.taskAmount = amo
  }

  wordsQueue: IDictWordWordItem[] = []
  wordsDispalyed: string[] = []
  wordsFinished: IWordItem[] = []

  amo: number = 0

  // 加载单词的图片和音频
  async preloadWordData(word: {
    mainWord: IWord
    options: IWord[]
  }) {
    const { mainWord } = word

    // 加载单词的音频
    const res = await useWordSound(mainWord.word)

    return res
  }

  // 预加载单词数据
  preload(callback: (progress: number) => void): Promise<boolean> {
    const storage = this.mode.dictionaryStorage

    // console.log('PRELOAD')

    return new Promise((resolve) => {
      const maxProgress = PRELOAD_WORD_AMO * 5 * this.taskAmount + this.taskAmount
      let progress = 0
      const words: IDictWordWordItem[] = []

      // 随机选择未学习的单词
      while (words.length < this.taskAmount) {
        const res = storage.randomUnlearnedWordsWithOptiohns()

        if (words.some(item => item.word.mainWord.word === res.mainWord.word)) {
          continue
        }

        words.push({ word: res, type: 'new' })
        progress += 1
        callback(+(progress / maxProgress).toFixed(2))
      }

      this.wordsQueue = words

      // 预加载前5个单词的数据
      const promises = words.filter((_, ind) => ind + 1 <= PRELOAD_WORD_AMO).map(async (item) => {
        const res = await this.preloadWordData(item.word)

        progress += this.taskAmount * 5

        callback(+(progress / maxProgress).toFixed(2))

        return res
      })

      Promise.all(promises).then(() => {
        this.wordIndex = 0

        this.startTime = Date.now()
        resolve(true)
      },
      )
    })
  }

  /**
   * 处理下一个单词
   * @param success - 表示当前单词是否回答正确
   * @returns Promise<boolean> - 返回一个 Promise，指示是否成功处理下一个单词
   */
  async next(success: boolean): Promise<boolean> {
    // 开始处理下一个单词
    // console.group('开始处理下一个单词')

    // 输出当前剩余单词数量
    // console.log('当前剩余单词数量:', this.getLeftWords())

    // 输出当前单词
    // console.log('当前单词:', this.currentWord)

    // 输出已显示的单词列表
    // console.log('已显示的单词列表:', this.wordsDispalyed)

    // 输出当前学习的单词数量
    // console.log('当前学习的单词数量:', this.amo)

    // 输出单词队列
    // console.log('单词队列:', this.wordsQueue)

    // 输出已完成的单词列表
    // console.log('已完成的单词列表:', this.wordsFinished)

    // 如果没有剩余单词，返回 false
    if (this.getLeftWords() === 0) {
      // console.group('没有剩余单词')
      // console.log('单词队列:', this.wordsQueue)
      // console.groupEnd()
      return false
    }

    // 如果当前单词不存在，抛出错误
    if (!this.currentWord) {
      // console.group('当前单词不存在，无法获取下一个单词')
      // console.error('当前单词不存在，无法获取下一个单词')
      // console.groupEnd()
      throw new Error('当前单词不存在，无法获取下一个单词')
    }

    const currentWord = this.currentWord

    // console.group('处理当前单词')
    // console.log('当前单词:', this.currentWord.word.mainWord.word)
    // console.groupEnd()

    // 将当前单词添加到已显示的单词列表中
    this.wordsDispalyed = [...new Set([...this.wordsDispalyed, this.currentWord!.word.mainWord.word])]

    // 如果回答正确
    if (success) {
      // console.group('回答正确')
      // console.log('当前单词:', this.currentWord!.word.mainWord.word)
      // console.groupEnd()

      if (currentWord.type === 'new') {
        // 增加已学习的单词数量
        this.amo += 1

        // 如果当前单词是复习单词，将其从复习队列中移除
        this.wordsQueue.push({ word: currentWord.word, type: 'review' })
      }
      else {
        this.wordsFinished.push(currentWord.word)

        if (this.wordsQueue.length === 1) {
          this.wordsQueue.length = 0

          return false
        }
      }
    }
    else {
      console.group('回答错误')
      console.log('当前单词:', this.currentWord.word.mainWord.word)
      console.groupEnd()

      // 将当前单词添加到复习队列中
      this.wordsQueue.push({ word: this.currentWord!.word, type: 'review' })

      const obj = this.currentWord!.word

      const history = obj.wrongHistory || []
      history.push(Date.now())

      obj.wrongHistory = history
    }

    // 从单词队列中移除当前单词
    this.wordsQueue.splice(this.wordIndex, 1)

    // 如果已学习的单词数量达到每次学习的单词数量，进行复习
    if (this.amo + 1 >= NEW_WORDS_PER_SESSION) {
      this.amo = 0

      const reviewWords: IDictWordWordItem[] = []

      this.wordsQueue.forEach((item, index) => {
        // 如果复习单词数量达到每次复习的单词数量，跳出循环
        if (reviewWords.length >= REVIEW_WORDS_PER_SESSION)
          return

        // 如果当前单词是复习单词，将其添加到复习单词列表中
        if (item.type === 'review') {
          reviewWords.push(item)
          this.wordsQueue.splice(index, 1)
        }
      })

      // while (reviewWords.length < REVIEW_WORDS_PER_SESSION && this.wordsQueue.length) {
      //   // 如果queue中没有复习单词 跳出
      //   if (this.getReviewWords() === 0) break

      //   // 从队列中取出一个复习单词
      //   const word = this.wordsQueue.pop()
      //   if ()
      // }

      // 在队列中找到所有复习单词
      // const reviewWords = this.wordsQueue.filter(item => item.type === 'review')

      // // 从queue中删除
      // this.wordsQueue = this.wordsQueue.filter(item => item.type !== 'review')

      // // 如果复习的单词过多 裁切
      // if (reviewWords.length > REVIEW_WORDS_PER_SESSION) {
      //   reviewWords.splice(REVIEW_WORDS_PER_SESSION)
      // }

      // 加到队列前面
      this.wordsQueue.unshift(...reviewWords)

      // console.log('c', this.wordsQueue, reviewWords.map(item => item.word.mainWord.word))
    }

    // console.group('更新后的单词队列')
    // console.log('单词队列:', this.wordsQueue.map(item => item.word.mainWord.word))
    // console.groupEnd()

    // console.group('复习队列')
    // console.log('复习队列:', this.wordsQueue.filter(item => item.type === 'review').map(item => item.word.mainWord.word))
    // console.groupEnd()

    // 预备加载下5个单词
    const nextIndex = this.wordIndex + PRELOAD_WORD_AMO
    if (nextIndex < this.wordsQueue.length)
      this.preloadWordData(this.wordsQueue[nextIndex].word)

    // console.group('处理下一个单词结束')
    // console.log('单词队列:', this.wordsQueue)
    // console.log('已完成的单词列表:', this.wordsFinished)
    // console.groupEnd()

    return true
  }

  // 返回上一个单词
  async previous(): Promise<boolean> {
    if (!this.currentWord)
      throw new Error('Current word not exist, cannot get previous word')

    if (this.wordIndex === 0) {
      return false
    }

    this.wordIndex--

    return true
  }

  // 完成学习
  async finish(): Promise<boolean> {
    if (this.wordsQueue.length) {
      return false
    }

    this.endTime = Date.now()

    const duration = this.endTime - this.startTime

    const words = this.wordsFinished.map(i => i.mainWord.word)

    calendarManager.createTodayData(words, duration, true)

    return true
  }

  // 获取剩余单词数量
  getLeftWords(): number {
    return this.wordsQueue.length - this.wordIndex
  }

  // 获取新学单词数量
  getNewlyWords(): number {
    return this.taskAmount - this.wordsDispalyed.length
  }

  // 获取复习单词数量
  getReviewWords(): number {
    return this.wordsQueue.filter(item => item.type === 'review').length
  }

  // 获取目标组件
  getTargetComponent(): Component {
    return DictWordWord
  }
}

export class DictWordMode extends SignMode {
  getMainColor(): string {
    return '#FF6B00'
  }

  getModeIcon(): string {
    return '🎈'
  }

  getModeDesc() {
    return '通过单词历史意义进行学习'
  }

  getModeName() {
    return '词析模式'
  }

  prepareWords() {
    return new DictWordPrepareWord(this)
  }

  getEstimateCost(amount: number): number {
    return Math.max(Math.ceil(amount / 7), 1)
  }

  constructor(dictionaryStorage: DictStorage) {
    super(dictionaryStorage)
  }
}
