import type { Component } from 'vue'
import { toRaw } from 'vue'
import type { DictionaryWordWithWordVO } from '~/composables/api/clients/globals'
import { useRequest } from 'alova/client'
import Apis from '~/composables/api/clients'
import { type ISoundWordItem, SoundExampleStage, type SoundMode } from '.'
import { SoundWordType } from '.'
import { LeafPrepareSign } from '..'
import { calendarManager, EnglishWordData, globalPreference, LeafWordData, useWordSound } from '../..'
import SoundWord from './display/Word.vue'
import { SoundStatistics } from './stat'

const PRELOAD_WORD_AMO = 5

function logDebug(...args: any[]) {
  console.log('[SoundPrepare]', ...args);
}

export interface SoundWordDetail {
  word: string // 当前单词
  type: SoundWordType // 听写类型（单词/例句）

  // 尝试与表现
  attempts: number // 总尝试次数
  timeSpent: number // 总作答时间（毫秒）
  isCorrect: boolean // 最终是否答对
  audioPlays: number // 音频播放次数
  wrongHistory?: number[] // 错误时间戳（ms）

  // 用户输入分析
  userInputs?: string[] // 用户输入记录
  editDistance?: number // 最后一次输入的编辑距离

  // 例句学习记录（新结构）
  exampleAttempts?: ExampleAttemptRecord[] // 每阶段的例句学习记录
}

export interface ExampleAttemptRecord {
  stage: SoundExampleStage // 所处阶段（如：听音、填空、回忆）
  attempts: number // 当前阶段的尝试次数
  timeSpent?: number // 当前阶段的时间（可选）
  isCorrect?: boolean // 当前阶段是否通过（可选）
}

/**
 * 例句学习拆分，自动将一段例句拆分
 */
function splitExample(example: string, word: string): string[] {
  // 比如 "The cat sat on the mat" 其中单词是 cat
  // 拆分为 主要单词 + 前/后 一个单词 即 对比单词前后哪个少就是哪个
  // 比如 "The cat sat on the mat" 其中单词是 cat -> The cat sat on the mat
  // 对比 "The cat sat on the mat" 和 "cat sat on the mat" 的编辑距离
  // 然后将编辑距离最小的作为对比单词
  const words = example.split(' ')
  const index = words.indexOf(word)

  if (index === -1) {
    return [example, example, example];
  }

  const before = words.slice(Math.max(0, index - 1), index)
  const after = words.slice(index + 1, Math.min(words.length, index + 2))

  const beforeCount = before.length
  const afterCount = after.length

  function splitOne() {
    // 拆分第一句话
    // 对比 cat 前后的单词数量

    if (beforeCount > afterCount) {
      return `${before.join(' ')} ${word}`
    } else {
      return `${after.join(' ')} ${word}`
    }
  }

  if (beforeCount === 0 || afterCount === 0) {
    return [splitOne(), splitOne(), example];
  }

  function splitTwo() {
    // 拆分第二句话

    if (beforeCount <= afterCount) {
      return [...before, word, ...words.slice(index + 1, afterCount * 0.7)].join(' ')
    } else {
      return [...words.slice(Math.max(0, index - 1), beforeCount * 0.7), word, ...after].join(' ')
    }
  }

  return [splitOne(), splitTwo(), example]
}

// logDebug(splitExample('The cat sat on the mat', 'cat'))
// logDebug(splitExample('The cat sat on the mat', 'mat'))
// logDebug(splitExample('The cat sat on the mat', 'sat'))

export class SoundPrepareWord extends LeafPrepareSign<SoundMode, ISoundWordItem, SoundStatistics> {
  wordsQueue: ISoundWordItem[] = []
  wordsDisplayed: string[] = []
  wordsFinished: LeafWordData[] = []

  audioPlayCount = 0
  wordStartTime = 0

  getStatistics() {
    // 如果已经存在统计对象，则返回它，否则创建新对象
    if (!this.statistics) {
      console.warn('[SoundPrepare] 创建新的统计对象');
      this.statistics = new SoundStatistics(this);
    } else {
      console.warn('[SoundPrepare] 返回现有统计对象:', {
        wordsDetailsLength: this.statistics.data.wordsDetails?.length || 0,
        dictationWords: this.statistics.data.dictationWords || 0,
        exampleWords: this.statistics.data.exampleWords || 0
      });
    }
    return this.statistics;
  }

  onCreated(): void {
    const preference = globalPreference.value
    const amo = Math.max(preference.amount, 0)
    this.taskAmount = amo
    this.startTime = Date.now()
    this.wordStartTime = Date.now()

    console.log(this)
  }

  async preloadWordData(word: ISoundWordItem) {
    const { word: mainWord } = word
    logDebug('Preloading word data for:', mainWord.word);

    const audioSound = await useWordSound(mainWord.word)

    const obj: ISoundWordItem = {
      word: mainWord,
      type: SoundWordType.DICTATION,
      example: {
        stage: SoundExampleStage.NONE,
        parts: [],
        origin: word.word.data?.content.examplePhrases?.[0],
      },
    }

    return {
      obj,
      audioSound,
    }
  }

  async preload(callback: (progress: number) => void): Promise<boolean> {
    this.wordsQueue = []
    this.wordsDisplayed = []
    this.wordsFinished = []
    this.wordIndex = -1 // 改为-1，与基类默认值一致

    logDebug('Starting preload, dictionary storage:', this.mode.dictionaryStorage);

    try {
      const { send } = useRequest(() => Apis.EnglishWords.listEnglishWordByPageUsingPOST({
        data: {
          pageSize: this.taskAmount,
          dict_id: globalPreference.value.dict.id,
        },
      }));

      const { data } = await send();

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

          const example = word.data?.content.examplePhrases?.[0]

          words.push({
            word,
            type: SoundWordType.DICTATION,
            example: {
              stage: SoundExampleStage.NONE,
              parts: example?.sentence ? splitExample(example?.sentence, word.word) : [],
              origin: example,
            },
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

    const currentWord = this.currentWord
    if (!currentWord) {
      throw new Error('当前单词不存在，无法获取下一个单词');
    }

    // 记录单词学习数据
    this.recordWordLearningData(success);

    // 添加到已显示单词
    this.wordsDisplayed = [...new Set([...this.wordsDisplayed, currentWord.word.word])];

    if (success && currentWord.type === SoundWordType.EXAMPLE) {
      // 所有阶段完成，记录为已学习
      this.wordsFinished.push(currentWord.word);

      this.mode.dictionaryStorage.setLearned(currentWord.word.word);
      logDebug('Word completed all stages:', currentWord.word.word);

      // 检查是否所有单词都已学习
      if (this.wordsFinished.length === this.taskAmount) {
        this.wordsQueue.length = 0
        logDebug('All words completed, finishing...');
        return false;
      }
    } else {
      // 回答错误，重新添加到队列
      if (currentWord.type === SoundWordType.DICTATION) {
        this.wordsQueue.push({
          ...currentWord,
          word: currentWord.word,
          type: SoundWordType.DICTATION,
        });
        logDebug('Word answered incorrectly, re-added for dictation:', currentWord.word.word);
      } else {
        // 例句错误，重新添加相同阶段
        this.wordsQueue.push({
          ...currentWord,
          word: currentWord.word,
          type: SoundWordType.EXAMPLE,
        });
        logDebug('Example answered incorrectly, re-added for stage:', currentWord.example);
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
    console.warn('[SoundPrepare] finish 开始:', {
      wordsQueueLength: this.wordsQueue.length,
      wordsFinishedLength: this.wordsFinished.length,
      startTime: this.startTime,
      currentEndTime: this.endTime,
      currentStatistics: this.statistics
    });

    if (this.wordsQueue.length) {
      console.warn('[SoundPrepare] 单词队列非空，无法完成');
      return false
    }

    // 设置结束时间
    this.endTime = Date.now()
    console.warn('[SoundPrepare] 设置结束时间:', this.endTime);

    // 重要：更新统计对象的结束时间和花费时间
    if (this.statistics) {
      this.statistics.endTime = this.endTime
      this.statistics.cost = this.endTime - this.startTime
      console.warn('[SoundPrepare] 更新统计对象时间:', {
        endTime: this.statistics.endTime,
        cost: this.statistics.cost
      });

      // 强制更新一次会话统计数据
      this.updateSessionStatistics()
    }

    const duration = this.endTime - this.startTime
    const words = this.wordsFinished.map(i => i.word)
    console.warn('[SoundPrepare] 准备创建日历数据:', {
      duration,
      wordsCount: words.length
    });

    if (!this.calendarData) {
      this.calendarData = calendarManager.createTodayData(words, duration, true)
      console.warn('[SoundPrepare] 创建新的日历数据');
    } else {
      const [, , day] = calendarManager.getToday()
      this.calendarData.addDayData(day, this.calendarData.createSignData(words, duration, true))
      this.calendarData.signToday()
      console.warn('[SoundPrepare] 更新现有日历数据');
    }

    // 创建统计数据的纯JavaScript对象副本，避免响应式引用问题
    let statisticsData = null;
    if (this.statistics) {
      try {
        // 首先尝试解除响应式转换，再进行深拷贝
        const plainData = toRaw(this.statistics.data);
        const plainStatistics = {
          startTime: this.statistics.startTime,
          endTime: this.statistics.endTime,
          cost: this.statistics.cost,
          type: this.statistics.type,
          data: JSON.parse(JSON.stringify(plainData)) // 确保深拷贝
        };

        // 用纯JavaScript对象创建新的统计对象
        statisticsData = new SoundStatistics(undefined, plainStatistics as any);
        console.warn('[SoundPrepare] 创建纯JavaScript统计数据对象:', statisticsData);
      } catch (e) {
        console.error('[SoundPrepare] 创建统计数据副本出错:', e);
        // 备选方案：使用原始构造函数
        statisticsData = new SoundStatistics(undefined, this.statistics);
      }
    }

    const lastData = this.calendarData.data.at(-1)
    if (lastData && statisticsData) {
      // 确保直接使用统计对象，而不是响应式引用
      lastData.statistics = statisticsData
      console.warn('[SoundPrepare] 将统计数据保存到日历中:', {
        statisticsData,
        dataDetails: statisticsData.data.wordsDetails?.length || 0,
        dictationWords: statisticsData.data.dictationWords || 0
      });
    }

    console.warn('[SoundPrepare] 完成，最终统计数据:', {
      statistics: this.statistics,
      calendarData: this.calendarData,
      dataEntries: this.calendarData?.data.length
    });

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

  // 记录学习过程中的详细信息
  recordLearningDetails(details: {
    userInput: string,
    isCorrect: boolean,
    errorCount: number,
    editDistance: number,
  }): void {
    if (!this.currentWord) {
      console.warn('[SoundPrepare] recordLearningDetails: 当前单词为空');
      return;
    }

    console.warn('[SoundPrepare] recordLearningDetails 接收数据:', {
      word: this.currentWord.word.word,
      details,
      statistics: this.statistics
    });

    // 保存用户输入和错误数据，供 recordWordLearningData 使用
    this._lastUserInput = details.userInput;
    this._lastErrorCount = details.errorCount;
    this._lastEditDistance = details.editDistance;

    // 直接更新统计数据，不等待next方法调用
    this.recordWordLearningData(details.isCorrect);

    // 输出更新后的统计数据
    console.warn('[SoundPrepare] 更新后的统计数据:', {
      wordDetails: this.statistics?.data.wordsDetails,
      dictationWords: this.statistics?.data.dictationWords,
      exampleWords: this.statistics?.data.exampleWords
    });
  }

  // 临时保存最后一次用户输入数据的属性
  private _lastUserInput: string = '';
  private _lastErrorCount: number = 0;
  private _lastEditDistance: number = 0;

  recordWordLearningData(success: boolean): void {
    if (!this.currentWord) {
      console.warn('[SoundPrepare] recordWordLearningData: 当前单词为空');
      return;
    }

    const timeSpent = Date.now() - this.wordStartTime;
    const stat = this.getStatistics();

    console.warn('[SoundPrepare] recordWordLearningData 开始:', {
      word: this.currentWord.word.word,
      type: this.currentWord.type,
      success,
      timeSpent,
      audioPlayCount: this.audioPlayCount,
      userInput: this._lastUserInput,
      editDistance: this._lastEditDistance,
      existingStatistics: stat.data
    });

    if (!stat.data.wordsDetails) {
      console.warn('[SoundPrepare] 初始化 wordsDetails 数组');
      stat.data.wordsDetails = [];
    }

    const wordDetails = [...stat.data.wordsDetails];
    const wordText = this.currentWord.word.word;
    const detailIndex = wordDetails.findIndex(d =>
      d.word === wordText && d.type === this.currentWord?.type,
    );

    console.warn('[SoundPrepare] 查找单词详情:', {
      wordText,
      detailIndex,
      existingDetailsCount: wordDetails.length
    });

    if (detailIndex === -1) {
      const newDetail: SoundWordDetail = {
        word: wordText,
        type: this.currentWord.type,
        attempts: 1,
        isCorrect: success,
        timeSpent,
        audioPlays: this.audioPlayCount,
        userInputs: this._lastUserInput ? [this._lastUserInput] : [],
        wrongHistory: !success ? [Date.now()] : undefined,
        editDistance: this._lastEditDistance || undefined,
      };

      if (this.currentWord.type === SoundWordType.EXAMPLE && this.currentWord.example?.stage !== undefined) {
        // 初始化每个阶段的尝试记录
        newDetail.exampleAttempts = [];
        const stage = this.currentWord.example.stage;
        newDetail.exampleAttempts[stage] = {
          stage,
          attempts: 1,
          timeSpent,
          isCorrect: success,
        };
      }

      wordDetails.push(newDetail);
    } else {
      const detail = wordDetails[detailIndex];
      detail.attempts++;
      detail.isCorrect = success;
      detail.timeSpent += timeSpent;
      detail.audioPlays = (detail.audioPlays || 0) + this.audioPlayCount;

      // 记录用户输入历史
      if (this._lastUserInput) {
        if (!detail.userInputs) {
          detail.userInputs = [];
        }
        detail.userInputs.push(this._lastUserInput);
      }

      // 记录错误历史
      if (!success) {
        if (!detail.wrongHistory) {
          detail.wrongHistory = [];
        }
        detail.wrongHistory.push(Date.now());
      }

      // 更新编辑距离（如果有新值）
      if (this._lastEditDistance > 0) {
        detail.editDistance = this._lastEditDistance;
      }

      if (this.currentWord.type === SoundWordType.EXAMPLE && this.currentWord.example?.stage !== undefined) {
        const stage = this.currentWord.example.stage;
        if (!detail.exampleAttempts) {
          detail.exampleAttempts = [];
        }
        if (!detail.exampleAttempts[stage]) {
          detail.exampleAttempts[stage] = {
            stage,
            attempts: 1,
            timeSpent,
            isCorrect: success,
          };
        } else {
          detail.exampleAttempts[stage].attempts++;
          detail.exampleAttempts[stage].timeSpent = (detail.exampleAttempts[stage].timeSpent || 0) + timeSpent;
          detail.exampleAttempts[stage].isCorrect = success;
        }
      }
    }

    // 清除临时数据，防止混淆
    this._lastUserInput = '';
    this._lastErrorCount = 0;
    this._lastEditDistance = 0;

    stat.data.wordsDetails = wordDetails;

    console.warn('[SoundPrepare] 更新 wordsDetails 后:', {
      updatedDetailsCount: wordDetails.length,
      wordsDetails: wordDetails
    });

    this.updateBasicStats(success);
    this.updateSessionStatistics();

    console.warn('[SoundPrepare] recordWordLearningData 完成, 最终统计数据:', {
      dictationWords: stat.data.dictationWords,
      exampleWords: stat.data.exampleWords,
      sessionDuration: stat.data.sessionDuration,
      dictationCorrectRate: stat.data.dictationCorrectRate,
      exampleCorrectRate: stat.data.exampleCorrectRate,
      averageEditDistance: stat.data.averageEditDistance
    });
  }

  updateBasicStats(success: boolean): void {
    if (!this.currentWord) {
      console.warn('[SoundPrepare] updateBasicStats: 当前单词为空');
      return;
    }

    const stat = this.getStatistics();

    console.warn('[SoundPrepare] updateBasicStats 开始:', {
      word: this.currentWord.word.word,
      type: this.currentWord.type,
      exampleStage: this.currentWord.type === SoundWordType.EXAMPLE ? this.currentWord.example.stage : 'N/A',
      success,
      currentStats: {
        dictationWords: stat.data.dictationWords,
        exampleWords: stat.data.exampleWords
      }
    });

    // 获取单词的详细数据，检查是否是首次答对
    const wordDetails = stat.data.wordsDetails || [];
    const wordText = this.currentWord.word.word;
    const existingDetail = wordDetails.find(d =>
      d.word === wordText && d.type === this.currentWord?.type
    );

    // 单词已存在于详情中，且之前就已经答对了，则不增加计数
    const isFirstCorrect = success && (!existingDetail || !existingDetail.isCorrect);
    console.warn('[SoundPrepare] 单词状态检查:', {
      existing: !!existingDetail,
      previouslyCorrect: existingDetail?.isCorrect,
      isFirstCorrect
    });

    if (this.currentWord.type === SoundWordType.DICTATION && isFirstCorrect) {
      stat.data.dictationWords = (stat.data.dictationWords || 0) + 1;
      console.warn('[SoundPrepare] 增加听写单词计数:', stat.data.dictationWords);
    } else if (this.currentWord.type === SoundWordType.EXAMPLE) {
      // 只有在全句阶段且首次答对时才增加例句单词计数
      if (this.currentWord.example.stage === SoundExampleStage.FULL_SENTENCE && isFirstCorrect) {
        stat.data.exampleWords = (stat.data.exampleWords || 0) + 1;
        console.warn('[SoundPrepare] 增加例句单词计数:', stat.data.exampleWords);
      }

      if (this.currentWord.example.stage !== undefined) {
        if (!stat.data.exampleStageStats) {
          stat.data.exampleStageStats = {};
          console.warn('[SoundPrepare] 初始化 exampleStageStats 对象');
        }

        const stage = this.currentWord.example.stage
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
    const details = this.statistics?.data.wordsDetails || [];

    console.warn('[SoundPrepare] updateSessionStatistics 开始:', {
      wordsDetailsLength: details.length,
      startTime: this.startTime,
      currentTime: Date.now()
    });

    if (details.length === 0) {
      console.warn('[SoundPrepare] wordsDetails 为空，无法计算会话统计');
      return;
    }

    let dictationTotal = 0;
    let dictationCorrect = 0;
    let exampleTotal = 0;
    let exampleCorrect = 0;
    let totalAudioPlays = 0;
    let dictationDuration = 0;
    let exampleDuration = 0;

    // 计算平均编辑距离的变量
    let totalEditDistance = 0;
    let editDistanceCount = 0;

    for (const detail of details) {
      totalAudioPlays += detail.audioPlays || 0;

      // 累计编辑距离
      if (detail.editDistance !== undefined && detail.editDistance > 0) {
        totalEditDistance += detail.editDistance;
        editDistanceCount++;
      }

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

    console.warn('[SoundPrepare] 统计计算中间结果:', {
      dictationTotal,
      dictationCorrect,
      exampleTotal,
      exampleCorrect,
      totalAudioPlays,
      dictationDuration,
      exampleDuration,
      totalEditDistance,
      editDistanceCount
    });

    const stat = this.statistics!;
    stat.data.sessionDuration = Date.now() - this.startTime;
    stat.data.dictationDuration = dictationDuration;
    stat.data.exampleDuration = exampleDuration;
    stat.data.audioPlayCount = totalAudioPlays;

    stat.data.dictationCorrectRate = dictationTotal > 0 ? dictationCorrect / dictationTotal : 0;
    stat.data.exampleCorrectRate = exampleTotal > 0 ? exampleCorrect / exampleTotal : 0;

    // 更新平均编辑距离
    stat.data.averageEditDistance = editDistanceCount > 0 ? totalEditDistance / editDistanceCount : 0;

    console.warn('[SoundPrepare] updateSessionStatistics 完成:', {
      sessionDuration: stat.data.sessionDuration,
      dictationDuration: stat.data.dictationDuration,
      exampleDuration: stat.data.exampleDuration,
      audioPlayCount: stat.data.audioPlayCount,
      dictationCorrectRate: stat.data.dictationCorrectRate,
      exampleCorrectRate: stat.data.exampleCorrectRate,
      averageEditDistance: stat.data.averageEditDistance
    });
  }

  checkUserInput(input: string): boolean {
    if (!this.currentWord)
      return false;

    if (this.currentWord.type === SoundWordType.DICTATION) {
      const expected = this.currentWord.word.word.trim().toLowerCase();
      const userInput = input.trim().toLowerCase();
      return userInput === expected;
    } else {
      // TODO 例句匹配逻辑
      return true;
    }
  }
}
