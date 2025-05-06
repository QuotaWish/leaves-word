import type { Component } from 'vue'
import type { ISoundStatData, SoundPrepareWord } from './prepare'
import { ModeType, Statistics } from '../..'
import StatisticsComponent from './display/stats/index.vue'

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
      super(
        mode.startTime,
        mode.endTime,
        mode.endTime - mode.startTime,
        ModeType.SOUND,
        {},
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
