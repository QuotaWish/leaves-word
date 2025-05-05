import type { ReadingPrepareWord, ReadingWordDetail } from './prepare'
import { ModeType, Statistics } from '../..'
import ReadingStat from './display/stats/index.vue'

interface IReadingStatData {
  // 基础统计数据
  newWords: number
  reviewWords: number

  // 单词学习详情记录
  wordsDetails: Array<ReadingWordDetail>

  // 会话统计
  sessionDuration: number // 整个学习会话持续时间
  averageTimePerWord: number // 平均每个单词花费的时间
  correctRate: number // 正确率
}

export class ReadingStatistics extends Statistics<Partial<IReadingStatData>> {
  constructor(mode?: ReadingPrepareWord, statistics?: Statistics<Partial<IReadingStatData>>) {
    if (statistics) {
      super(statistics.startTime, statistics.endTime, statistics.cost, ModeType.READING, statistics.data)
      Object.assign(this.data, statistics.data)
    } else if (mode) {
      super(mode.startTime, mode.endTime, mode.endTime - mode.startTime, ModeType.READING, {})
    } else {
      throw new Error('ReadingStatistics constructor must be provided with either a mode or a statistics')
    }
  }

  getDisplayComponent(): Component {
    return ReadingStat
  }

  static parseStatistics(statistics: Statistics<any>) {
    return new ReadingStatistics(undefined, statistics)
  }
}
