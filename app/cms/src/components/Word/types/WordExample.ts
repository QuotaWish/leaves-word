import { useRemoteAudio } from '@/composables/common';
import { emptyWordPronounce, type WordPronounce } from './WordPronounce';

export enum WordExampleTypeEnum {
  SENTENCE = "SENTENCE",
  PHRASE = "PHRASE",
}

export interface WordExample {
  type: WordExampleTypeEnum;
  addon: string;
  highlight: string;
  sentence: string;
  translation: string;
  audio: WordPronounce;
}

export function emptyExample() {
  return {
    type: WordExampleTypeEnum.SENTENCE,
    addon: '',
    highlight: '',
    sentence: '',
    translation: '',
    audio: emptyWordPronounce(),
  } as WordExample;
}

export function useFormatExample() {
  const { generate } = useRemoteAudio();

  return {
    format: (example: WordExample) => {
      const { audio } = example

      if (audio.audio) return

      if (!audio.content) {
        audio.content = example.sentence
      }

      if (audio.content) {
        audio.audio = generate(audio.content)
      }

      return example
    }
  }
}
