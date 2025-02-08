// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建词典单词表 POST /api/dictionary_word/add */
export async function addDictionaryWordUsingPost(
  body: API.DictionaryWordAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/dictionary_word/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量关联词典和单词 POST /api/dictionary_word/add/batch */
export async function addDictionaryWordBatchUsingPost(
  body: API.EnglishWordRelativeBatchRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseArrayInt_>('/api/dictionary_word/add/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除词典单词表 POST /api/dictionary_word/delete */
export async function deleteDictionaryWordUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/dictionary_word/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据 id 获取词典单词表（封装类） GET /api/dictionary_word/get/vo */
export async function getDictionaryWordVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictionaryWordVOByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseDictionaryWordVO_>('/api/dictionary_word/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 根据某个词典获取对应的关系列表 POST /api/dictionary_word/list/batch */
export async function listDictionaryWordBatchUsingPost(
  body: API.DictionaryWordQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListDictionaryWord_>('/api/dictionary_word/list/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取词典单词表列表（仅管理员可用） POST /api/dictionary_word/list/page */
export async function listDictionaryWordByPageUsingPost(
  body: API.DictionaryWordQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageDictionaryWord_>('/api/dictionary_word/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 分页获取词典单词表列表（封装类） POST /api/dictionary_word/list/page/vo */
export async function listDictionaryWordVoByPageUsingPost(
  body: API.DictionaryWordQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageDictionaryWordVO_>('/api/dictionary_word/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
