// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** selectOne GET /api/exam_paper_version/selectOne */
export async function selectOneUsingGet8(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectOneUsingGET8Params,
  options?: { [key: string]: any },
) {
  return request<API.ExamPaperVersion>('/api/exam_paper_version/selectOne', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
