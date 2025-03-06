import { ChatMessageHistory } from '@langchain/community/stores/message/in_memory'
import { Calculator } from '@langchain/community/tools/calculator'
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'

import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableWithMessageHistory } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'

import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents'

import { getLogger } from '~/common/interceptors/logging.interceptor'

import type { IMessageItem } from '../aigc.dto'

import QuotaConfig from '../quota-config'
import { QuotaDateAPI } from '../tools/QuotaCommon'
import { QuotaSearchAPI, QuotaSearchImagesAPI, QuotaSearchVideosAPI } from '../tools/QuotaSearch'

import { $aiProviderManager, CompletionFormat, IProviderMeta, ITransmissionFormat, ITransmissionRole, ITransmissionStatus, ProviderChat, StatusUpdateFormat, ToolFormat } from './BaseProvider'
import { QuotaModel } from './types'

export class LangChainProvider implements IProviderMeta {
  model: QuotaModel
  create(chat_id: string, signal: AbortSignal) {
    return new LangChainChat(chat_id, signal, this)
  }
}

const tools = {
  base: [new Calculator()],
  internet: [new QuotaDateAPI(), new QuotaSearchVideosAPI(), new QuotaSearchImagesAPI(), new QuotaSearchAPI()],
}

// normal
export class LangChainChat extends ProviderChat {
  provider: LangChainProvider

  constructor(chat_id: string, signal: AbortSignal, provider: LangChainProvider) {
    super(chat_id, signal)

    this.provider = provider
  }

  getProviderName(): string {
    return 'QuotaFlow'
  }

  getPromptRate(): number {
    return 1.25
  }

  getCompletionRate(): number {
    return 1.05
  }

  calcPromptPrice(tokens: number): number {
    return (tokens / 1000000) * 5
  }

  calcCompletionPrice(tokens: number): number {
    return (tokens / 1000000) * 15
  }

  async createModel(history: ChatMessageHistory) {
    const toolOption: any = [...tools.base]

    const $options = this.getOptions()

    const chatModel = new ChatOpenAI({
      temperature: $options.temperature || 0.5,
      model: this.provider.model,
      apiKey: 'sk-3EvMFmu1eLE5tWULA7F736D43dA240A29b988c6879Dc6c42',
      maxTokens: $options.maxTokens || 8192,
      configuration: {
        baseURL: 'http://api.quotawish.com:9987/v1',
      },
    })

    const agent = await createOpenAIFunctionsAgent({
      llm: chatModel,
      tools: toolOption,
      prompt: ChatPromptTemplate.fromMessages([new SystemMessage(QuotaConfig.prompt), this.getTemplate(), ['placeholder', '{chat_history}'], ['human', '{input}'], ['placeholder', '{agent_scratchpad}']]),
    })

    const agentExecutor = new AgentExecutor({
      agent,
      tools: toolOption,
    }).withConfig({ runName: 'Agent' })

    const agentWithChatHistory = new RunnableWithMessageHistory({
      runnable: agentExecutor,
      getMessageHistory: () => history,
      inputMessagesKey: 'input',
      historyMessagesKey: 'chat_history',
    })

    return agentWithChatHistory
  }

  async _startCompletion(handler: (format: ITransmissionFormat) => void, onErr: (e: any) => void) {
    const historyMessage = createChatHistory(this.getChatMessages())
    const sessionId = this.getSessionId()
    const model = await this.createModel(historyMessage.history)

    const consoleHandler = {
      handleLLMError(err: any, runId: string, parentRunId: string, tags: string[]) {
        getLogger().warn(`[LangChain] Error tags: ${tags} | ${runId} - ${parentRunId}`)
        onErr(err)
      },
    }

    const lastMessage = historyMessage.message.at(-1)

    const langChainStream = model.streamEvents({
      input: lastMessage.content,
      signal: this.getSignal(),
      stream_options: {
        include_usage: true,
      },
    }, {
      version: 'v2',
      configurable: {
        sessionId,
      },
      callbacks: [
        consoleHandler,
      ],
    })

    for await (const step of langChainStream) {
      const res = JSON.parse(JSON.stringify(step))
      const { event, name } = res

      if (event === 'on_chain_start') {
        if (name === 'Agent') {
          handler(new StatusUpdateFormat(ITransmissionStatus.START, sessionId, ITransmissionRole.ASSISTANT, this.getChatId()))
        }
      }
      else if (
        /* event === 'on_chain_stream'
        || event === 'on_prompt_start'
        || event === 'on_prompt_end'
        || */ event === 'on_chat_model_start'
      ) {
        handler(new StatusUpdateFormat(ITransmissionStatus.PROGRESS, sessionId, ITransmissionRole.ASSISTANT, this.getChatId()))
      }
      else if (event === 'on_tool_start') {
        handler(
          new ToolFormat(ITransmissionStatus.CALLING, name, res.data.input.input, 'START', sessionId, ITransmissionRole.TOOL, this.getChatId()),
        )
      }
      else if (event === 'on_tool_end') {
        handler(
          new ToolFormat(ITransmissionStatus.RESULT, name, res.data.output, 'END', sessionId, ITransmissionRole.TOOL, this.getChatId()),
        )
      }
      else if (event === 'on_chat_model_stream') {
        const obj = res.data

        const text = obj?.chunk?.kwargs
        if (!text?.content)
          continue

        handler(
          new CompletionFormat(name, text.content, sessionId, ITransmissionRole.ASSISTANT, this.getChatId()),
        )
      }
      else if (event === 'on_chain_end') {
        if (name === 'Agent') {
          handler(new StatusUpdateFormat(ITransmissionStatus.END, sessionId, ITransmissionRole.ASSISTANT, this.getChatId()))
        }
      }
    }

    return true
  }
}

function createChatHistory(messages: IMessageItem[]) {
  const chatMessageHistory = new ChatMessageHistory()

  return {
    message: [...messages].map((msg) => {
      const { role, content } = msg

      const textContent = content.filter(item => item.type === 'text').map(item => item.value).join('')

      if (role === 'system') {
        chatMessageHistory.addMessage(new SystemMessage(textContent))
        return new SystemMessage(textContent)
      }
      else if (role === 'assistant') {
        chatMessageHistory.addAIMessage(textContent)
        return new AIMessage(textContent)
      }
      else if (role === 'user') {
        chatMessageHistory.addUserMessage(textContent)
        return new HumanMessage(textContent)
      }

      return null
    }).filter(item => item !== null),
    history: chatMessageHistory,
  }
}

$aiProviderManager.registerProvider('gpt-3.5-turbo', new LangChainProvider())
$aiProviderManager.registerProvider('gpt-4o', new LangChainProvider())
$aiProviderManager.registerProvider('gpt-4o-mini', new LangChainProvider())
