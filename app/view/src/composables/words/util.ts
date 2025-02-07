import { $api } from '../api'

import ErrorAudio from '/sounds/error.mp3'
import SuccessAudio from '/sounds/right.mp3'

export function useWordSound(word: string): Promise<HTMLAudioElement> {
  const url = $api.utils.getWordPronounce(word)

  const audio = new Audio()
  audio.src = url

  return new Promise((resolve, reject) => {
    audio.oncanplaythrough = () => resolve(audio)
    audio.onerror = reject
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
