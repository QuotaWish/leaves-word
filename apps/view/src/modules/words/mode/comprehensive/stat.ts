import type { ComprehensivePrepareWord, ComprehensiveWordDetail } from './prepare'
import { ModeType, Statistics } from '../..'
import ComprehensiveStat from './display/stats/index.vue'

interface IComprehensiveStatData {
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
  constructor(mode?: ComprehensivePrepareWord, statistics?: Statistics<Partial<IComprehensiveStatData>>) {
    if (statistics) {
      super(statistics.startTime, statistics.endTime, statistics.cost, ModeType.COMPREHENSIVE, statistics.data)
      Object.assign(this.data, statistics.data)
    } else if (mode) {
      super(mode.startTime, mode.endTime, mode.endTime - mode.startTime, ModeType.COMPREHENSIVE, {})
    } else {
      throw new Error('ComprehensiveStatistics constructor must be provided with either a mode or a statistics')
    }
  }

  getDisplayComponent(): Component {
    return ComprehensiveStat
  }

  static parseStatistics(statistics: Statistics<any>) {
    return new ComprehensiveStatistics(undefined, statistics)
  }
}

// /**
//  * 综合模式统计
//  */
// export class ComprehensiveStatistics {
//   /**
//    * 解析统计数据
//    * @param stat 原始统计数据
//    * @returns 解析后的数据
//    */
//   static parseStatistics(stat: Statistics<any>) {
//     const { correctCount = 0, totalCount = 0, duration = 0, words = [] } = stat.data || {}

//     const correctRate = totalCount > 0 ? correctCount / totalCount : 0
//     const wordsDetails = words.map((w: any) => ({
//       word: w.word,
//       timeSpent: w.timeSpent || 0,
//       attempts: w.attempts || 1,
//       isCorrect: w.isCorrect !== false
//     }))

//     const averageTimePerWord = wordsDetails.length > 0
//       ? wordsDetails.reduce((sum: number, word: WordDetail) => sum + word.timeSpent, 0) / wordsDetails.length
//       : 0

//     return {
//       ...stat,
//       data: {
//         ...stat.data,
//         correctRate,
//         wordsDetails,
//         averageTimePerWord,
//         sessionDuration: duration
//       }
//     }
//   }
// }
