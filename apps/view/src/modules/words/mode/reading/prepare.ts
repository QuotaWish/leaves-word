import type { ReadingMode, IReadingWordItem } from '.';
import { useRequest } from 'alova/client';
import { LeafPrepareSign } from '..';
import { EnglishWordData, generateOptions, LeafWordData } from '../..';
import { calendarManager, globalPreference, useWordSound } from '../..';
import ReadingWord from './display/Word.vue';
import { ReadingStatistics } from './stat';
import type { DictionaryWordWithWordVO, EnglishWord } from '~/composables/api/clients/globals';

// 预加载的单词数量
const PRELOAD_WORD_AMO = 5
// 每次学习新单词的数量
const NEW_WORDS_PER_SESSION = 10
// 每次复习单词的数量
const REVIEW_WORDS_PER_SESSION = 10

export interface ReadingWordDetail {
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

export class ReadingPrepareWord extends LeafPrepareSign<ReadingMode, IReadingWordItem, ReadingStatistics> {
  getStatistics() {
    return new ReadingStatistics(this);
  }

  onCreated(): void {
    const preference = globalPreference.value

    // const storage = this.mode.dictionaryStorage
    // const unlearedWords = storage.getUnlearnedWords()
    const amo = Math.max(preference.amount, 0)

    this.taskAmount = amo
  }

  wordsQueue: IReadingWordItem[] = []
  wordsDispalyed: string[] = []
  wordsFinished: LeafWordData[] = []

  amo = 0

  async preloadWordData(word: IReadingWordItem) {
    const { mainWord } = word

    const res = await useWordSound(mainWord.word)

    return res
  }

  async preload(callback: (progress: number) => void): Promise<boolean> {
    this.amo = 0
    this.wordsQueue.length = this.wordsDispalyed.length = this.wordsFinished.length = 0

    const storage = this.mode.dictionaryStorage

    const { send } = useRequest(() => Apis.EnglishWords.listEnglishWordByPageUsingPOST({
      data: {
        pageSize: this.taskAmount,
        dict_id: globalPreference.value.dict.id,
      },
    }))

    const { data } = await send()
    const records: LeafWordData[] = [...(data?.records || [])].map((item: DictionaryWordWithWordVO) => new LeafWordData(item.word?.word_head!).setData(new EnglishWordData(item.word!)))

    return new Promise((resolve) => {
      const maxProgress = PRELOAD_WORD_AMO * 5 * this.taskAmount + this.taskAmount
      let progress = 0
      const words: IReadingWordItem[] = []

      while (words.length < this.taskAmount) {
        const res = records.shift()!

        // 从 records 中随机选择 3 个单词
        const options = records.filter(item => item.word !== res.word).sort(() => Math.random() - 0.5).slice(0, 3)

        words.push({ mainWord: res, options, type: 'new', wrongHistory: [] })
        progress += 1
        callback(+(progress / maxProgress).toFixed(2))
      }

      this.wordsQueue = words

      const promises = words.filter((_, ind) => ind + 1 <= PRELOAD_WORD_AMO).map(async (item) => {
        const res = await this.preloadWordData(item)

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
    this.wordsDispalyed = [...new Set([...this.wordsDispalyed, this.currentWord.mainWord.word])]

    // 如果回答正确
    if (success) {
      if (currentWord.type === 'new') {
        // 增加已学习的单词数量
        this.amo += 1

        // 如果当前单词是新单词，将其添加到复习队列
        this.wordsQueue.push({ mainWord: currentWord.mainWord, options: currentWord.options, type: 'review', wrongHistory: [] })
      }
      else {
        this.wordsFinished.push(currentWord.mainWord)
        this.mode.dictionaryStorage.setLearned(currentWord.mainWord.word)

        if (this.wordsQueue.length === 1) {
          this.wordsQueue.length = 0
          return false
        }
      }
    }
    else {
      this.wordsQueue.push({ mainWord: this.currentWord.mainWord, options: this.currentWord.options, type: 'review', wrongHistory: [] })

      const obj = this.currentWord

      const history = obj.wrongHistory || []
      history.push(Date.now())

      obj.wrongHistory = history
    }

    // 从单词队列中移除当前单词
    this.wordsQueue.splice(this.wordIndex, 1)

    // 如果已学习的单词数量达到每次学习的单词数量，进行复习
    if (this.amo + 1 >= NEW_WORDS_PER_SESSION) {
      this.amo = 0

      const reviewWords: IReadingWordItem[] = []

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
      this.preloadWordData(this.wordsQueue[nextIndex])

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

    const words = this.wordsFinished.map(i => i.word)

    if (!this.calendarData) {
      this.calendarData = calendarManager.createTodayData(words, duration, true)
    } else {
      const [, , day] = calendarManager.getToday()
      this.calendarData.addDayData(day, this.calendarData.createSignData(words, duration, true))
      this.calendarData.signToday()
    }

    const lastData = this.calendarData.data.at(-1)

    if (lastData) {
      lastData.statistics = this.statistics
    }

    console.log(this.statistics, this.calendarData, this.calendarData.data)

    return true
  }

  getLeftWords(): number {
    return this.wordsQueue.length
  }

  getNewlyWords(): number {
    return this.wordsQueue.filter(i => i.type === 'new').length
  }

  getReviewWords(): number {
    return this.wordsQueue.filter(i => i.type === 'review').length
  }

  getTargetComponent(): Component {
    return ReadingWord
  }

  private recordWordLearningData(currentWord: IReadingWordItem, success: boolean, timeSpent: number): void {
    // 获取或初始化单词详情数组
    const wordsDetails = this.statistics.data.wordsDetails || []

    // 查找当前单词的详情记录
    let wordDetail = wordsDetails.find(detail => detail.word === currentWord.mainWord.word)

    if (!wordDetail) {
      // 如果不存在，创建新的详情记录
      wordDetail = {
        word: currentWord.mainWord.word,
        isNew: currentWord.type === 'new',
        attempts: 1,
        isCorrect: success,
        timeSpent,
        wrongHistory: currentWord.wrongHistory,
        optionsClicks: []
      }
      wordsDetails.push(wordDetail)
    }
    else {
      // 如果存在，更新详情记录
      wordDetail.attempts += 1
      wordDetail.isCorrect = success
      wordDetail.timeSpent += timeSpent
      wordDetail.wrongHistory = currentWord.wrongHistory
    }

    // 更新统计数据
    this.statistics.data.wordsDetails = wordsDetails

    // 更新会话统计
    this.updateSessionStatistics()
  }

  private updateSessionStatistics(): void {
    const wordsDetails = this.statistics.data.wordsDetails || []

    // 计算正确率
    const totalWords = wordsDetails.length
    const correctWords = wordsDetails.filter(detail => detail.isCorrect).length
    const correctRate = totalWords > 0 ? correctWords / totalWords : 0

    // 计算平均每个单词花费的时间
    const totalTime = wordsDetails.reduce((sum, detail) => sum + detail.timeSpent, 0)
    const averageTimePerWord = totalWords > 0 ? totalTime / totalWords : 0

    // 更新统计数据
    this.statistics.data.newWords = this.wordsFinished.length
    this.statistics.data.reviewWords = this.getReviewWords()
    this.statistics.data.sessionDuration = Date.now() - this.startTime
    this.statistics.data.averageTimePerWord = averageTimePerWord
    this.statistics.data.correctRate = correctRate
  }

  public recordOptionClick(optionText: string, isCorrect: boolean): void {
    if (!this.currentWord)
      return

    // 获取或初始化单词详情数组
    const wordsDetails = this.statistics.data.wordsDetails || []

    // 查找当前单词的详情记录
    let wordDetail = wordsDetails.find(detail => detail.word === this.currentWord?.mainWord.word)

    if (!wordDetail) {
      // 如果不存在，创建新的详情记录
      wordDetail = {
        word: this.currentWord.mainWord.word,
        isNew: this.currentWord.type === 'new',
        attempts: 0,
        isCorrect: false,
        timeSpent: 0,
        optionsClicks: []
      }
      wordsDetails.push(wordDetail)
    }

    // 初始化选项点击记录
    if (!wordDetail.optionsClicks)
      wordDetail.optionsClicks = []

    // 记录选项点击
    wordDetail.optionsClicks.push({
      optionText,
      clickTime: Date.now(),
      isCorrect
    })

    // 更新统计数据
    this.statistics.data.wordsDetails = wordsDetails
  }

  private wordStartTime = 0
}
