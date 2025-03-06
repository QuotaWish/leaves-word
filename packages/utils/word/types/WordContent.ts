import type { WordAffixPart, WordDerived, WordExample, WordPronounce, WordTransform, WordTranslation } from './index';
import { emptyWordPronounce } from './WordPronounce';

export interface WordContent {
  id?: number;
  britishPronounce: WordPronounce;
  americanPronounce: WordPronounce;
  derived: WordDerived[];
  img: string[];
  // thumbnail: string;
  remember: string;
  story: string;
  transform: WordTransform[];
  translation: WordTranslation[];
  examplePhrases: WordExample[];
  parts: WordAffixPart[];
  backgroundStory: string;
}

export function emptyWordContent(): WordContent {
  return {
    id: 0,
    britishPronounce: emptyWordPronounce(),
    americanPronounce: emptyWordPronounce(),
    derived: [],
    img: [],
    // thumbnail: '',
    remember: '',
    story: '',
    transform: [],
    translation: [],
    examplePhrases: [],
    parts: [],
    backgroundStory: '',
  };
}

export const typeCheckMapper: { [key: string]: (value: any) => boolean } = {
  title: (value) => typeof value === 'string',
  content: (value) => typeof value === 'string',
  author: (value) => typeof value === 'string',
  createdAt: (value) => value instanceof Date,
  britishPronounce: (value) => typeof value === 'object',
  americanPronounce: (value) => typeof value === 'object',
  derived: (value) => Array.isArray(value),
  img: (value) => Array.isArray(value),
  remember: (value) => typeof value === 'string',
  story: (value) => typeof value === 'string',
  transform: (value) => Array.isArray(value),
  translation: (value) => Array.isArray(value),
  examplePhrases: (value) => Array.isArray(value),
  parts: (value) => Array.isArray(value),
  backgroundStory: (value) => typeof value === 'string',
};

/**
 * 传入一个文本，如果符合WordContent的格式，返回实例化后的WordContent，第二个参数表示是否解析成功
 */
export function parseWordContent(text: string): [WordContent | null, boolean, string | undefined] {
  try {
    const parsedData = JSON.parse(text);

    // const targetContent: WordContent = {
    //   id: parsedData.id,
    //   title: parsedData.title,
    //   content: parsedData.content,
    //   author: parsedData.author,
    //   createdAt: new Date(parsedData.createdAt),
    //   britishPronounce: parsedData.britishPronounce,
    //   americanPronounce: parsedData.americanPronounce,
    //   derived: parsedData.derived,
    //   img: parsedData.img,
    //   // thumbnail: parsedData.thumbnail,
    //   remember: parsedData.remember,
    //   story: parsedData.story,
    //   transform: parsedData.transform,
    //   translation: parsedData.translation,
    //   examplePhrases: parsedData.examplePhrases,
    //   parts: parsedData.parts,
    //   backgroundStory: parsedData.backgroundStory,
    // }

    // 检查解析后的数据是否符合 WordContent 的结构

    for (const key of Object.keys(parsedData)) {
      const checker = typeCheckMapper[key];

      if (!checker) {
        return [parsedData, false, `无法找到属性 ${key} 的类型检查函数`]
      }

      if (!checker(parsedData[key])) {
        return [parsedData, false, `属性 ${key} 的值不符合类型要求(${typeof parsedData[key]})`]
      }

    }

    return [parsedData, true, undefined];

    // if (
    //   typeof parsedData.title === 'string' &&
    //   typeof parsedData.content === 'string' &&
    //   typeof parsedData.author === 'string' &&
    //   parsedData.createdAt instanceof Date &&
    //   typeof parsedData.britishPronounce === 'object' &&
    //   typeof parsedData.americanPronounce === 'object' &&
    //   Array.isArray(parsedData.derived) &&
    //   Array.isArray(parsedData.img) &&
    //   // typeof parsedData.thumbnail === 'string' &&
    //   typeof parsedData.remember === 'string' &&
    //   typeof parsedData.story === 'string' &&
    //   Array.isArray(parsedData.wordTransform) &&
    //   Array.isArray(parsedData.translation) &&
    //   Array.isArray(parsedData.examplePhrases) &&
    //   Array.isArray(parsedData.parts) &&
    //   typeof parsedData.backgroundStory === 'string'
    // ) {
    //   return [targetContent, true];
    // } else {
    //   return [targetContent, false];
    // }

  } catch (error) {
    return [null, false, undefined];
  }
}

export function parseDictWord(obj: any) {
  const { wordRank, headWord, content, bookId } = obj
  if ( !wordRank || !headWord || !content || !bookId) 
    throw new Error('Invalid object')

  const wordContent: WordContent = emptyWordContent()

  // TODO

  return wordContent
}