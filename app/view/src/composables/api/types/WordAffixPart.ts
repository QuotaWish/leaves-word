// src/components/Word/types/WordAffixType.ts
export enum WordAffixType {
  "NONE" = "整体",
  "PREFIX" = "前缀",
  "SUFFIX" = "后缀",
  "INFIX" = "中缀",
  "ACRONYM" = "缩略词",
  "ROOT" = "词根",
  "STEM" = "词干"
}

export const WordAffixTypeDescription: { [key in WordAffixType]: string } = {
  [WordAffixType.NONE]: "单词本身",
  [WordAffixType.PREFIX]: "添加在单词前面的词素",
  [WordAffixType.SUFFIX]: "添加在单词后面的词素",
  [WordAffixType.INFIX]: "插入在单词中间的词素",
  [WordAffixType.ACRONYM]: "由单词的首字母组成的缩写",
  [WordAffixType.ROOT]: "单词的基本部分",
  [WordAffixType.STEM]: "去除形态变化后的单词核心部分"
};

export interface WordAffixPart {
  id?: number;

  type: WordAffixType;
  content: string;
  data: { [key: string]: string };
  description: string;
}

export function isValidWordAffixPart(affixPart: WordAffixPart): boolean {
  if (!affixPart) {
    return false;
  }

  if (!affixPart.type) {
    return false;
  }

  if (!affixPart.content) {
    return false;
  }

  return true;
}

export function isValidWordAffixPartList(affixPartList: WordAffixPart[]): boolean {
  if (!Array.isArray(affixPartList)) {
    return false;
  }

  if (!affixPartList || affixPartList.length === 0) {
    return false;
  }

  return affixPartList.every(isValidWordAffixPart);
}