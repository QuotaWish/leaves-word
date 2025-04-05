// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** selectOne GET /api/exam_category_paper/selectOne */
export async function selectOneUsingGet2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectOneUsingGET2Params,
  options?: { [key: string]: any },
) {
  return request<API.ExamCategoryPaper>('/api/exam_category_paper/selectOne', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
