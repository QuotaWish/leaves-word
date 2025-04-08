// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** selectOne GET /api/exam_tag/selectOne */
export async function selectOneUsingGet10(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectOneUsingGET10Params,
  options?: { [key: string]: any },
) {
  return request<API.ExamTag>('/api/exam_tag/selectOne', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
