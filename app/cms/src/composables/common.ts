import { REMOTE_BASE_AUDIO } from '@/constants';

export enum SpeechType {
  BRITISH = 1,
  AMERICAN = 2,
}

export function useRemoteAudio() {
  const generate = (content: string, type: SpeechType = SpeechType.BRITISH) => {
    const url = new URL(REMOTE_BASE_AUDIO)

    url.searchParams.append('type', type.toString())
    url.searchParams.append('audio', content)

    return url.toString()
  }

  return {
    generate
  }
}