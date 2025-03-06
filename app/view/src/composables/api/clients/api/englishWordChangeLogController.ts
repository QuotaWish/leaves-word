// @ts-ignore
/* eslint-disable */
import { request } from "~/composables/api/axios";

/** getEnglishWordChangeLogVOById GET /api/english_word_change_log/get/vo */
export async function getEnglishWordChangeLogVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getEnglishWordChangeLogVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseEnglishWordChangeLogVO_>(
    "/api/english_word_change_log/get/vo",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** listEnglishWordChangeLogByPage POST /api/english_word_change_log/list/page */
export async function listEnglishWordChangeLogByPageUsingPost(
  body: API.EnglishWordChangeLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEnglishWordChangeLog_>(
    "/api/english_word_change_log/list/page",
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

/** listEnglishWordChangeLogVOByPage POST /api/english_word_change_log/list/page/vo */
export async function listEnglishWordChangeLogVoByPageUsingPost(
  body: API.EnglishWordChangeLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEnglishWordChangeLogVO_>(
    "/api/english_word_change_log/list/page/vo",
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

/** listMyEnglishWordChangeLogVOByPage POST /api/english_word_change_log/my/list/page/vo */
export async function listMyEnglishWordChangeLogVoByPageUsingPost(
  body: API.EnglishWordChangeLogQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageEnglishWordChangeLogVO_>(
    "/api/english_word_change_log/my/list/page/vo",
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
