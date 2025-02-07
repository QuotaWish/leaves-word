// @ts-ignore
/* eslint-disable */
import { request } from "~/composables/api/axios";

/** addDictionaryWord POST /api/dictionary_word/add */
export async function addDictionaryWordUsingPost(
  body: API.DictionaryWordAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/dictionary_word/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteDictionaryWord POST /api/dictionary_word/delete */
export async function deleteDictionaryWordUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/dictionary_word/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getDictionaryWordVOById GET /api/dictionary_word/get/vo */
export async function getDictionaryWordVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictionaryWordVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseDictionaryWordVO_>(
    "/api/dictionary_word/get/vo",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** listDictionaryWordByPage POST /api/dictionary_word/list/page */
export async function listDictionaryWordByPageUsingPost(
  body: API.DictionaryWordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageDictionaryWord_>(
    "/api/dictionary_word/list/page",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** listDictionaryWordVOByPage POST /api/dictionary_word/list/page/vo */
export async function listDictionaryWordVoByPageUsingPost(
  body: API.DictionaryWordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageDictionaryWordVO_>(
    "/api/dictionary_word/list/page/vo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
