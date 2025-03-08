// @ts-ignore
/* eslint-disable */
import { request } from "~/composables/api/axios";

/** getDictionaryCategoryByDictionaryId GET /api/dictionary_category/relative */
export async function getDictionaryCategoryByDictionaryIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDictionaryCategoryByDictionaryIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListCategory_>(
    "/api/dictionary_category/relative",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** relativeDictionaryCategory POST /api/dictionary_category/relative */
export async function relativeDictionaryCategoryUsingPost(
  body: API.CategoryRelativeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>(
    "/api/dictionary_category/relative",
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
