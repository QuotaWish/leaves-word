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

  return pronounce.content !== '' && pronounce.audio !== '';
}