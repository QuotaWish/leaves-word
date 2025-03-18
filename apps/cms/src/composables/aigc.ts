import { COZE_CN_BASE_URL, CozeAPI, RoleType } from '@coze/api'
import axios from 'axios'
export const TOKEN = process.env.COZE_API_TOKEN || 'pat_kwrrFbjXOXPaczP5ZEqtbfKzZEocnBdv0BOB1A7FSFsUSoc5sUO5in31fGa9zMfT'

const axiosInstance = axios.create({
  baseURL: COZE_CN_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`
  }
})

export const cozeClient = new CozeAPI({
  allowPersonalAccessTokenInBrowser: true,
  baseURL: COZE_CN_BASE_URL,
  token: TOKEN,
  axiosInstance
})

/**
 * 创建单词信息补全对话
 * @param word 需要补全的单词
 * @param info 是否基于目前已有的信息做补全
 */
function callWordSupplymentAI(word: string, info: string = '') {
  const content = '当前单词: ' + word + (info?.length ? '\n基于以下信息做补充,请尽可能全面:' + info : '')

  return cozeClient.chat.stream({
    bot_id: '7461618566446923810',
    additional_messages: [
      {
        role: RoleType.User,
        content,
        content_type: 'text'
      }
    ]
  })
}

/**
 * 创建单词信息评分对话
 * @param info 需要补全的信息
 */
function callWordValidateAI(info: string) {
  const content = info

  return cozeClient.chat.stream({
    bot_id: '7464811329795833907',
    additional_messages: [
      {
        role: RoleType.User,
        content,
        content_type: 'text'
      }
    ]
  })
}

export function useLeavesWordAI() {
  return {
    callWordSupplymentAI,
    callWordValidateAI
  }
}