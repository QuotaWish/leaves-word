export interface WordPronounce {
  content: string;
  audio: string;
  description: string;
  info: { [key: string]: string };
}

export function emptyWordPronounce(): WordPronounce {
  return {
    content: '',
    audio: '',
    description: '',
    info: {},
  };
}

export function isValidPronounce(pronounce: WordPronounce): boolean {
  if ( !pronounce ) return false

  return pronounce.content.length > 0 && pronounce.audio.length > 0;
}