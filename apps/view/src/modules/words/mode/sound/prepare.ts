import type { Component } from 'vue'
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
    return new SoundStatistics(this)
  }

  onCreated(): void {
    const preference = globalPreference.value
    const amo = Math.max(preference.amount, 0)
    this.taskAmount = amo
    this.startTime = Date.now()
    this.wordStartTime = Date.now()
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

    // 如果当前是听写模式且回答正确，添加例句任务
    if (success && currentWord.type === SoundWordType.DICTATION) {
      // 将单词添加到例句任务
      this.wordsQueue.push({
        ...currentWord,
        word: currentWord.word,
        type: SoundWordType.EXAMPLE,
      });
      logDebug('Added example task for word:', currentWord.word.word);
    } else if (success && currentWord.type === SoundWordType.EXAMPLE) {
      // 如果是例句模式并回答正确
      const currentStage = currentWord.example.stage || 0;

      if (currentStage < SoundExampleStage.FULL_SENTENCE) {
        // 如果还没完成所有阶段，添加下一阶段
        this.wordsQueue.push({
          word: currentWord.word,
          type: SoundWordType.EXAMPLE,
          example: {
            stage: currentStage + 1,
            parts: currentWord.example.parts,
            origin: currentWord.example.origin,
          },
        });
        logDebug('Added next example stage for word:', currentWord.word.word, 'new stage:', currentStage + 1);
      } else {
        // 所有阶段完成，记录为已学习
        this.wordsFinished.push(currentWord.word);
        this.mode.dictionaryStorage.setLearned(currentWord.word.word);
        logDebug('Word completed all stages:', currentWord.word.word);
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
      if (this.currentWord.example.stage === SoundExampleStage.FULL_SENTENCE) {
        stat.data.exampleWords = (stat.data.exampleWords || 0) + 1
      }

      if (this.currentWord.example.stage !== undefined) {
        if (!stat.data.exampleStageStats) {
          stat.data.exampleStageStats = {}
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

    const stat = this.statistics!;
    stat.data.sessionDuration = Date.now() - this.startTime;
    stat.data.dictationDuration = dictationDuration;
    stat.data.exampleDuration = exampleDuration;
    stat.data.audioPlayCount = totalAudioPlays;

    stat.data.dictationCorrectRate = dictationTotal > 0 ? dictationCorrect / dictationTotal : 0;
    stat.data.exampleCorrectRate = exampleTotal > 0 ? exampleCorrect / exampleTotal : 0;
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
