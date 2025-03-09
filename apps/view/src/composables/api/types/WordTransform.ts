import type { WordExample } from './WordExample';

export interface WordTransform {
  id: number;
  type: TransformType;
  content: string;
  data: { [key: string]: string };
  example: WordExample;
}

export enum TransformType {
  NONE = "无变换形式",
  SINGULAR = "单数形式",
  PLURAL = "复数形式",
  ING_FORM = "进行时形式",
  ED_FORM = "过去式形式",
  DONE_FORM = "完成形式",
  DONE_PARTICIPLE = "完成分词形式",
  COMPARATIVE = "比较级形式",
  SUPERLATIVE = "最高级形式",
  POSSESSIVE = "所有格形式",
  TO_INF = "不定式形式",
  TO_ING = "不定式进行时形式",
  TO_PERFECT = "不定式完成时形式",
  TO_PERFECT_CONTINUOUS = "不定式完成进行时形式",
  PASSIVE_VOICE = "被动语态形式",
  CONDITIONAL = "条件式形式",
  SUBJUNCTIVE = "虚拟语气形式"
}

// 校验是否为合法的变换词对象
export function isValidWordTransform(transform: WordTransform): boolean {
  if (!transform) {
    return false;
  }

  // if (!transform.id) {
  //   return false;
  // }

  if (!transform.type) {
    return false;
  }

  if (!transform.content) {
    return false;
  }

  // if (!transform.data || Object.keys(transform.data).length === 0) {
  //   return false;
  // }

  if (!transform.example) {
    return false;
  }

  return true;
}

export function isValidWordTransformList(transformList: WordTransform[]): boolean {
  if (!Array.isArray(transformList)) {
    return false;
  }

  if (!transformList || transformList.length === 0) {
    return false;
  }

  return transformList.every(isValidWordTransform);
}