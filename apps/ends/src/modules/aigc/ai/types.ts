export interface VolcMessage /* extends BaseMessage */ {
  role?: VolcMessageRole
  content: string
}

export type VolcMessageRole = 'system' | 'assistant' | 'user' | 'tool'

export interface ChatCompletionRequest {
  model: string
  messages?: VolcMessage[]
  stream?: boolean
  stream_options?: {
    include_usage: boolean
  }
  max_tokens?: number | null
  stop?: string[]
  frequency_penalty?: number
  temperature?: number | null
  top_p?: number | null
  logprobs?: boolean
  top_logprobs?: number
  logit_bias?: Record<string, number>
  tools?: {
    type: string | 'function'
    function: any
  }[]
  tool_choice?: string
}

export interface ChatVolcParams {

  model: string

  apiUrl?: string

  /** Messages to pass as a prefix to the prompt */
  messages?: VolcMessage[]

  /**
   * API key to use when making requests. Defaults to the value of
   * `VOLC_API_KEY` environment variable.
   */
  apiKey?: string

  /**
   * Amount of randomness injected into the response. Ranges
   * from 0 to 1 (0 is not included). Use temp closer to 0 for analytical /
   * multiple choice, and temp closer to 1 for creative and generative tasks.
   * Defaults to 0, recommended 0.3
   */
  temperature?: number

  /**
   * Total probability mass of tokens to consider at each step. Range
   * from 0 to 1. Defaults to 1
   */
  topP?: number

  /**
   * Different models have different maximum values. Defaults to 1024
   */
  maxTokens?: number

  stop?: string[]

  /**
   * Frequency penalty, a number between -2.0 and 2.0. Positive values
   * penalize the newly generated words based on their existing frequency in the
   * text, making the model less likely to repeat the same words verbatim.
   * The default value is 0
   */
  frequencyPenalty?: number
}

export enum QuotaModel {
  QUOTA_THIS_TITLE = 'this-title',

  // 普通版本，纯问答（类豆包，普通联网）
  QUOTA_THIS_NORMAL = 'this-normal',

  // 普通版本+，联网+工具能力（类GPT，高级联网+工具）
  // QUOTA_THIS_NORMAL_PLUS = 'this-normal-plus',

  // 中级模型，中级会员可用 （上下文更强，普通联网）
  QUOTA_THIS_NORMAL_TURBO = 'this-normal-turbo',

  // 中级模型，中级会员可用 （上下文更强，类GPT，高级联网+工具）
  // QUOTA_THIS_NORMAL_TURBO_PLUS = 'this-normal-turbo-plus',

  // 高级模型，高级会员可用 （全功能，上下文更强，类GPT，高级联网+工具）
  QUOTA_THIS_NORMAL_ULTRA = 'this-normal-ultra',

  // 极速模型，高级会员可用 （全功能，上下文更强，类GPT，高级联网+工具）
  // QUOTA_THIS_NORMAL_ULTRA_PLUS = 'this-normal-ultra-plus',
}

type SUPPORTED_MODELS = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-3.5-turbo' | 'volc-doubao-pro-256k'

export type LLMModel = QuotaModel | SUPPORTED_MODELS
