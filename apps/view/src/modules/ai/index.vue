<script setup lang="ts">
import type { BubbleListItemProps } from "vue-element-plus-x/types/BubbleList";
import type {
  ChatMessage,
  CreateChatRequest,
} from "~/composables/api/clients/globals";
import { onMounted, ref } from "vue";
import { BubbleList, Sender, useSend, XRequest } from "vue-element-plus-x";
import Apis from "~/composables/api/clients";
import { globalAuthStorage } from "../auth";

type Message = BubbleListItemProps & {
  id: string;
  role: "user" | "ai";
  content: string;
};

// 定义状态
const messages = ref<Message[]>([]);
const inputMessage = ref("");
const senderRef = ref();

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 添加消息到对话列表
function addMessage(
  role: "user" | "ai",
  content: string,
  isTyping = false,
): void {
  const placement = role === "user" ? "end" : "start";
  const variant = role === "user" ? "outlined" : "filled";
  const avatar =
    role === "user"
      ? "https://avatars.githubusercontent.com/u/76239030?v=4"
      : "https://files.catbox.moe/ssn1rx.png";

  messages.value.push({
    id: generateId(),
    role,
    placement,
    content,
    loading: false,
    shape: "corner",
    variant,
    isMarkdown: role === "ai",
    typing: isTyping && role === "ai",
    isFog: role === "ai",
    avatar,
    avatarSize: "40px",
    avatarGap: "12px",
  });
}

// 提前声明 finish 函数
let finish = () => {};

// 创建 XRequest 实例处理流式响应
const xRequest = new XRequest({
  type: "fetch", // 使用 fetch 类型请求
  transformer: (data: string) => {
    try {
      // 处理 [DONE] 标记
      if (data === "[DONE]") {
        return;
      }

      // 检查是否是多行数据
      if (data.includes("\n")) {
        // 将数据按行分割，处理每一行
        const lines = data.split("\n").filter((line) => line.trim());
        let result = "";

        for (const line of lines) {
          // 检查这一行是否是SSE格式数据（以data:开头）
          if (line.startsWith("data:")) {
            // 提取JSON部分（去掉'data:'前缀）
            const jsonStr = line.substring(5).trim();
            if (!jsonStr || jsonStr === "[DONE]") {
              continue;
            }

            console.log("收到多行SSE数据中的一行:", jsonStr);

            try {
              const parsedData = JSON.parse(jsonStr);

              // 处理完成或done事件
              if (
                parsedData.done === true ||
                parsedData.event === "conversation.message.completed" ||
                parsedData.event === "conversation.chat.completed" ||
                parsedData.event === "done"
              ) {
                continue;
              }

              // 提取消息内容
              if (
                parsedData.event === "conversation.message.delta" &&
                parsedData.message &&
                parsedData.message.content
              ) {
                result += parsedData.message.content;
              }
            } catch (e) {
              console.error("解析多行SSE数据中的一行出错:", e);
            }
          }
        }

        return result || "";
      }

      // 处理单行SSE格式数据
      if (data.startsWith("data:")) {
        // 提取 JSON 部分（去掉 'data:' 前缀）
        const jsonStr = data.substring(5).trim();
        // 如果是空行或者 [DONE]，返回
        if (!jsonStr || jsonStr === "[DONE]") {
          return;
        }

        console.log("收到 SSE 数据:", jsonStr);

        const parsedData = JSON.parse(jsonStr);

        // 处理完成事件
        if (
          parsedData.done === true ||
          parsedData.event === "conversation.message.completed" ||
          parsedData.event === "conversation.chat.completed" ||
          parsedData.event === "done"
        ) {
          return;
        }

        // 提取消息内容
        if (
          parsedData.event === "conversation.message.delta" &&
          parsedData.message &&
          parsedData.message.content
        ) {
          return parsedData.message.content;
        }

        return "";
      }

      // 尝试旧格式解析
      const parsedData = JSON.parse(data);
      if (parsedData.choices?.[0]?.delta?.content) {
        return parsedData.choices[0].delta.content;
      }

      return "";
    } catch (e) {
      console.error("解析流数据出错:", e);
      return "";
    }
  },
  onMessage: (content) => {
    if (content) {
      // 更新最后一条消息的内容
      if (messages.value.length > 0) {
        const lastMessage = messages.value[messages.value.length - 1];
        lastMessage.content = (lastMessage.content || "") + content;
      }
    }
  },
  onError: (e: unknown) => {
    console.error("请求错误:", e);
    if (messages.value.length > 0) {
      messages.value[messages.value.length - 1].content =
        "抱歉，发生了错误，请稍后再试。";
    }
  },
  onFinish: () => {
    // 结束 loading 状态
    finish();
  },
  onAbort: () => {
    console.warn("请求被中断");
    if (messages.value.length > 0) {
      messages.value[messages.value.length - 1].content += "\n[请求已中断]";
    }
  },
});

// 使用 Element-Plus-X 的 useSend 处理流式响应
async function sendMessageToServer(content: string): Promise<void> {
  try {
    // 构建请求参数
    const additionalMessages: ChatMessage[] = [
      {
        role: "User",
        content,
        content_type: "text",
      },
    ];

    const requestData: CreateChatRequest = {
      botId: "7448405006673412115",
      additionalMessages,
    };

    const token = globalAuthStorage.value.token;
    if (!token) {
      return;
    }

    // 创建请求方法
    const method = Apis.cozeController.createChatUsingPOST({
      data: requestData,
    });

    console.warn("请求方法:", method);

    // 添加AI消息(先添加空消息，然后逐步更新)
    addMessage("ai", "", true);

    const headers: any = {
      "Content-Type": "application/json",
    };

    headers[`${token.tokenName}`] = `${token.tokenValue}`;

    // 发送请求 - 使用从 method 获取的 URL 路径
    xRequest.send(
      `${method.baseURL}${method.url}?userId=${globalAuthStorage.value.user.id!}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(requestData),
      },
    );

    return Promise.resolve();
  } catch (error) {
    console.error("发送消息到服务器失败:", error);

    // 更新最后一条消息为错误信息
    if (messages.value.length > 0) {
      messages.value[messages.value.length - 1].content =
        "抱歉，发生了错误，请稍后再试。";
    }

    return Promise.resolve();
  }
}

// 使用 useSend 控制前端加载状态
const {
  send: startChat,
  abort: abortChat,
  loading: chatLoading,
  finish: finishChat,
} = useSend({
  sendHandler: (value: string) => sendMessageToServer(value),
  abortHandler: () => xRequest.abort(),
});

// 将 finishChat 赋值给外部声明的 finish 函数
finish = finishChat;

// 发送用户消息
async function handleSubmit(value: string): Promise<void> {
  if (!value.trim() || chatLoading.value) {
    return;
  }

  // 添加用户消息
  addMessage("user", value);

  // 开始聊天（通过 useSend 的 send 方法控制 loading 状态）
  startChat(value);
}

// 取消发送
function handleCancel(): void {
  abortChat();
}

// 组件挂载时添加欢迎消息
onMounted(() => {
  addMessage("ai", "千叶单词为您服务。", true);
});
</script>

<template>
  <div class="ai-chat-container">
    <div class="chat-messages">
      <BubbleList :list="messages" max-height="100%" :show-back-button="true" />
    </div>

    <div class="chat-input">
      <Sender
        ref="senderRef"
        v-model="inputMessage"
        :loading="chatLoading"
        placeholder="请输入您的问题..."
        clearable
        :autosize="{ minRows: 1, maxRows: 3 }"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<style scoped>
.ai-chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.chat-messages {
  width: 100%;
  height: calc(100% - 120px);
  padding: 16px;
  overflow-y: auto;
  background-image: linear-gradient(
    to bottom,
    rgba(240, 244, 248, 0.8),
    rgba(255, 255, 255, 0.8)
  );
}

.chat-input {
  padding: 1rem 1.5rem;
  width: 100%;
  background-color: #ffffff;
  border-top: 1px solid #e4e7ed;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
