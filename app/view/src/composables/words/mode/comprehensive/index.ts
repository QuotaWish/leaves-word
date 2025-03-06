import { Statistics } from '~/composables/words'

interface WordDetail {
  word: string
  timeSpent: number
  attempts: number
  isCorrect: boolean
}

/**
 * 综合模式统计
 */
export class ComprehensiveStatistics {
  /**
   * 解析统计数据
   * @param stat 原始统计数据
   * @returns 解析后的数据
   */
  static parseStatistics(stat: Statistics<any>) {
    const { correctCount = 0, totalCount = 0, duration = 0, words = [] } = stat.data || {}
    
    const correctRate = totalCount > 0 ? correctCount / totalCount : 0
    const wordsDetails = words.map((w: any) => ({
      word: w.word,
      timeSpent: w.timeSpent || 0,
      attempts: w.attempts || 1,
      isCorrect: w.isCorrect !== false
    }))
    
    const averageTimePerWord = wordsDetails.length > 0 
      ? wordsDetails.reduce((sum: number, word: WordDetail) => sum + word.timeSpent, 0) / wordsDetails.length 
      : 0
    
    return {
      ...stat,
      data: {
        ...stat.data,
        correctRate,
        wordsDetails,
        averageTimePerWord,
        sessionDuration: duration
      }
    }
  }
} 