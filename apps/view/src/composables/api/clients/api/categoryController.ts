// @ts-ignore
/* eslint-disable */
import { request } from "~/composables/api/axios";

/** addCategory POST /api/category/add */
export async function addCategoryUsingPost(
  body: API.Category,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/category/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteCategory POST /api/category/delete */
export async function deleteCategoryUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/category/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listCategoryByPage POST /api/category/list/page */
export async function listCategoryByPageUsingPost(
  body: API.CategoryQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageCategory_>("/api/category/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** selectOne GET /api/category/selectOne */
export async function selectOneUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.selectOneUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.Category>("/api/category/selectOne", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateCategory POST /api/category/update */
export async function updateCategoryUsingPost(
  body: API.Category,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/category/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
