import SoundWord from "~/components/words/mode/sound/index.vue";
import SoundStatistics from "~/components/statistics/SoundStatistics.vue";
import { PrepareWord, SignMode, ModeType } from "../../../modules/words/core/mode";
import { Component, defineAsyncComponent } from "vue";
import {
  calendarManager,
  globalData,
  IWordItem,
  Statistics,
  useWordSound,
} from "../../../modules/words/core/word";
import type { IWord } from "../../../modules/words/core/word";

// 定义常量
// const NEW_WORDS_PER_SESSION = 10 // 每次学习新单词的数量

const PRELOAD_WORD_AMO = 5;

// 扩展ModeType枚举
declare module '.' {
  export enum ModeType {
    SOUND = 'sound'
  }
}

export enum SoundWordType {
  DICTATION = "dictation", // 听写模式
  EXAMPLE = "example", // 例句模式
}

export enum ExampleStage {
  PLUS_ONE = 0, // 前一个单词 + 单词本身
  PERCENT_WORD = 1, // 单词的 70% 部分 + 单词本身
  FULL_SENTENCE = 2, // 整个例句
}

export enum WordState {
  INIT = "init", // 初始状态
  PLAYING = "playing", // 播放音频中
  WAITING = "waiting", // 等待输入
  CORRECT = "correct", // 答案正确
  ERROR = "error", // 答案错误
  TRANSITIONING = "transitioning", // 过渡到下一个单词
  FADE_OUT = "fade-out", // 淡出状态
  FADE_IN = "fade-in", // 淡入状态
}

export interface IDisplayChar {
  /**
   * 字符
   */
  char: string;
  /**
   * 是否输入
   */
  isInput: boolean;
  /**
   * 是否光标
   */
  isCursor: boolean;
  /**
   * 是否正确
   */
  isCorrect: boolean;
  /**
   * 是否错误
   */
  isError: boolean;
  /**
   * 是否空
   */
  isEmpty: boolean;
  /**
   * 是否标点
   */
  isPunctuation: boolean;
  /**
   * 是否空格
   */
  isSpace: boolean;
  /**
   * 原始字符（用于显示在下划线上方）
   */
  originalChar?: string;
  /**
   * 是否显示原始字符
   */
  showOriginal?: boolean;
  /**
   * 是否显示下划线
   */
  showUnderline?: boolean;
}

export interface IDisplayText {
  displayChars: IDisplayChar[];
}

/**
 * 例句分词功能
 *
 * 1. 首先是单词对应的前一个单词/后一个单词（随机 如果没有的话就切换另外一个） + 单词本身
 * 2. 单词的 70% 部分 + 单词本身
 * 3. 整个例句
 *
 * 返回一个数组，按照给定的要求
 */
export function splitExampleSentence(
  sentence: string
): [string[], string[], string[]] {
  // 将句子按空格分词
  const words = sentence.split(/\s+/);

  // 如果句子为空或只有一个单词，直接返回
  if (words.length <= 1) {
    return [words, words, words];
  }

  // 第一步：找到重点单词
  // 选择目标单词的索引（首选中间偏后的位置）
  const wordIndex = Math.floor(words.length / 2);
  const targetWord = words[wordIndex < words.length ? wordIndex : words.length - 1];

  console.warn(`%c[分段信息] 原始句子: "${sentence}"`, 'color: #673AB7; font-weight: bold;');
  console.warn(`%c[分段信息] 目标单词: "${targetWord}", 索引: ${wordIndex}`, 'color: #FF9800; font-weight: bold;');

  // 第一阶段：重点单词前后一个字符
  // 如果没有后面就用前面，以此类推
  const stage1: string[] = [];

  // 如果有前面的单词，添加前面一个单词
  if (wordIndex > 0) {
    stage1.push(words[wordIndex - 1]);
  }

  // 添加目标单词
  stage1.push(targetWord);

  // 如果有后面的单词，添加后面一个单词
  if (wordIndex < words.length - 1) {
    stage1.push(words[wordIndex + 1]);
  }
  // 如果没有后面的单词，但有更前面的单词，添加更前面的单词
  else if (wordIndex > 1) {
    stage1.unshift(words[wordIndex - 2]);
  }

  // 第二阶段：整个句子的70%部分，从前往后到重点单词或从后往前到重点单词
  const stage2: string[] = [];
  const sentenceLength70Percent = Math.ceil(words.length * 0.7);

  // 确保目标单词在第二阶段中
  // 计算开始索引，确保目标单词在结果中
  let startIndex = 0;

  // 从前向后到目标单词
  if (wordIndex < words.length / 2) {
    // 目标单词在前半部分，从头开始取70%的单词
    startIndex = 0;
  } else {
    // 目标单词在后半部分，确保目标单词包含在内，从后向前计算开始位置
    startIndex = Math.max(0, wordIndex - Math.floor(sentenceLength70Percent / 2));
  }

  // 获取70%部分
  stage2.push(...words.slice(startIndex, Math.min(startIndex + sentenceLength70Percent, words.length)));

  // 第三阶段：完整句子
  const stage3 = [...words];

  console.warn(`%c[分段信息] 阶段1: "${stage1.join(' ')}"`, 'color: #4CAF50; font-weight: bold;');
  console.warn(`%c[分段信息] 阶段2: "${stage2.join(' ')}"`, 'color: #2196F3; font-weight: bold;');
  console.warn(`%c[分段信息] 阶段3: "${stage3.join(' ')}"`, 'color: #9C27B0; font-weight: bold;');

  return [stage1, stage2, stage3];
}

/**
 * 将例句转换格式
 *
 * 1. 转换为分词数组
 * 2. 忽略标点和空格
 * 3. 返回分词数组
 */
export function convertExampleSentenceToWords(sentence: string) {
  const [sentenceOne, sentenceTwo, words] = splitExampleSentence(sentence);

  const filterSentence = (sentence: string[]) => {
    return sentence.filter((word) => word.trim() !== "");
  };

  const [filterSentenceOne, filterSentenceTwo, filterWords] = [
    filterSentence(sentenceOne),
    filterSentence(sentenceTwo),
    filterSentence(words),
  ];

  return {
    origin: [sentenceOne, sentenceTwo, words],
    filter: [filterSentenceOne, filterSentenceTwo, filterWords],
  };
}

export interface ISoundWordItem {
  word: IWordItem;
  type: SoundWordType;

  exampleStage?: ExampleStage;
  exampleParts?: string[][];
  exampleOrigin?: string[][];
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
      attempts: number
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

export class SoundStatistics {
  type: string = 'SOUND';
  startTime: number;
  endTime: number;
  cost: number;
  data: Partial<ISoundStatData>;

  constructor(mode?: any, statistics?: any) {
    if (statistics) {
      this.startTime = statistics.startTime || Date.now();
      this.endTime = statistics.endTime || Date.now();
      this.cost = statistics.cost || 0;
      this.data = statistics.data || this.getDefaultData();
    } else if (mode) {
      this.startTime = mode.startTime || Date.now();
      this.endTime = mode.endTime || Date.now();
      this.cost = (this.endTime - this.startTime) || 0;
      this.data = this.getDefaultData();
    } else {
      this.startTime = Date.now();
      this.endTime = Date.now();
      this.cost = 0;
      this.data = this.getDefaultData();
    }
  }

  private getDefaultData(): Partial<ISoundStatData> {
    return {
      dictationWords: 0,
      exampleWords: 0,
      exampleStageStats: {},
      wordsDetails: [],
      sessionDuration: 0,
      dictationDuration: 0,
      exampleDuration: 0,
      audioPlayCount: 0,
      dictationCorrectRate: 0,
      exampleCorrectRate: 0,
      averageEditDistance: 0
    };
  }

  getDisplayComponent(): Component {
    return SoundStatistics
  }

  static parseStatistics(statistics: any) {
    return new SoundStatistics(undefined, statistics);
  }
}

export class SoundPrepareWord {
  mode: SoundMode;
  currentWord: ISoundWordItem | null = null;
  wordIndex: number = 0;
  taskAmount: number = 0;
  startTime: number = 0;
  endTime: number = 0;
  statistics: SoundStatistics = new SoundStatistics();
  wordStartTime: number = 0;
  audioPlayCount: number = 0;
  wordsQueue: ISoundWordItem[] = [];
  wordsDisplayed: string[] = [];
  wordsFinished: IWordItem[] = [];

  constructor(mode: SoundMode) {
    this.mode = mode;
    this.onCreated();
  }

  onCreated(): void {
    const globalAmo = globalData.value.amount;
    const storage = this.mode.dictionaryStorage;
    const unlearnedWords = storage.getUnlearnedWords();
    const amo = Math.min(globalAmo, unlearnedWords.length);

    this.taskAmount = amo;
    this.startTime = Date.now();
    this.wordStartTime = Date.now();
    this.statistics = new SoundStatistics(this);
  }

  async preload(callback: (progress: number) => void): Promise<boolean> {
    // 简化实现
    this.wordIndex = 0;
    return true;
  }

  async previous(): Promise<boolean> {
    if (this.wordIndex > 0) {
      this.wordIndex--;
      this.currentWord = this.wordsQueue[this.wordIndex];
      return true;
    }
    return false;
  }

  async finish(): Promise<boolean> {
    this.endTime = Date.now();
    return true;
  }

  getLeftWords(): number {
    return this.wordsQueue.length - this.wordIndex;
  }

  async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  checkUserInput(input: string): boolean {
    if (!this.currentWord) return false;
    
    if (this.currentWord.type === SoundWordType.DICTATION) {
      const expected = this.currentWord.word.mainWord.word.trim().toLowerCase();
      const userInput = input.trim().toLowerCase();
      return userInput === expected;
    } else {
      // 简化的例句匹配逻辑
      return true;
    }
  }

  getStatistics(): SoundStatistics {
    return this.statistics;
  }

  recordAudioPlay(): void {
    this.audioPlayCount++;
  }

  recordWordLearningData(success: boolean): void {
    if (!this.currentWord) return;

    const timeSpent = Date.now() - this.wordStartTime;
    const stat = this.getStatistics();
    
    if (!stat.data.wordsDetails) {
      stat.data.wordsDetails = [];
    }

    const wordDetails = [...stat.data.wordsDetails];
    const wordText = this.currentWord.word.mainWord.word;
    const detailIndex = wordDetails.findIndex(d => 
      d.word === wordText && d.type === this.currentWord?.type
    );

    if (detailIndex === -1) {
      const newDetail: SoundWordDetail = {
        word: wordText,
        type: this.currentWord.type,
        attempts: 1,
        isCorrect: success,
        timeSpent,
        audioPlays: this.audioPlayCount,
        userInputs: []
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
    this.audioPlayCount = 0;
    this.wordStartTime = Date.now();

    this.updateBasicStats(success);
  }

  updateBasicStats(success: boolean): void {
    if (!this.currentWord) return;
    
    const stat = this.getStatistics();
    
    if (this.currentWord.type === SoundWordType.DICTATION) {
      stat.data.dictationWords = (stat.data.dictationWords || 0) + 1;
    } else if (this.currentWord.type === SoundWordType.EXAMPLE) {
      if (this.currentWord.exampleStage === ExampleStage.FULL_SENTENCE) {
        stat.data.exampleWords = (stat.data.exampleWords || 0) + 1;
      }
      
      if (this.currentWord.exampleStage !== undefined) {
        if (!stat.data.exampleStageStats) {
          stat.data.exampleStageStats = {};
        }
        
        const stage = this.currentWord.exampleStage;
        const stats = stat.data.exampleStageStats;
        
        if (!stats[stage]) {
          stats[stage] = {
            completed: success ? 1 : 0,
            attempts: 1
          };
        } else {
          stats[stage].attempts++;
          if (success) {
            stats[stage].completed++;
          }
        }
      }
    }
  }

  updateSessionStatistics(): void {
    const details = this.statistics.data.wordsDetails || [];
    if (details.length === 0) return;
    
    let dictationTotal = 0;
    let dictationCorrect = 0;
    let exampleTotal = 0;
    let exampleCorrect = 0;
    let totalAudioPlays = 0;
    let dictationDuration = 0;
    let exampleDuration = 0;
    
    details.forEach(detail => {
      totalAudioPlays += detail.audioPlays || 0;
      
      if (detail.type === SoundWordType.DICTATION) {
        dictationTotal++;
        if (detail.isCorrect) dictationCorrect++;
        dictationDuration += detail.timeSpent;
      } else if (detail.type === SoundWordType.EXAMPLE) {
        exampleTotal++;
        if (detail.isCorrect) exampleCorrect++;
        exampleDuration += detail.timeSpent;
      }
    });
    
    const stat = this.statistics;
    stat.data.sessionDuration = Date.now() - this.startTime;
    stat.data.dictationDuration = dictationDuration;
    stat.data.exampleDuration = exampleDuration;
    stat.data.audioPlayCount = totalAudioPlays;
    
    stat.data.dictationCorrectRate = dictationTotal > 0 ? dictationCorrect / dictationTotal : 0;
    stat.data.exampleCorrectRate = exampleTotal > 0 ? exampleCorrect / exampleTotal : 0;
  }

  async next(success: boolean): Promise<boolean> {
    this.recordWordLearningData(success);
    this.updateSessionStatistics();
    
    // 具体实现
    this.wordIndex++;
    this.currentWord = this.wordsQueue[this.wordIndex];
    return true;
  }

  getTargetComponent(): Component {
    return SoundWord;
  }
}

export class SoundMode extends SignMode {
  getMainColor(): string {
    return "#3498db";
  }

  getModeIcon(): string {
    return "🔊";
  }

  getModeDesc() {
    return "通过听力和例句提高词汇掌握程度";
  }

  getModeName() {
    return "音析模式";
  }

  prepareWords(): PrepareWord<any, any, any> {
    return new SoundPrepareWord(this) as unknown as PrepareWord<any, any, any>;
  }

  getEstimateCost(amount: number): number {
    return amount * 0.5;
  }
}

// 添加日志工具函数
export function useLogger(module: string) {
  return {
    log: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #2196F3; font-size: 12px;', data || '');
    },
    error: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #F44336; font-size: 12px;', data || '');
    },
    success: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #4CAF50; font-size: 12px;', data || '');
    },
    info: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #9C27B0; font-size: 12px;', data || '');
    },
    warn: (message: string, data?: any) => {
      console.log(`%c[${module}] ${message}`, 'color: #FF9800; font-size: 12px;', data || '');
    }
  };
}

// 音频播放hook
export function useSoundPlayer() {
  const logger = useLogger('SoundPlayer');
  const isPlayingAudio = ref(false);
  const audioFinished = ref(true);

  // 添加这些变量
  let lastAudio: HTMLAudioElement | null = null;
  let audioThrottleTimer: number | null = null;
  let pendingAudioSource: string | null = null;

  // 音频播放核心函数
  async function playAudioCore(
    audioSource: string, 
    onStart: () => void,
    onFinish: () => void,
    onError: () => void,
    prepareWord?: SoundPrepareWord
  ) {
    if (prepareWord) {
      prepareWord.recordAudioPlay();
    }
    
    // 在这里实现音频播放逻辑
    onStart();
    
    // 模拟音频播放完成
    setTimeout(() => {
      onFinish();
    }, 1000);
  }

  // 节流播放函数
  function playAudio(
    audioSource: string, 
    onStart: () => void,
    onFinish: () => void,
    onError: () => void,
    prepareWord?: SoundPrepareWord
  ) {
    return playAudioCore(audioSource, onStart, onFinish, onError, prepareWord);
  }

  return { playAudio };
}

// 状态管理hook
export function useWordStateManager() {
  const logger = useLogger('WordStateManager');
  const wordState = ref<WordState>(WordState.INIT);

  function setWordState(newState: WordState) {
    if (wordState.value === undefined) {
      logger.error(`尝试从undefined设置状态为${newState}`);
    }

    const oldState = wordState.value;
    wordState.value = newState;

    logger.log(`状态变化: ${oldState} -> ${newState}`);
  }

  return {
    wordState,
    setWordState
  };
}

// 输入检查hook
export function useInputChecker(prepareData: SoundPrepareWord) {
  const logger = useLogger('InputChecker');

  function checkExampleInput(userInput: string, exampleDisplay: string): boolean {
    // 如果任一输入为空，直接返回false
    if (!userInput.trim() || !exampleDisplay.trim()) {
      logger.error('输入或期望例句为空');
      return false;
    }

    // 增强的清理函数，更好地处理各种标点和空格
    const cleanText = (text: string): string => {
      return text
        .toLowerCase()               // 转小写
        .replace(/\s+/g, '')         // 移除所有空白字符
        .replace(/[.,!?;:'"–—()[\]{}<>""'']/g, '') // 移除所有标点符号
        .trim();                     // 去除首尾空格
    };

    // 清理用户输入和期望文本
    const cleanUserInput = cleanText(userInput);
    const cleanExpectedText = cleanText(exampleDisplay);

    // 记录日志以便调试
    logger.log(`原始用户输入: "${userInput}"`);
    logger.log(`原始期望文本: "${exampleDisplay}"`);
    logger.log(`清理后用户输入: "${cleanUserInput}"`);
    logger.log(`清理后期望文本: "${cleanExpectedText}"`);
    logger.log(`对比结果: ${cleanUserInput === cleanExpectedText ? '匹配' : '不匹配'}`);

    // 添加模糊匹配逻辑：如果用户输入包含期望文本的90%以上的字符
    if (cleanUserInput.length > 0 && cleanExpectedText.length > 0) {
      // 当两个文本接近但不完全相同时，计算相似度
      if (cleanUserInput !== cleanExpectedText &&
        (cleanUserInput.includes(cleanExpectedText) ||
          cleanExpectedText.includes(cleanUserInput))) {

        // 计算Levenshtein距离（编辑距离）
        const maxLength = Math.max(cleanUserInput.length, cleanExpectedText.length);
        const similarityThreshold = 0.9; // 90%相似度阈值

        // 如果较长文本包含较短文本，且长度差距不超过总长度的10%，认为是匹配的
        const lengthDiff = Math.abs(cleanUserInput.length - cleanExpectedText.length);
        const similarityRatio = 1 - (lengthDiff / maxLength);

        if (similarityRatio >= similarityThreshold) {
          logger.log(`模糊匹配成功，相似度: ${similarityRatio}`);
          return true;
        }
      }
    }

    // 精确匹配
    return cleanUserInput === cleanExpectedText;
  }

  function checkDictationInput(userInput: string): boolean {
    return prepareData.checkUserInput(userInput);
  }

  return {
    checkExampleInput,
    checkDictationInput
  };
}

// 例句队列管理hook
export function useExampleQueueManager() {
  const logger = useLogger('ExampleQueueManager');
  const exampleQueue = ref<ISoundWordItem[]>([]);

  function addExampleToQueue(wordItem: IWordItem, stage: ExampleStage = ExampleStage.PLUS_ONE) {
    const exampleWord: ISoundWordItem = {
      type: SoundWordType.EXAMPLE,
      word: wordItem,
      exampleStage: stage,
    };
    exampleQueue.value.push(exampleWord);
    logger.log(`添加例句到队列，当前队列长度: ${exampleQueue.value.length}`);
  }

  function getNextExample(): ISoundWordItem | null {
    if (exampleQueue.value.length === 0) {
      return null;
    }
    return exampleQueue.value.shift() || null;
  }

  function hasExamples(): boolean {
    return exampleQueue.value.length > 0;
  }

  function getQueueLength(): number {
    return exampleQueue.value.length;
  }

  return {
    exampleQueue,
    addExampleToQueue,
    getNextExample,
    hasExamples,
    getQueueLength
  };
}
