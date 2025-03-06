// @ts-ignore
/* eslint-disable */
import { request } from "~/composables/api/axios";

/** addMediaCreator POST /api/media_creator/add */
export async function addMediaCreatorUsingPost(
  body: API.MediaCreatorAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.SseEmitter>("/api/media_creator/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteMediaCreator POST /api/media_creator/delete */
export async function deleteMediaCreatorUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/media_creator/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getMediaCreatorVOById GET /api/media_creator/get/vo */
export async function getMediaCreatorVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMediaCreatorVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseMediaCreatorVO_>("/api/media_creator/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listMediaCreatorByPage POST /api/media_creator/list/page */
export async function listMediaCreatorByPageUsingPost(
  body: API.MediaCreatorQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMediaCreator_>(
    "/api/media_creator/list/page",
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

/** listMediaCreatorVOByPage POST /api/media_creator/list/page/vo */
export async function listMediaCreatorVoByPageUsingPost(
  body: API.MediaCreatorQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMediaCreatorVO_>(
    "/api/media_creator/list/page/vo",
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

/** listMyMediaCreatorVOByPage POST /api/media_creator/my/list/page/vo */
export async function listMyMediaCreatorVoByPageUsingPost(
  body: API.MediaCreatorQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageMediaCreatorVO_>(
    "/api/media_creator/my/list/page/vo",
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
