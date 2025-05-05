import type { Component } from 'vue'
import type { ISoundWordItem, SoundMode } from '.'
import { ExampleStage, SoundWordType } from '.'
import { LeafPrepareSign } from '..'
import { EnglishWordData, LeafWordData, calendarManager, globalPreference, useWordSound } from '../..'
import type { DictionaryWordWithWordVO } from '~/composables/api/clients/globals'
import Apis from '~/composables/api/clients'
import { useRequest } from 'alova/client'
import SoundWord from './display/Word.vue'
import { SoundStatistics } from './stat'

const PRELOAD_WORD_AMO = 5

function logDebug(...args: any[]) {
  console.log('[SoundPrepare]', ...args);
}

export interface SoundWordDetail {
  word: string // 单词
  type: SoundWordType // 听写模式或例句模式
  attempts: number // 尝试次数
  isCorrect: boolean // 是否回答正确
  timeSpent: number // 花费时间（毫秒）
  audioPlays: number // 音频播放次数

  // 例句相关
  exampleStage?: ExampleStage // 例句学习阶段
  exampleAttempts?: number[] // 各阶段尝试次数

  // 错误分析
  userInputs?: string[] // 用户输入历史
  editDistance?: number // 与正确答案的编辑距离
}

export interface ISoundStatData {
  // 基础统计
  dictationWords: number // 听写的单词数量
  exampleWords: number // 学习例句的单词数量

  // 阶段统计
  exampleStageStats: {
    [key in ExampleStage]?: {
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

export class SoundPrepareWord extends LeafPrepareSign<SoundMode, ISoundWordItem, SoundStatistics> {
  wordsQueue: ISoundWordItem[] = []
  wordsDisplayed: string[] = []
  wordsFinished: LeafWordData[] = []

  audioPlayCount = 0
  wordStartTime = 0

  getStatistics() {
    return new SoundStatistics(this)
  }

  onCreated(): void {
    const preference = globalPreference.value
    const amo = Math.max(preference.amount, 0)
    this.taskAmount = amo
    this.startTime = Date.now()
    this.wordStartTime = Date.now()

    logDebug('Created with task amount:', this.taskAmount);
  }

  async preloadWordData(word: ISoundWordItem) {
    const { word: mainWord } = word
    logDebug('Preloading word data for:', mainWord.word);
    const res = await useWordSound(mainWord.word)
    return res
  }

  async preload(callback: (progress: number) => void): Promise<boolean> {
    this.wordsQueue = []
    this.wordsDisplayed = []
    this.wordsFinished = []
    this.wordIndex = -1 // 改为-1，与基类默认值一致

    logDebug('Starting preload, dictionary storage:', this.mode.dictionaryStorage);

    logDebug('Fetching words from API with dict_id:', globalPreference.value.dict.id);
    try {
      const { send } = useRequest(() => Apis.EnglishWords.listEnglishWordByPageUsingPOST({
        data: {
          pageSize: this.taskAmount,
          dict_id: globalPreference.value.dict.id,
        },
      }));

      const { data } = await send();
      logDebug('API response:', data);

      if (!data || !data.records || !data.records.length) {
        logDebug('No records found in API response');
        callback(1);
        return false;
      }

      const records: LeafWordData[] = [...(data?.records || [])].map((item: DictionaryWordWithWordVO) => {
        if (!item.word?.word_head) {
          logDebug('Warning: Missing word_head for item:', item);
          return null;
        }
        return new LeafWordData(item.word.word_head).setData(new EnglishWordData(item.word));
      }).filter(Boolean) as LeafWordData[];

      logDebug('Processed records:', records.length);

      if (records.length === 0) {
        logDebug('No valid records after processing');
        callback(1);
        return false;
      }

      return new Promise((resolve) => {
        const maxProgress = PRELOAD_WORD_AMO * 2 * this.taskAmount + this.taskAmount;
        let progress = 0;
        const words: ISoundWordItem[] = [];

        while (words.length < this.taskAmount && records.length > 0) {
          const word = records.shift();
          if (!word) {
            logDebug('No more words available, breaking');
            break;
          }

          words.push({
            word,
            type: SoundWordType.DICTATION,
          });

          progress += 1;
          callback(+(progress / maxProgress).toFixed(2));
        }

        logDebug('Words queue prepared, length:', words.length);

        if (words.length === 0) {
          logDebug('No words available to preload');
          callback(1);
          resolve(false);
          return;
        }

        this.wordsQueue = words;
        this.wordIndex = 0;

        const promises = words.filter((_, ind) => ind + 1 <= PRELOAD_WORD_AMO).map(async (item) => {
          try {
            const res = await this.preloadWordData(item);
            progress += this.taskAmount;
            callback(+(progress / maxProgress).toFixed(2));
            return res;
          } catch (error) {
            logDebug('Error preloading word data:', error);
            return null;
          }
        });

        setTimeout(() => {
          callback(0.95);
        }, 200);

        Promise.all(promises).then(() => {
          // 首先设置索引为0，这样基类的getter可以正确返回当前单词
          this.wordIndex = 0;
          this.startTime = Date.now();
          this.wordStartTime = Date.now();

          logDebug('Setting currentWord to first item in queue:', this.wordsQueue[0]);
          // 检查当前单词是否正确设置
          const current = this.currentWord;
          logDebug('Current word from getter:', current);

          callback(1);
          logDebug('Preload complete, ready to start with', this.wordsQueue.length, 'words');
          resolve(true);
        }).catch((error) => {
          logDebug('Error in preload process:', error);
          callback(1);
          resolve(false);
        });
      });
    } catch (error) {
      logDebug('API request error:', error);
      callback(1);
      return false;
    }
  }

  async next(success: boolean): Promise<boolean> {
    logDebug('next() called, success:', success, 'left words:', this.getLeftWords());
    if (this.getLeftWords() === 0) {
      return false;
    }

    if (!this.currentWord) {
      throw new Error('当前单词不存在，无法获取下一个单词');
    }

    // 记录单词学习数据
    this.recordWordLearningData(success);

    // 添加到已显示单词
    this.wordsDisplayed = [...new Set([...this.wordsDisplayed, this.currentWord.word.word])];

    // 如果当前是听写模式且回答正确，添加例句任务
    if (success && this.currentWord.type === SoundWordType.DICTATION) {
      // 将单词添加到例句任务
      this.wordsQueue.push({
        word: this.currentWord.word,
        type: SoundWordType.EXAMPLE,
        exampleStage: ExampleStage.PLUS_ONE,
      });
      logDebug('Added example task for word:', this.currentWord.word.word);
    } else if (success && this.currentWord.type === SoundWordType.EXAMPLE) {
      // 如果是例句模式并回答正确
      const currentStage = this.currentWord.exampleStage || 0;

      if (currentStage < ExampleStage.FULL_SENTENCE) {
        // 如果还没完成所有阶段，添加下一阶段
        this.wordsQueue.push({
          word: this.currentWord.word,
          type: SoundWordType.EXAMPLE,
          exampleStage: currentStage + 1,
        });
        logDebug('Added next example stage for word:', this.currentWord.word.word, 'new stage:', currentStage + 1);
      } else {
        // 所有阶段完成，记录为已学习
        this.wordsFinished.push(this.currentWord.word);
        this.mode.dictionaryStorage.setLearned(this.currentWord.word.word);
        logDebug('Word completed all stages:', this.currentWord.word.word);
      }
    } else {
      // 回答错误，重新添加到队列
      if (this.currentWord.type === SoundWordType.DICTATION) {
        this.wordsQueue.push({
          word: this.currentWord.word,
          type: SoundWordType.DICTATION,
        });
        logDebug('Word answered incorrectly, re-added for dictation:', this.currentWord.word.word);
      } else {
        // 例句错误，重新添加相同阶段
        this.wordsQueue.push({
          word: this.currentWord.word,
          type: SoundWordType.EXAMPLE,
          exampleStage: this.currentWord.exampleStage,
        });
        logDebug('Example answered incorrectly, re-added for stage:', this.currentWord.exampleStage);
      }
    }

    // 从队列中移除当前单词
    this.wordsQueue.splice(this.wordIndex, 1);

    // 预加载后续单词
    const nextIndex = this.wordIndex + PRELOAD_WORD_AMO;
    if (nextIndex < this.wordsQueue.length) {
      this.preloadWordData(this.wordsQueue[nextIndex]);
    }

    // 重置单词开始学习时间和音频播放次数
    this.wordStartTime = Date.now();
    this.audioPlayCount = 0;

    logDebug('Updated queue length:', this.wordsQueue.length, 'current index:', this.wordIndex);

    return true;
  }

  async previous(): Promise<boolean> {
    if (this.wordIndex > 0) {
      this.wordIndex--
      return true
    }
    return false
  }

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

    return true
  }

  getLeftWords(): number {
    return this.wordsQueue.length - this.wordIndex
  }

  getTargetComponent(): Component {
    return SoundWord
  }

  recordAudioPlay(): void {
    this.audioPlayCount++
  }

  recordWordLearningData(success: boolean): void {
    if (!this.currentWord) {
      return;
    }

    const timeSpent = Date.now() - this.wordStartTime;
    const stat = this.getStatistics();

    if (!stat.data.wordsDetails) {
      stat.data.wordsDetails = [];
    }

    const wordDetails = [...stat.data.wordsDetails];
    const wordText = this.currentWord.word.word;
    const detailIndex = wordDetails.findIndex(d =>
      d.word === wordText && d.type === this.currentWord?.type,
    );

    if (detailIndex === -1) {
      const newDetail: SoundWordDetail = {
        word: wordText,
        type: this.currentWord.type,
        attempts: 1,
        isCorrect: success,
        timeSpent,
        audioPlays: this.audioPlayCount,
        userInputs: [],
      };

      if (this.currentWord.type === SoundWordType.EXAMPLE && this.currentWord.exampleStage !== undefined) {
        newDetail.exampleStage = this.currentWord.exampleStage;
        newDetail.exampleAttempts = [];
        newDetail.exampleAttempts[this.currentWord.exampleStage] = 1;
      }

      wordDetails.push(newDetail);
    } else {
      const detail = wordDetails[detailIndex];
      detail.attempts++;
      detail.isCorrect = success;
      detail.timeSpent += timeSpent;
      detail.audioPlays = (detail.audioPlays || 0) + this.audioPlayCount;

      if (this.currentWord.type === SoundWordType.EXAMPLE &&
        this.currentWord.exampleStage !== undefined) {
        detail.exampleStage = this.currentWord.exampleStage;

        if (!detail.exampleAttempts) {
          detail.exampleAttempts = [];
        }

        const stageIndex = this.currentWord.exampleStage;
        if (!detail.exampleAttempts[stageIndex]) {
          detail.exampleAttempts[stageIndex] = 1;
        } else {
          detail.exampleAttempts[stageIndex]++;
        }
      }
    }

    stat.data.wordsDetails = wordDetails;
    this.updateBasicStats(success);
    this.updateSessionStatistics();
  }

  updateBasicStats(success: boolean): void {
    if (!this.currentWord) { return; }

    const stat = this.getStatistics();

    if (this.currentWord.type === SoundWordType.DICTATION) {
      stat.data.dictationWords = (stat.data.dictationWords || 0) + 1
    } else if (this.currentWord.type === SoundWordType.EXAMPLE) {
      if (this.currentWord.exampleStage === ExampleStage.FULL_SENTENCE) {
        stat.data.exampleWords = (stat.data.exampleWords || 0) + 1
      }

      if (this.currentWord.exampleStage !== undefined) {
        if (!stat.data.exampleStageStats) {
          stat.data.exampleStageStats = {}
        }

        const stage = this.currentWord.exampleStage
        const stats = stat.data.exampleStageStats

        if (!stats[stage]) {
          stats[stage] = {
            completed: success ? 1 : 0,
            attempts: 1,
          }
        } else {
          stats[stage].attempts++
          if (success) {
            stats[stage].completed++
          }
        }
      }
    }
  }

  updateSessionStatistics(): void {
    const details = this.statistics.data.wordsDetails || [];
    if (details.length === 0) {
      return;
    }

    let dictationTotal = 0;
    let dictationCorrect = 0;
    let exampleTotal = 0;
    let exampleCorrect = 0;
    let totalAudioPlays = 0;
    let dictationDuration = 0;
    let exampleDuration = 0;

    for (const detail of details) {
      totalAudioPlays += detail.audioPlays || 0;

      if (detail.type === SoundWordType.DICTATION) {
        dictationTotal++;
        if (detail.isCorrect) {
          dictationCorrect++;
        }
        dictationDuration += detail.timeSpent;
      } else if (detail.type === SoundWordType.EXAMPLE) {
        exampleTotal++;
        if (detail.isCorrect) {
          exampleCorrect++;
        }
        exampleDuration += detail.timeSpent;
      }
    }

    const stat = this.statistics;
    stat.data.sessionDuration = Date.now() - this.startTime;
    stat.data.dictationDuration = dictationDuration;
    stat.data.exampleDuration = exampleDuration;
    stat.data.audioPlayCount = totalAudioPlays;

    stat.data.dictationCorrectRate = dictationTotal > 0 ? dictationCorrect / dictationTotal : 0;
    stat.data.exampleCorrectRate = exampleTotal > 0 ? exampleCorrect / exampleTotal : 0;
  }
}
