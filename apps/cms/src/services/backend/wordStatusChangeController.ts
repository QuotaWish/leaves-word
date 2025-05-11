// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** listStatusChangeByPage POST /api/word_status_change/list/page */
export async function listStatusChangeByPageUsingPost(
  body: API.EnglishWordStatusChangeQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageWordStatusChangeVO_>('/api/word_status_change/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listRecord GET /api/word_status_change/list/record */
export async function listRecordUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listRecordUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/word_status_change/list/record', {
    method: 'GET',
    params: {
      // lastId has a default value: -1
      lastId: '-1',
      ...params,
    },
    ...(options || {}),
  });
}

/** selectOne GET /api/word_status_change/selectOne */
export async function selectOneUsingGet12(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectOneUsingGET12Params,
  options?: { [key: string]: any },
) {
  return request<API.WordStatusChange>('/api/word_status_change/selectOne', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
