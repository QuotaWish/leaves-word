// @ts-ignore
/* eslint-disable */
import { request } from "~/composables/api/axios";

/** addEnglishWord POST /api/english_word/add */
export async function addEnglishWordUsingPost(
  body: API.EnglishWordAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/english_word/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** addEnglishWordBatch POST /api/english_word/add/batch */
export async function addEnglishWordBatchUsingPost(
  body: API.EnglishWordAddBatchRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseArrayInt_>("/api/english_word/add/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteEnglishWord POST /api/english_word/delete */
export async function deleteEnglishWordUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/english_word/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getEnglishWordVOById GET /api/english_word/get/vo */
export async function getEnglishWordVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEnglishWordVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseEnglishWordVO_>("/api/english_word/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listEnglishWordByPage POST /api/english_word/list/page */
export async function listEnglishWordByPageUsingPost(
  body: API.EnglishWordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEnglishWord_>(
    "/api/english_word/list/page",
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

/** listEnglishWordVOByPage POST /api/english_word/list/page/vo */
export async function listEnglishWordVoByPageUsingPost(
  body: API.EnglishWordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEnglishWordVO_>(
    "/api/english_word/list/page/vo",
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

/** listMyEnglishWordVOByPage POST /api/english_word/my/list/page/vo */
export async function listMyEnglishWordVoByPageUsingPost(
  body: API.EnglishWordQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEnglishWordVO_>(
    "/api/english_word/my/list/page/vo",
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

/** scoreEnglishWord POST /api/english_word/score */
export async function scoreEnglishWordUsingPost(
  body: API.EnglishWordScoreRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/english_word/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** updateEnglishWord POST /api/english_word/update */
export async function updateEnglishWordUsingPost(
  body: API.EnglishWordUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/english_word/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
