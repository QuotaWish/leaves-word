// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getCurrentUserConfig GET /api/user_config/get */
export async function getCurrentUserConfigUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseUserConfigVO_>('/api/user_config/get', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getPublicUserConfig GET /api/user_config/public */
export async function getPublicUserConfigUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPublicUserConfigUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserConfigVO_>('/api/user_config/public', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** selectOne GET /api/user_config/select */
export async function selectOneUsingGet11(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectOneUsingGET11Params,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseUserConfigVO_>('/api/user_config/select', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateCurrentUserConfig POST /api/user_config/update */
export async function updateCurrentUserConfigUsingPost(
  body: API.UserConfigVO,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/user_config/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
