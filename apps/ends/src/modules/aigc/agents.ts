// import { ChatMessageHistory } from '@langchain/community/stores/message/in_memory'
// import { Calculator } from '@langchain/community/tools/calculator'
// import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'
// import { ChatPromptTemplate } from '@langchain/core/prompts'
// import { RunnableWithMessageHistory } from '@langchain/core/runnables'
// import { ChatOpenAI } from '@langchain/openai'
// import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents'

// import { ChatCompletionDto } from './aigc.dto'
// import { QuotaModel } from './quota/types'
// import quotaConfig from './quota-config'
// import { QuotaDateAPI } from './tools/QuotaCommon'
// import { QuotaSearchAPI, QuotaSearchImagesAPI, QuotaSearchVideosAPI } from './tools/QuotaSearch'

// // /* new SerpAPI(), new TavilySearchResults({}) ,*/
// const tools = {
//   base: [new Calculator()],
//   internet: [new QuotaDateAPI(), new QuotaSearchVideosAPI(), new QuotaSearchImagesAPI(), new QuotaSearchAPI()],
// }

// export class ModelAgent {
//   mapModel(model: string) {
//     if (!model)
//       return 'gpt-4o-mini'

//     if (model === QuotaModel.QUOTA_THIS_NORMAL)
//       return 'bot-7400874215610236963'
//       // return 'bot-20240804202339-7hztb'

//     if (model === QuotaModel.QUOTA_THIS_NORMAL_TURBO)
//       return 'gpt-4o-mini'

//     if (model === QuotaModel.QUOTA_THIS_NORMAL_ULTRA)
//       return 'gpt-4o'

//     throw new Error(`Model ${model} not found`)
//   }

//   createModel(options: ChatCompletionDto) {
//     const model = this.mapModel(options.model)

//     // if (model === 'volc') {
//     //   return new ChatOpenAI({
//     //     temperature: options.temperature,
//     //     model: 'bot-20240804202339-7hztb',
//     //     apiKey: '27217108-708c-44f5-b3f3-befd9bda6e79',
//     //     ...(options.generateTitle ? { max_tokens: 5 } : {}),
//     //     configuration: {
//     //       // baseURL: 'https://oneapi.gptnb.me/v1',
//     //       baseURL: 'https://ark.cn-beijing.volces.com/api/v3/bots',
//     //     },
//     //   })
//     // }

//     return new ChatOpenAI({
//       temperature: options.temperature,
//       model,
//       // apiKey: 'sk-fgdKs2AjwhZ4Y9ow13C72f231f1b4f89A8A5Dc5dFaB582E4',
//       // apiKey: 'sk-YYlCexOqz05qjt5B689aE89184Cc4755B8Cf9dF892D1C54b',
//       apiKey: 'sk-3EvMFmu1eLE5tWULA7F736D43dA240A29b988c6879Dc6c42',
//       // apiKey: 'sk-o4di0dWBDOgjf5f259C2B025A30144EaB72c80858993A62c',
//       ...(options.generateTitle ? { maxTokens: 5 } : {}),
//       // maxTokens: options.generateTitle ? 8 : undefined,
//       configuration: {
//         // baseURL: 'https://oneapi.gptnb.me/v1',
//         // baseURL: 'https://www.gptapi.us/v1',
//         baseURL: 'http://api.quotawish.com:9987/v1',
//       },
//     })
//   }

//   getTemplate(options: ChatCompletionDto) {
//     if (options.generateTitle) {
//       console.log(`[Completion] Using title prompt`)
//       return new SystemMessage(quotaConfig.title)
//     }
//     else if (options.generateSummary !== undefined && options.generateSummary !== 0) {
//       console.log(`[Completion] Here: ${options.generateSummary}`)
//       return options.generateSummary === 1 ? new SystemMessage(quotaConfig.promptPolish) : new SystemMessage(quotaConfig.promptTranslation)
//     }

//     if (options._template && options.templateId !== undefined && options.templateId !== -1) {
//       return new SystemMessage(`${quotaConfig.prompt}\n\n${options._template.content}`)
//     }

//     return new SystemMessage(quotaConfig.prompt)
//   }

//   async generate(options: ChatCompletionDto) {
//     const toolOption: any = [...tools.base, ...(options.tools ? tools.internet : [])]

//     const chatModel = this.createModel(options)

//     const agent = await createOpenAIFunctionsAgent({
//       llm: chatModel,
//       tools: toolOption,
//       prompt: ChatPromptTemplate.fromMessages([this.getTemplate(options), ['placeholder', '{chat_history}'], ['human', '{input}'], ['placeholder', '{agent_scratchpad}']]),
//     })

//     const agentExecutor = new AgentExecutor({
//       agent,
//       tools: toolOption,
//     }).withConfig({ runName: 'Agent' })

//     return agentExecutor
//   }

//   async withHistory(messages: any[], options: ChatCompletionDto) {
//     const chatMessageHistory = new ChatMessageHistory()

//     // chatMessageHistory.addMessage(new SystemMessage(options?.generateTitle ? quotaConfig.title : quotaConfig.prompt))

//     const chat_history: any = [...messages].map((msg) => {
//       const { role, content } = msg
//       if (!content)
//         return null

//       if (role === 'system') {
//         chatMessageHistory.addMessage(new SystemMessage(content))
//         return new SystemMessage(content)
//       }
//       else if (role === 'assistant') {
//         chatMessageHistory.addAIMessage(content)
//         return new AIMessage(content)
//       }
//       else if (role === 'user') {
//         chatMessageHistory.addUserMessage(content)
//         return new HumanMessage(content)
//       }

//       return null
//     }).filter(item => item !== null)

//     const agent = await this.generate(options)

//     const agentWithChatHistory = new RunnableWithMessageHistory({
//       runnable: agent,
//       getMessageHistory: () => chatMessageHistory,
//       inputMessagesKey: 'input',
//       historyMessagesKey: 'chat_history',
//     })

//     return {
//       agent: agentWithChatHistory,
//       chat_history,
//     }
//   }
// }

// export const modelAgent = new ModelAgent()
