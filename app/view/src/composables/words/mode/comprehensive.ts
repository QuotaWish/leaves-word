import ComprehensiveWord from '~/components/words/mode/comprehensive/Word.vue'
import { PrepareWord, SignMode } from '.'
import { calendarManager, globalData, IStatistics, type IWord, type IWordItem, Statistics, useWordSound } from '..'
import ComprehensiveStat from '~/components/words/mode/comprehensive/index.vue'

// 定义常量
const PRELOAD_WORD_AMO = 5 // 提前加载的单词数量
const NEW_WORDS_PER_SESSION = 10 // 每次学习新单词的数量
const REVIEW_WORDS_PER_SESSION = 10 // 每次复习单词的数量

export interface IComprehensiveWordItem {
  word: IWordItem
  type: 'new' | 'review'
}

interface ComprehensiveWordDetail {
  word: string // 单词
  isNew: boolean // 是否为新单词
  attempts: number // 尝试次数
  isCorrect: boolean // 是否回答正确
  timeSpent: number // 花费时间（毫秒）
  wrongHistory?: number[] // 错误历史时间戳

  // 选项点击记录
  optionsClicks?: Array<{
    optionText: string // 选项文本
    clickTime: number // 点击时间戳
    isCorrect: boolean // 是否是正确选项
  }>
}

interface IComprehensiveStatData /* extends Record<string, any>  */{
  // 基础统计数据
  newWords: number
  reviewWords: number

  // 单词学习详情记录
  wordsDetails: Array<ComprehensiveWordDetail>

  // 会话统计
  sessionDuration: number // 整个学习会话持续时间
  averageTimePerWord: number // 平均每个单词花费的时间
  correctRate: number // 正确率
}

export class ComprehensiveStatistics extends Statistics<Partial<IComprehensiveStatData>> {
  constructor(mode?: ComprehensivePrepareWord, statistics?: IStatistics<any>) {
    if ( statistics ) {
      if ( statistics.type !== 'COMPREHENSIVE' )
        throw new Error(`Statistics type is not comprehensive - ${statistics.type}`)

      super('COMPREHENSIVE', statistics.startTime, statistics.endTime, statistics.cost, statistics.data)
      Object.assign(this.data, statistics.data)
    } else if (mode) {
      super(/* mode.calendarData!, */'COMPREHENSIVE', mode.startTime, mode.endTime, mode.endTime - mode.startTime, {})
    } else {
      throw new Error('ComprehensiveStatistics constructor must be provided with either a mode or a statistics')
    }
  }

  getDisplayComponent(): Component {
    return ComprehensiveStat
  }

  static parseStatistics(statistics: IStatistics<any>) {
    return new ComprehensiveStatistics(undefined, statistics)
  }
}

export class ComprehensivePrepareWord extends PrepareWord<ComprehensiveMode, IComprehensiveWordItem, ComprehensiveStatistics> {
  getStatistics() {
    console.log('getStatistics', this)
    return new ComprehensiveStatistics(this);
  }

  onCreated(): void {
    const globalAmo = globalData.value.amount
    const storage = this.mode.dictionaryStorage
    const unlearedWords = storage.getUnlearnedWords()
    const amo = Math.min(globalAmo, unlearedWords.length)

    this.taskAmount = amo
  }

  wordsQueue: IComprehensiveWordItem[] = []
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
    this.amo = 0
    this.wordsQueue.length = this.wordsDispalyed.length = this.wordsFinished.length = 0

    const storage = this.mode.dictionaryStorage

    // console.log('PRELOAD')

    return new Promise((resolve) => {
      const maxProgress = PRELOAD_WORD_AMO * 5 * this.taskAmount + this.taskAmount
      let progress = 0
      const words: IComprehensiveWordItem[] = []

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
    // 如果没有剩余单词，返回 false
    if (this.getLeftWords() === 0) {
      return false
    }

    // 如果当前单词不存在，抛出错误
    if (!this.currentWord) {
      throw new Error('当前单词不存在，无法获取下一个单词')
    }

    const currentWord = this.currentWord
    const startTime = this.wordStartTime || Date.now()
    const timeSpent = Date.now() - startTime

    // 记录单词学习数据
    this.recordWordLearningData(currentWord, success, timeSpent)

    // 将当前单词添加到已显示的单词列表中
    this.wordsDispalyed = [...new Set([...this.wordsDispalyed, this.currentWord.word.mainWord.word])]

    // 如果回答正确
    if (success) {
      if (currentWord.type === 'new') {
        // 增加已学习的单词数量
        this.amo += 1

        // 如果当前单词是新单词，将其添加到复习队列
        this.wordsQueue.push({ word: currentWord.word, type: 'review' })
      }
      else {
        this.wordsFinished.push(currentWord.word)
        this.mode.dictionaryStorage.setLearned(currentWord.word.mainWord.word)

        if (this.wordsQueue.length === 1) {
          this.wordsQueue.length = 0
          return false
        }
      }
    }
    else {
      // 将当前单词添加到复习队列中
      this.wordsQueue.push({ word: this.currentWord.word, type: 'review' })

      const obj = this.currentWord.word

      const history = obj.wrongHistory || []
      history.push(Date.now())

      obj.wrongHistory = history
    }

    // 从单词队列中移除当前单词
    this.wordsQueue.splice(this.wordIndex, 1)

    // 如果已学习的单词数量达到每次学习的单词数量，进行复习
    if (this.amo + 1 >= NEW_WORDS_PER_SESSION) {
      this.amo = 0

      const reviewWords: IComprehensiveWordItem[] = []

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

      // 加到队列前面
      this.wordsQueue.unshift(...reviewWords)
    }

    // 预备加载下5个单词
    const nextIndex = this.wordIndex + PRELOAD_WORD_AMO
    if (nextIndex < this.wordsQueue.length)
      this.preloadWordData(this.wordsQueue[nextIndex].word)

    // 重置单词开始学习时间
    this.wordStartTime = Date.now()

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

    if (!this.calendarData) {
      this.calendarData = calendarManager.createTodayData(words, duration, true)
    } else {
      this.calendarData.addData(this.calendarData.createSignData(words, duration, true))
      this.calendarData.signToday()
    }

    const lastData = this.calendarData.data.at(-1)

    if (lastData) {
      lastData.statistics = this.statistics
    }

    console.log(this.statistics, this.calendarData, this.calendarData.data)

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
    return ComprehensiveWord
  }

  // 记录单词学习数据
  private recordWordLearningData(currentWord: IComprehensiveWordItem, success: boolean, timeSpent: number): void {
    const stat = this.statistics
    if ( !stat ) {
      throw new Error(`Comprehensive statics not init yet - ${JSON.stringify(currentWord)} with ${success} #${timeSpent}`)
    }

    const wordsDetails = stat.getDataDefault('wordsDetails', new Array<ComprehensiveWordDetail>())
    const wordDetail = wordsDetails.find(
      detail => detail.word === currentWord.word.mainWord.word
    )

    if (wordDetail) {
      // 更新现有记录
      wordDetail.attempts += 1
      wordDetail.isCorrect = success
      wordDetail.timeSpent += timeSpent
      if (!success && !wordDetail.wrongHistory) {
        wordDetail.wrongHistory = []
      }
      if (!success) {
        wordDetail.wrongHistory!.push(Date.now())
      }
    } else {
      // 创建新记录
      wordsDetails.push({
        word: currentWord.word.mainWord.word,
        isNew: currentWord.type === 'new',
        attempts: 1,
        isCorrect: success,
        timeSpent: timeSpent,
        wrongHistory: success ? undefined : [Date.now()],
        optionsClicks: []
      })
    }

    stat.addData('wordsDetails', wordsDetails)

    // 更新会话统计数据
    this.updateSessionStatistics()
  }

  // 更新会话统计数据
  private updateSessionStatistics(): void {
    const details = this.statistics?.data.wordsDetails || []

    if (details.length === 0) return

    // 计算总时间和正确率
    let totalTime = 0
    let correctCount = 0

    details.forEach((detail: ComprehensiveWordDetail) => {
      totalTime += detail.timeSpent
      if (detail.isCorrect) correctCount++
    })

    const stat = this.statistics
    if (stat && stat.data) {
      stat.data.sessionDuration = Date.now() - this.startTime
      stat.data.averageTimePerWord = totalTime / details.length
      stat.data.correctRate = correctCount / details.length
    }
  }

  // 记录选项点击数据
  public recordOptionClick(optionText: string, isCorrect: boolean): void {
    if (!this.currentWord) {
      return
    }

    const stat = this.statistics
    if (!stat || !stat.data) return

    if (!stat.data.wordsDetails) {
      stat.data.wordsDetails = []
    }

    const wordDetail = stat.data.wordsDetails.find(
      (detail: ComprehensiveWordDetail) => detail.word === this.currentWord!.word.mainWord.word
    )

    if (wordDetail) {
      if (!wordDetail.optionsClicks) {
        wordDetail.optionsClicks = []
      }

      wordDetail.optionsClicks.push({
        optionText,
        clickTime: Date.now(),
        isCorrect
      })
    }

    stat.addData('wordsDetails', stat.data.wordsDetails)
  }

  // 用于存储单词开始学习的时间
  private wordStartTime: number = 0
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
