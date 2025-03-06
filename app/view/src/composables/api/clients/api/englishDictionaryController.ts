// @ts-ignore
/* eslint-disable */
import { request } from "~/composables/api/axios";

/** addEnglishDictionary POST /api/english_dictionary/add */
export async function addEnglishDictionaryUsingPost(
  body: API.EnglishDictionaryAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/english_dictionary/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteEnglishDictionary POST /api/english_dictionary/delete */
export async function deleteEnglishDictionaryUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/english_dictionary/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getEnglishDictionaryVOById GET /api/english_dictionary/get/vo */
export async function getEnglishDictionaryVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEnglishDictionaryVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseEnglishDictionaryVO_>(
    "/api/english_dictionary/get/vo",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** importEnglishDictionary POST /api/english_dictionary/import */
export async function importEnglishDictionaryUsingPost(
  body: API.EnglishDictionaryImportRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/english_dictionary/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listEnglishDictionary GET /api/english_dictionary/list */
export async function listEnglishDictionaryUsingGet(options?: {
  [key: string]: any;
}) {
  return request<API.BaseResponseListEnglishDictionaryWithCategoryVO_>(
    "/api/english_dictionary/list",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** listEnglishDictionaryByPage POST /api/english_dictionary/list/page */
export async function listEnglishDictionaryByPageUsingPost(
  body: API.EnglishDictionaryQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEnglishDictionary_>(
    "/api/english_dictionary/list/page",
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

/** listEnglishDictionaryVOByPage POST /api/english_dictionary/list/page/vo */
export async function listEnglishDictionaryVoByPageUsingPost(
  body: API.EnglishDictionaryQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEnglishDictionaryVO_>(
    "/api/english_dictionary/list/page/vo",
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

/** listMyEnglishDictionaryVOByPage POST /api/english_dictionary/my/list/page/vo */
export async function listMyEnglishDictionaryVoByPageUsingPost(
  body: API.EnglishDictionaryQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEnglishDictionaryVO_>(
    "/api/english_dictionary/my/list/page/vo",
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

/** updateEnglishDictionary POST /api/english_dictionary/update */
export async function updateEnglishDictionaryUsingPost(
  body: API.EnglishDictionaryUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/english_dictionary/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
