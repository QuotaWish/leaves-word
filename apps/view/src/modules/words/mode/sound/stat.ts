import type { Component } from 'vue'
import type { SoundExampleStage } from '.'
import type { SoundPrepareWord, SoundWordDetail } from './prepare'
import { ModeType, Statistics } from '../..'
import StatisticsComponent from './display/stats/index.vue'

export interface ISoundStatData {
  // 基础统计
  dictationWords: number // 听写的单词数量
  exampleWords: number // 学习例句的单词数量

  // 阶段统计
  exampleStageStats: {
    [key in SoundExampleStage]?: {
      completed: number,
      attempts: number,
    }
  }

  // 单词学习详情
  wordsDetails: Array<SoundWordDetail>

  // 会话统计
  sessionDuration: number // 整个学习会话持续时间
  dictationDuration: number // 听写模式花费时间
  exampleDuration: number // 例句模式花费时间

  audioPlayCount: number // 音频播放总次数
  dictationCorrectRate: number // 听写正确率
  exampleCorrectRate: number // 例句正确率

  // 错误分析
  averageEditDistance: number // 平均编辑距离
}

export class SoundStatistics extends Statistics<Partial<ISoundStatData>> {
  constructor(mode?: SoundPrepareWord, statistics?: Statistics<Partial<ISoundStatData>>) {
    if (statistics) {
      super(
        statistics.startTime,
        statistics.endTime,
        statistics.cost,
        ModeType.SOUND,
        statistics.data,
      )
      Object.assign(this.data, statistics.data)
    } else if (mode) {
      // 初始化默认统计数据
      const defaultData: Partial<ISoundStatData> = {
        dictationWords: 0,           // 听写的单词数量
        exampleWords: 0,             // 学习例句的单词数量
        exampleStageStats: {},       // 阶段统计
        wordsDetails: [],            // 单词学习详情
        sessionDuration: 0,          // 整个学习会话持续时间
        dictationDuration: 0,        // 听写模式花费时间
        exampleDuration: 0,          // 例句模式花费时间
        audioPlayCount: 0,           // 音频播放总次数
        dictationCorrectRate: 0,     // 听写正确率
        exampleCorrectRate: 0,       // 例句正确率
        averageEditDistance: 0       // 平均编辑距离
      }

      super(
        mode.startTime,
        mode.endTime,
        mode.endTime - mode.startTime,
        ModeType.SOUND,
        defaultData,
      )
    } else {
      throw new Error('SoundStatistics constructor must be provided with either a mode or a statistics')
    }
  }

  getDisplayComponent(): Component {
    return StatisticsComponent
  }

  static parseStatistics(statistics: Statistics<any>): SoundStatistics {
    return new SoundStatistics(undefined, statistics)
  }
}
