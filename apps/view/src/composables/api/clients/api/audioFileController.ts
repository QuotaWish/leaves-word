// @ts-ignore
/* eslint-disable */
import { request } from "~/composables/api/axios";

/** addAudioFile POST /api/audio_file/add */
export async function addAudioFileUsingPost(
  body: API.AudioFileAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>("/api/audio_file/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteAudioFile POST /api/audio_file/delete */
export async function deleteAudioFileUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/audio_file/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** getAudioFileVOById GET /api/audio_file/get/vo */
export async function getAudioFileVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAudioFileVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseAudioFileVO_>("/api/audio_file/get/vo", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listAudioFileByPage POST /api/audio_file/list/page */
export async function listAudioFileByPageUsingPost(
  body: API.AudioFileQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageAudioFile_>("/api/audio_file/list/page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** listAudioFileVOByPage POST /api/audio_file/list/page/vo */
export async function listAudioFileVoByPageUsingPost(
  body: API.AudioFileQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageAudioFileVO_>(
    "/api/audio_file/list/page/vo",
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

/** searchAudioFile POST /api/audio_file/search */
export async function searchAudioFileUsingPost(
  body: API.AudioFileQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageAudioFileVO_>("/api/audio_file/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** synthesize POST /api/audio_file/synthesize */
export async function synthesizeUsingPost(
  body: API.AudioFileSynthesizeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/audio_file/synthesize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** uploadAudioFile POST /api/audio_file/upload */
export async function uploadAudioFileUsingPost(
  body: API.AudioFileQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>("/api/audio_file/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
