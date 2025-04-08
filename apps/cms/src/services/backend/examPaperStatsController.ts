// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** selectOne GET /api/exam_paper_stats/selectOne */
export async function selectOneUsingGet6(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectOneUsingGET6Params,
  options?: { [key: string]: any },
) {
  return request<API.ExamPaperStats>('/api/exam_paper_stats/selectOne', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
