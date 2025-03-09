import type { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager'
import type {
  BaseFunctionCallOptions,
  BaseLanguageModelInput,
  FunctionDefinition,
  ToolDefinition,
} from '@langchain/core/language_models/base'
import {
  BaseChatModel,
  type BaseChatModelParams,
} from '@langchain/core/language_models/chat_models'

import {
  AIMessage,
  AIMessageChunk,
  type BaseMessage,
  ChatMessage,
  HumanMessage,
  OpenAIToolCall,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages'
import type { ChatResult } from '@langchain/core/outputs'
import {
  Runnable,
} from '@langchain/core/runnables'
import type { StructuredToolInterface } from '@langchain/core/tools'
import { getEnvironmentVariable } from '@langchain/core/utils/env'
import { convertToOpenAITool } from '@langchain/core/utils/function_calling'
import type { OpenAICallOptions } from '@langchain/openai'
import type { MessageEvent } from '@nestjs/common'

import { getLogger } from '~/common/interceptors/logging.interceptor'

export type VolcMessageRole = 'system' | 'assistant' | 'user' | 'tool'

interface VolcMessage /* extends BaseMessage */ {
  role?: VolcMessageRole
  content: string
}

interface VolcNormalMessage extends VolcMessage {
  content: string
}

interface MessageToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

interface VolcToolMessage extends VolcMessage {
  tool_calls: MessageToolCall[]
  tool_call_id: string
}

type ModelName = (string & NonNullable<unknown>)

interface ChatMetaData extends Record<string, unknown> {
  user_info?: string
  emit_intention_signal_extra?: 'true' | 'false'
}

interface ChatCompletionRequest {
  model: ModelName
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
    function: FunctionDefinition
  }[]
  functions?: {
    type: string | 'function'
    function: FunctionDefinition
  }[]
  tool_choice?: string
  metadata?: Partial<ChatMetaData>
}

interface BaseResponse {
  code?: string
  message?: string
}

interface ChoiceMessage {
  role: string
  content: string
  tool_calls?: OpenAIToolCall[]/* {
    function: {
      arguments: string
      name: string
    }
    id: string
    index: number
    type: string | 'function'
  }[] */
}

interface ResponseChoice {
  index: number
  finish_reason: 'stop' | 'length' | 'null' | 'tool_calls' | null
  delta: ChoiceMessage
  message: ChoiceMessage
}

/**
 * Interface representing a response from a chat completion.
 */
interface ChatCompletionResponse extends BaseResponse {
  choices?: ResponseChoice[]
  created?: number
  id?: string
  model?: string
  request_id?: string
  usage?: {
    completion_tokens: number
    prompt_tokens: number
    total_tokens: number
  }
  output?: {
    text: string
    finish_reason: 'stop' | 'length' | 'null' | 'tool_calls' | null
  }
}

export interface ChatVolcParams {

  model: ModelName

  apiUrl?: string

  /** Whether to stream the results or not. Defaults to false. */
  streaming?: boolean

  stream_options?: {
    include_usage: boolean
  }

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

  metadata?: ChatCompletionRequest['metadata']
}

export interface ChatOpenAICallOptions
  extends OpenAICallOptions,
  BaseFunctionCallOptions {
  tools?: StructuredToolInterface[]
  // tool_choice?: OpenAIClient.ChatCompletionToolChoiceOption
  promptIndex?: number
  response_format?: { type: 'json_object' }
  seed?: number
  /**
   * Additional options to pass to streamed completions.
   * If provided takes precedence over "streamUsage" set at initialization time.
   */
  stream_options?: {
    /**
     * Whether or not to include token usage in the stream.
     * If set to `true`, this will include an additional
     * chunk at the end of the stream with the token usage.
     */
    include_usage: boolean
  }
  /**
   * Whether or not to restrict the ability to
   * call multiple tools in one response.
   */
  parallel_tool_calls?: boolean
}

// function convertToMessage(message: BaseMessage) {
//   const role = delta.role ?? defaultRole
//   const content = delta.content ?? ''
//   let additional_kwargs
//   if (delta.function_call) {
//     additional_kwargs = {
//       function_call: delta.function_call,
//     }
//   }
//   else if (delta.tool_calls) {
//     additional_kwargs = {
//       tool_calls: delta.tool_calls,
//     }
//   }
//   else {
//     additional_kwargs = {}
//   }
//   if (role === 'user') {
//     return new HumanMessageChunk({ content })
//   }
//   else if (role === 'assistant') {
//     const toolCallChunks = []
//     if (Array.isArray(delta.tool_calls)) {
//       for (const rawToolCall of delta.tool_calls) {
//         toolCallChunks.push({
//           name: rawToolCall.function?.name,
//           args: rawToolCall.function?.arguments,
//           id: rawToolCall.id,
//           index: rawToolCall.index,
//         })
//       }
//     }
//     return new AIMessageChunk({
//       content,
//       tool_call_chunks: toolCallChunks,
//       additional_kwargs,
//       id: messageId,
//     })
//   }
//   else if (role === 'system') {
//     return new SystemMessageChunk({ content })
//   }
//   else if (role === 'function') {
//     return new FunctionMessageChunk({
//       content,
//       additional_kwargs,
//       name: delta.name,
//     })
//   }
//   else if (role === 'tool') {
//     return new ToolMessageChunk({
//       content,
//       additional_kwargs,
//       tool_call_id: delta.tool_call_id,
//     })
//   }
//   else {
//     return new ChatMessageChunk({ content, role })
//   }
// }

function getMessageRole(message: BaseMessage): VolcMessageRole {
  const type = message._getType()
  switch (type) {
    case 'ai':
      return 'assistant'
    case 'human':
      return 'user'
    case 'system':
      return 'system'
    case 'function':
    case 'tool':
      return 'tool'
    default:
      throw new Error(`Unknown message type: ${type}`)
  }
}

function convertToMessage(message: BaseMessage/* , meta?: { name: any, additional_kwargs: any, tool_call_id: string } */): BaseMessage {
  const type = message._getType()
  switch (type) {
    case 'ai':
      return new AIMessage({ ...message })
    case 'human':
      return new HumanMessage({ ...message })
    case 'system':
      return new SystemMessage({ ...message })
    // case 'function':
    //   return new FunctionMessage({ ...message, ...meta })
    case 'generic': {
      if (!ChatMessage.isInstance(message)) {
        throw new Error('Invalid generic chat message')
      }
      if (['system', 'assistant', 'user'].includes(message.role)) {
        return message
      }
      throw new Error(`Unknown message type: ${type}`)
    }
    default:
      throw new Error(`Unknown message type: ${type}`)
  }
}

export class ChatVolc<
  CallOptions extends ChatOpenAICallOptions = ChatOpenAICallOptions,
> extends BaseChatModel<CallOptions, AIMessageChunk> implements ChatVolcParams {
  static lc_name() {
    return 'ChatVolc'
  }

  get callKeys() {
    return ['stop', 'signal', 'length', 'content_filter', 'tool_call']
  }

  get lc_secrets() {
    return {
      apiKey: 'VOLC_API_KEY',
    }
  }

  get lc_aliases() {
    return undefined
  }

  apiKey?: string

  streaming: boolean

  stream_options?: {
    include_usage: boolean
  }

  messages?: VolcMessage[]

  model: ChatCompletionRequest['model']

  apiUrl: string

  maxTokens?: number | undefined

  temperature?: number | undefined

  topP?: number | undefined

  stop?: string[]

  frequencyPenalty?: number

  declare metadata: ChatMetaData

  constructor(fields: Partial<ChatVolcParams> & BaseChatModelParams = {}) {
    super(fields)

    this.apiKey = fields?.apiKey ?? getEnvironmentVariable('VOLC_API_KEY')

    if (!this.apiKey) {
      throw new Error('Volc API key not found')
    }

    this.apiUrl = fields.apiUrl ?? `https://ark.cn-beijing.volces.com/v1/chat/completions`
    this.streaming = fields.streaming ?? false
    this.stream_options = fields.stream_options
    if (this.streaming && !this.stream_options) {
      throw new Error('Volc streaming requires stream_options when stream is open.')
    }

    this.messages = fields.messages ?? []
    this.temperature = fields.temperature ?? 0
    this.topP = fields.topP ?? 1
    this.stop = fields.stop
    this.maxTokens = fields.maxTokens

    this.model = fields?.model
    if (!this.model) {
      throw new Error('Volc model not found')
    }

    this.frequencyPenalty = fields.frequencyPenalty ?? 0
    this.metadata = fields.metadata
  }

  override bindTools(
    tools: (
      | Record<string, unknown>
      | StructuredToolInterface
      | ToolDefinition
    )[],
    kwargs?: Partial<CallOptions>,
  ): Runnable<BaseLanguageModelInput, AIMessageChunk, CallOptions> {
    return this.bind({
      tools: tools.map(convertToOpenAITool),
      ...kwargs,
    } as Partial<CallOptions>)
  }

  /**
   * Get the parameters used to invoke the model
   */
  // invocationParams(): Omit<ChatCompletionRequest, 'messages'> {
  //   return {
  //     model: this.model,
  //     stream: this.streaming,
  //     temperature: this.temperature,
  //     top_p: this.topP,
  //     max_tokens: this.maxTokens,
  //     stop: this.stop,
  //     metadata: this.metadata,
  //     frequency_penalty: this.frequencyPenalty,
  //   }
  // }

  invocationParams(options?: this['ParsedCallOptions']): Omit<ChatCompletionRequest, 'messages'> {
    function isStructuredToolArray(
      tools?: unknown[],
    ): tools is StructuredToolInterface[] {
      return (
        tools !== undefined
        && tools.every(tool =>
          Array.isArray((tool as StructuredToolInterface).lc_namespace),
        )
      )
    }

    const params: Omit<
      ChatCompletionRequest,
      'messages'
    > = {
      model: this.model,
      temperature: this.temperature,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
      max_tokens: this.maxTokens === -1 ? undefined : this.maxTokens,
      // logprobs: this.logprobs,
      // top_logprobs: this.topLogprobs,
      // logit_bias: this.logitBias,
      stop: this.stop,
      stream: this.streaming,
      // functions: options?.functions,
      // function_call: options?.function_call,
      tools: options.functions.map(func => ({
        type: 'function',
        function: func,
      })) as any,
      // functions: options.functions.map(func => ({
      //   type: 'function',
      //   function: func,
      // })) as any,
      /* isStructuredToolArray(options?.tools)
        ? options?.tools.map(convertToOpenAITool)
        : options?.tools */// ,
      // tool_choice: 'auto',
      // response_format: options?.response_format,
      // seed: options?.seed,
      // ...streamOptionsConfig,
      // parallel_tool_calls: options?.parallel_tool_calls,
      metadata: this.metadata,
    }
    return params
  }

  /**
   * Get the identifying parameters for the model
   */
  identifyingParams(): Omit<ChatCompletionRequest, 'messages'> {
    return this.invocationParams()
  }

  /** @ignore */
  async _generate(
    messages: BaseMessage[],
    options?: this['ParsedCallOptions'],
    runManager?: CallbackManagerForLLMRun,
  ): Promise<ChatResult> {
    const parameters = this.invocationParams(options)

    const messagesMapped: VolcMessage[] = messages.map((message) => {
      return {
        role: getMessageRole(message),
        content: message.content as string,
      }
    })

    console.log('parameters', parameters)

    let chunk
    const addonData: Record<string, any> = {}

    const data = parameters.stream
      ? await new Promise<ChatCompletionResponse>((resolve, reject) => {
        let response: ChatCompletionResponse
        let rejected = false
        let resolved = false

        this.completionWithRetry(
          {
            ...parameters,
            messages: messagesMapped,
          },
          true,
          options?.signal,
          (event) => {
            const data: ChatCompletionResponse = JSON.parse(event.data as string)
            if (data?.code) {
              if (rejected) {
                return
              }
              rejected = true
              reject(new Error(data?.message))
              return
            }

            const { delta, finish_reason } = data.choices[0]

            const text = delta.content

            if (!response) {
              response = {
                ...data,
                output: { text, finish_reason },
              }
            }
            else {
              response.output.text += text
              response.output.finish_reason = finish_reason
              response.usage = data.usage
            }

            if (finish_reason === 'tool_calls') {
              const toolCallChunks = []
              if (Array.isArray(delta.tool_calls)) {
                for (const rawToolCall of delta.tool_calls) {
                  toolCallChunks.push({
                    name: rawToolCall.function?.name,
                    args: rawToolCall.function?.arguments,
                    id: rawToolCall.id,
                    index: rawToolCall.index,
                  })
                }
              }

              const toolMessageChunk = new ToolMessage({
                content: response.output.text,
                additional_kwargs: { tool_calls: delta.tool_calls },
                tool_call_id: delta.tool_calls[0].id,
                id: data.id,
              })

              addonData.messages = {
                tool_calls: delta.tool_calls,
              }
              addonData.finish_reason = finish_reason

              chunk = toolMessageChunk

              Object.assign(response, chunk)

              runManager.handleLLMNewToken(text, {
                prompt: 0,
                completion: 0,
              }, undefined, undefined, undefined, {
                chunk,
              })

              console.log('tool call', { ...response, ...toolMessageChunk }, toolMessageChunk)
            }
            else {
              void runManager?.handleLLMNewToken(text ?? '')
            }

            if (finish_reason && finish_reason !== 'null') {
              if (resolved || rejected)
                return
              resolved = true
              resolve(response)
            }
          },
        ).catch((error) => {
          if (!rejected) {
            rejected = true
            reject(error)
          }
        })
      })
      : await this.completionWithRetry(
        {
          ...parameters,
          messages: messagesMapped,
        },
        false,
        options?.signal,
      ).then<ChatCompletionResponse>((data: ChatCompletionResponse) => {
        if (data?.code) {
          throw new Error(data?.message)
        }
        const { finish_reason, message } = data.choices[0]
        const text = message.content
        return {
          ...data,
          output: { text, finish_reason },
        }
      })

    const {
      prompt_tokens = 0,
      completion_tokens = 0,
      total_tokens = 0,
    } = data.usage ?? {}

    console.log('a', chunk)
    const { text } = data.output

    return {
      generations: [
        {
          text,
          message: chunk ?? new AIMessage(text),
          generationInfo: {
            ...(addonData ?? {}),
            ...(addonData?.messages ?? {}),
          },
        },
      ],
      llmOutput: {
        tokenUsage: {
          promptTokens: prompt_tokens,
          completionTokens: completion_tokens,
          totalTokens: total_tokens,
        },
      },
    }
  }

  /** @ignore */
  async completionWithRetry(
    request: ChatCompletionRequest,
    stream: boolean,
    signal?: AbortSignal,
    onmessage?: (event: MessageEvent) => void,
  ) {
    console.debug('request', request, JSON.stringify(request))
    getLogger().debug('request', request, JSON.stringify(request))

    const makeCompletionRequest = async () => {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          ...(stream ? { Accept: 'text/event-stream' } : {}),
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal,
      })

      if (!stream) {
        return response.json()
      }

      if (response.body) {
        // response will not be a stream if an error occurred
        if (
          !response.headers.get('content-type')?.startsWith('text/event-stream')
        ) {
          console.log('text', await response.text())
          onmessage?.({
            data: await response.text(),
          })
          return
        }
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let data = ''
        let continueReading = true
        while (continueReading) {
          const { done, value } = await reader.read()
          if (done) {
            continueReading = false
            break
          }
          data += decoder.decode(value)
          let continueProcessing = true
          while (continueProcessing) {
            const newlineIndex = data.indexOf('\n')
            if (newlineIndex === -1) {
              continueProcessing = false
              break
            }
            const line = data.slice(0, newlineIndex)
            data = data.slice(newlineIndex + 1)
            if (line.startsWith('data:')) {
              const value = line.slice('data:'.length).trim()
              // getLogger().debug('single line', line)

              if (value === '[DONE]') {
                continueReading = false
                break
              }
              onmessage?.({ data: value })
            }
          }
        }
      }
    }

    return this.caller.call(makeCompletionRequest)
  }

  _llmType(): string {
    return 'volc'
  }

  /** @ignore */
  _combineLLMOutput() {
    return []
  }
}
