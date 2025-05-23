// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** selectOne GET /api/exam_question/selectOne */
export async function selectOneUsingGet9(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectOneUsingGET9Params,
  options?: { [key: string]: any },
) {
  return request<API.ExamQuestion>('/api/exam_question/selectOne', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
