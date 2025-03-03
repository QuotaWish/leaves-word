import { $api } from '../api'

import ErrorAudio from '/sounds/error.mp3'
import SuccessAudio from '/sounds/right.mp3'

export function useWordSound(word: string): Promise<HTMLAudioElement> {
  const url = $api.utils.getWordPronounce(word)

  const audio = new Audio()
  
  // 设置音频属性
  // audio.crossOrigin = "anonymous"
  audio.preload = "auto"
  
  return new Promise((resolve, reject) => {
    // 添加超时处理
    const timeoutId = setTimeout(() => {
      console.warn(`音频加载超时: ${word}`)
      reject(new Error(`音频加载超时: ${word}`))
    }, 8000)
    
    // 添加事件监听器
    audio.oncanplaythrough = () => {
      clearTimeout(timeoutId)
      resolve(audio)
    }
    
    audio.onerror = (e) => {
      clearTimeout(timeoutId)
      console.error(`音频加载错误: ${word}`, e)
      reject(new Error(`音频加载失败: ${word}`))
    }
    
    // 在设置事件后再设置源
    audio.src = url
    audio.load()
  })
}

export function useErrorAudio() {
  const audio = new Audio()
  audio.src = ErrorAudio

  return audio
}

export function useSuccessAudio() {
  const audio = new Audio()
  audio.src = SuccessAudio

  return audio
}
