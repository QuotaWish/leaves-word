/*
 * Copyright (c) 2024. TalexDreamSoul
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import axios, { AxiosRequestConfig, type AxiosResponse, type CreateAxiosDefaults } from 'axios'
import { ElMessage } from 'element-plus'
import { globalAuthStorage } from '~/modules/auth'
import type { IStandardResponse } from './index.type'

export function genAxios(options: CreateAxiosDefaults) {
  const $http = axios.create(options)

  $http.interceptors.request.use(
    (originConfig) => {
      const reqConfig = { ...originConfig }
      if (!reqConfig.url)
        console.error('Request url must not be null.')

      const method = String(reqConfig?.method).toUpperCase()

      if (method === 'POST') {
        if (!reqConfig.data)
          reqConfig.data = reqConfig.params || {}

        let hasFile = false
        Object.keys(reqConfig.data).forEach((key) => {
          const item = reqConfig.data[key]
          if (typeof item === 'object') {
            if (item instanceof FileList || item instanceof File || item instanceof Blob) {
              hasFile = true
            }
          }
        })

        if (hasFile) {
          const formData = new FormData()
          Object.keys(reqConfig.data).forEach((key) => {
            const item: any = reqConfig.data[key]
            if (item instanceof FileList || item instanceof File || item instanceof Blob) {
              formData.append('file', item as any)
            }
            else {
              formData.append(key, item)
            }
          })
          reqConfig.data = formData
        }
      }

      if (globalAuthStorage.value.isLogin)
        reqConfig.headers.Authorization = `Bearer ${globalAuthStorage.value.token}`

      return reqConfig
    },
    error => Promise.reject(error),
  )

  $http.interceptors.response.use(
    async (res: AxiosResponse) => {
      if (res.data.code === 429)
        return ElMessage.error(res.data.message)

      return res.data
    },
    async (res) => {
      console.error(res)

      if (!res.response || res.code === 'ERR_INTERNET_DISCONNECTED') {
        return ElMessage.error({
          message: '无法连接至远程服务器!',
          grouping: true,
        })
      }

      if (res.code === 'ERR_NETWORK' && (res.message.includes('timeout') || res.message === 'Network Error'))
        return ElMessage.error('请检查您的网络!')

      return res.response.data
    },
  )

  // 导出常用函数
  function request<T>(url: string, options: AxiosRequestConfig<any>) {
    return $http({
      ...options,
      url,
    }) as Promise<T>
  }

  /**
   * @param {string} url
   * @param {object} data
   * @param {object} params
   */
  function post(url: string, data = {}, params = {}) {
    return $http({
      method: 'POST',
      url,
      data,
      params,
    }) as Promise<IStandardResponse>
  }

  function get(url: string, params = {}) {
    return $http({
      method: 'GET',
      url,
      params,
    }) as Promise<IStandardResponse>
  }

  function put(url: string, data = {}, params = {}) {
    return $http({
      method: 'PUT',
      url,
      data,
      params,
    }) as Promise<IStandardResponse>
  }

  function del(url: string, data = {}, params = {}) {
    return $http({
      method: 'DELETE',
      url,
      data,
      params,
    }) as Promise<IStandardResponse>
  }

  function patch(url: string, data = {}, params = {}) {
    return $http({
      method: 'PATCH',
      url,
      data,
      params,
    }) as Promise<IStandardResponse>
  }

  // declare module 'axios' {
  //   export interface AxiosRequestConfig {
  //     hideError?: boolean
  //   }
  // }

  function timeoutLogout() {
    // TODO
    console.log('error')
  }

  return {
    $http,
    post,
    get,
    put,
    del,
    patch,
    request,
    timeoutLogout,
  }
}

export const endHttp = genAxios({
  baseURL: `${ENDS_URL}`,
})

export const request = endHttp.request
