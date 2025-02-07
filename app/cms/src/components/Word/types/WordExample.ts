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