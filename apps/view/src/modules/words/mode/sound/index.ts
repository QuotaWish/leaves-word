import type { LeafWordData } from '../..'
import type { WordExample } from '~/composables/api/types'
import { SignMode } from '..'
import { SoundPrepareWord } from './prepare'

export * from './prepare'

export enum SoundWordType {
  DICTATION = "dictation", // 听写模式
  EXAMPLE = "example", // 例句模式
}

export enum SoundExampleStage {
  NONE = -1, // 无例句
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

export interface ISoundWordItem {
  word: LeafWordData,
  type: SoundWordType,

  example: {
    stage: SoundExampleStage,
    parts: string[],
    origin?: WordExample
  },
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

export class SoundMode extends SignMode {
  getModeIcon(): string {
    return '🔊'
  }

  getModeDesc() {
    return '通过听力和例句提高词汇掌握程度'
  }

  getModeName() {
    return '音析模式'
  }

  getMainColor(): string {
    return '#3498db'
  }

  prepareWords() {
    return new SoundPrepareWord(this)
  }

  getEstimateCost(amount: number): number {
    return amount * 0.5
  }
}
