// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** selectOne GET /api/exam_operation_log/selectOne */
export async function selectOneUsingGet3(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectOneUsingGET3Params,
  options?: { [key: string]: any },
) {
  return request<API.ExamOperationLog>('/api/exam_operation_log/selectOne', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
