export enum DerivationTypeEnum {
  SYNONYM = "同义词",
  ANTONYM = "反义词",
  HYPERNYM = "上位词",
  HYPONYM = "下位词",
  HOLONYM = "整体词",
  MERONYM = "部分词",
  COHYPERNYM = "同上位词",
  COHYPONYM = "同下位词",
  COHYMONYM = "同整体词",
  COMERONYM = "同部分词",
  SIMILAR = "相似词",
  RELATED = "相关词",
  MEANING_CONFUSABLE = "意义易混淆",
  PRONUNCIATION_CONFUSABLE = "发音易混淆",
}

export interface WordDerived {
  id?: number

  type: DerivationTypeEnum;
  content: string;
  data: Map<string, string>;
}

// 校验是否为合法的派生词对象
export function isValidWordDerived(derived: WordDerived): boolean {
  if (!derived) {
    return false;
  }

  if (!derived.type) {
    return false;
  }

  if (!derived.content) {
    return false;
  }

  // if (!derived.data || derived.data.size === 0) {
  //   return false;
  // }

  return true;
}

// 校验是否为合法的派生词对象数组
export function isValidWordDerivedList(derivedList: WordDerived[]): boolean {
  if (!Array.isArray(derivedList)) {
    return false;
  }

  // if (derivedList.length === 0) {
  //   return false;
  // }

  if (derivedList.length > 14) {
    return false;
  }

  return derivedList.every((item) => isValidWordDerived(item));
}
