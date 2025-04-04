import { $api } from '~/composables/api'
import { WORDS_AUDIO } from './constants'

export function useSound(url: string) {
  const audio = new Audio()

  audio.preload = 'auto'
  audio.crossOrigin = 'anonymous'

  return new Promise<HTMLAudioElement>((resolve, reject) => {
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

export function useWordSound(word: string): Promise<HTMLAudioElement> {
  const url = $api.utils.getWordPronounce(word)

  return useSound(url)
}

export function useErrorAudio(): Promise<HTMLAudioElement> {
  return useSound(WORDS_AUDIO.error)
}

export function useSuccessAudio(): Promise<HTMLAudioElement> {
  return useSound(WORDS_AUDIO.success)
}

export function useCherryTapAudio(): Promise<HTMLAudioElement> {
  return useSound(WORDS_AUDIO.cherryTap)
}

export function useVictoryAudio(): Promise<HTMLAudioElement> {
  return useSound(WORDS_AUDIO.victory)
}
