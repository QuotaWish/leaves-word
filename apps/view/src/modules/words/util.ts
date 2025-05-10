import type { WordContent } from '~/composables/api/types'
import { $api } from '~/composables/api'
import { WORDS_AUDIO } from './constants'

export interface HTMLAudioSoundElement extends HTMLAudioElement {
  getTimer: () => number
  waitForPlay: () => Promise<void>
}

export function useSound(url: string) {
  const audio = new Audio() as HTMLAudioSoundElement

  audio.preload = 'auto'
  // audio.crossOrigin = 'anonymous'

  audio.getTimer = () => {
    return audio.duration
  }

  audio.waitForPlay = () => {
    return new Promise<void>((resolve) => {
      audio.play()

      audio.onended = () => {
        resolve()
      }
    })
  }

  return new Promise<HTMLAudioSoundElement>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      console.warn(`Audio load timeout: ${url}`)
      reject(new Error(`Audio load timeout: ${url}`))
    }, 8000)

    audio.oncanplaythrough = () => {
      clearTimeout(timeoutId)
      resolve(audio)
    }

    audio.onerror = (e) => {
      clearTimeout(timeoutId)
      console.error(`Audio load error: ${url}`, e)
      reject(new Error(`Audio load error: ${url}`))
    }

    audio.src = url
    audio.load()

    return audio
  })
}

export function useWordSound(word: string): Promise<HTMLAudioSoundElement> {
  const url = $api.utils.getWordPronounce(word)

  return useSound(url)
}

export function useErrorAudio(): Promise<HTMLAudioSoundElement> {
  return useSound(WORDS_AUDIO.error)
}

export function useSuccessAudio(): Promise<HTMLAudioSoundElement> {
  return useSound(WORDS_AUDIO.success)
}

export function useCherryTapAudio(): Promise<HTMLAudioSoundElement> {
  return useSound(WORDS_AUDIO.cherryTap)
}

export function useVictoryAudio(): Promise<HTMLAudioSoundElement> {
  return useSound(WORDS_AUDIO.victory)
}

const TRANSFORM_TYPE_MAP = {
  ADJECTIVE: 'adj',
  ADJ: 'adj',
  NOUN: 'n',
  VERB: 'v',
  ADVERB: 'adv',
  PHRASE: 'phr',
  NUMBER: 'num',
  EXPRESSION: 'exp',
  PRONOUN: 'pron',
  PREPOSITION: 'prep',
  CONJUNCTION: 'conj',
  INTERJECTION: 'interj',
  ARTICLE: 'art',
}

/**
 * 转换类型为缩写形式
 * @param type 类型文本
 *
 * - ADJECTIVE -> adj
 * - NOUN -> n
 * - VERB -> v
 * - ADVERB -> adv
 * - PHRASE -> phr
 * - NUMBER -> num
 * - EXPRESSION -> exp
 * - PRONOUN -> pron
 * - PREPOSITION -> prep
 * - CONJUNCTION -> conj
 * - INTERJECTION -> interj
 * - ARTICLE -> art
 */
export function transformDisplayType(type: string) {
  const res = TRANSFORM_TYPE_MAP[(type.toUpperCase()) as keyof typeof TRANSFORM_TYPE_MAP]

  if (!res) {
    console.warn(`Transform type error: ${type}`)
  }

  return res || type
}

/**
 * 格式化显示类型
 * @param word 单词内容
 * @param len 显示数量（默认显示1个）
 * @param splitChar 分割符（默认分号）
 */
export function formatDisplayType(word: WordContent, len = 1, splitChar = ';') {
  let content = ''
  let amo = 0

  for (const translation of word.translation) {
    if (amo >= len) {
      break
    }

    if (content) {
      content = `${content}${splitChar}`
    }

    content += `${transformDisplayType(translation.type)}.`
    amo += 1
  }

  return content
}

const DERIVED_TYPE_MAP = {
  SYNONYM: {
    name: '同义词',
    description: '与原词意义相同或相近的词',
  },
  ANTONYM: {
    name: '反义词',
    description: '与原词意义相对的词',
  },
  HYPERNYM: {
    name: '上位词',
    description: '比原词更广泛的词',
  },
  HYPONYM: {
    name: '下位词',
    description: '比原词更具体的词',
  },
  HOLONYM: {
    name: '整体词',
    description: '包含原词的整体',
  },
  MERONYM: {
    name: '部分词',
    description: '原词的一部分',
  },
  COHYPERNYM: {
    name: '同上位词',
    description: '与原词有相同上位词的词',
  },
  COHYPONYM: {
    name: '同下位词',
    description: '与原词有相同下位词的词',
  },
  COHYMONYM: {
    name: '同整体词',
    description: '与原词有相同整体的词',
  },
  COMERONYM: {
    name: '同部分词',
    description: '与原词有相同部分的词',
  },
  SIMILAR: {
    name: '相似词',
    description: '与原词在某些方面相似的词',
  },
  RELATED: {
    name: '相关词',
    description: '与原词在某些方面相关的词',
  },
  MEANING_CONFUSABLE: {
    name: '意义易混淆',
    description: '与原词在意义上容易混淆的词',
  },
  PRONUNCIATION_CONFUSABLE: {
    name: '发音易混淆',
    description: '与原词在发音上容易混淆的词',
  },
}
/**
 * 转换衍生词类型
 * @param type 类型文本
 *
 * - SYNONYM -> 同义词
 * - ANTONYM -> 反义词
 * - HYPERNYM -> 上位词
 * - HYPONYM -> 下位词
 * - HOLONYM -> 整体词
 * - MERONYM -> 部分词
 * - COHYPERNYM -> 同上位词
 * - COHYPONYM -> 同下位词
 * - COHYMONYM -> 同整体词
 * - COMERONYM -> 同部分词
 * - SIMILAR -> 相似词
 * - RELATED -> 相关词
 * - MEANING_CONFUSABLE -> 意义易混淆
 * - PRONUNCIATION_CONFUSABLE -> 发音易混淆
 */
export function transformDerivedType(type: string) {
  const res = DERIVED_TYPE_MAP[(type.toUpperCase()) as keyof typeof DERIVED_TYPE_MAP]

  if (!res) {
    console.warn(`Transform derived type error: ${type}`)
  }

  return res || {
    name: type,
    description: 'Unknown',
  }
}

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
