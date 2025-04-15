<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineOptions({
  name: 'WordTestPage',
  meta: {
    transition: 'nav',
  },
})

interface Question {
  id: number
  word: string
  options: string[]
  correctAnswer: string
}

const currentQuestion = ref<Question | null>(null)
const questions = ref<Question[]>([])
const currentIndex = ref(0)
const score = ref(0)
const showResult = ref(false)
const selectedAnswer = ref('')
const isAnswered = ref(false)

// 词书选择
const selectedBook = ref('四级过关秘籍')

// AI助手相关状态
const userQuestion = ref('')
const aiMessage = ref('你好！我是你的AI学习助手。我可以帮你分析学习情况，提供个性化建议。')

// 与AI助手交互
const askAI = () => {
  if (!userQuestion.value) return

  // 模拟AI回复，实际应用中应调用后端API
  const responses = [
    '根据你的答题表现，建议你多关注词义辨析，提高准确率。',
    `当前得分率${Math.round((score.value / questions.value.length) * 100)}%，继续保持学习热情！`,
    '建议你在答题时多思考单词的具体应用场景，加深理解。',
    '如果遇到不确定的选项，建议你通过词根词缀分析来辅助判断。',
    '适当的复习间隔能帮助你更好地记忆单词，建议制定合理的复习计划。'
  ]

  aiMessage.value = responses[Math.floor(Math.random() * responses.length)]
  userQuestion.value = ''
}

// 模拟题目数据，实际应该从API获取
const mockQuestions: Question[] = [
  {
    id: 1,
    word: 'apple',
    options: ['苹果', '香蕉', '橙子', '梨'],
    correctAnswer: '苹果'
  },
  {
    id: 2,
    word: 'book',
    options: ['书本', '笔记本', '手机', '电脑'],
    correctAnswer: '书本'
  },
]

onMounted(() => {
  questions.value = mockQuestions
  currentQuestion.value = questions.value[0]
})

const checkAnswer = (answer: string) => {
  if (isAnswered.value) return
  
  selectedAnswer.value = answer
  isAnswered.value = true
  
  if (answer === currentQuestion.value?.correctAnswer) {
    score.value++
  }
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    currentQuestion.value = questions.value[currentIndex.value]
    selectedAnswer.value = ''
    isAnswered.value = false
  } else {
    showResult.value = true
  }
}

const restartTest = () => {
  currentIndex.value = 0
  score.value = 0
  showResult.value = false
  selectedAnswer.value = ''
  isAnswered.value = false
  currentQuestion.value = questions.value[0]
}

</script>

<template>
  <SideNavHolder title="词汇测试">
    <div class="WordTest">
      <!-- 顶部选择区域 -->
      <div class="WordTest-Header">
        <div class="WordTest-BookSelect">
          <span>选择词书：</span>
          <el-select v-model="selectedBook" placeholder="请选择词书">
            <el-option label="四级过关秘籍" value="四级过关秘籍" />
          </el-select>
        </div>
      </div>

      <!-- 测试内容 -->
      <div v-if="!showResult" class="WordTest-Content">
        <div class="WordTest-Progress">
          题目进度: 2/300
        </div>
        
        <div class="WordTest-Question">
          <h2>{{ currentQuestion?.word }}</h2>
          <div class="WordTest-Options">
            <button
              v-for="option in currentQuestion?.options"
              :key="option"
              :class="[
                'WordTest-Option',
                {
                  'is-selected': selectedAnswer === option,
                  'is-correct': isAnswered && option === currentQuestion?.correctAnswer,
                  'is-wrong': isAnswered && selectedAnswer === option && option !== currentQuestion?.correctAnswer
                }
              ]"
              @click="checkAnswer(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <button
          v-if="isAnswered"
          class="WordTest-NextBtn"
          @click="nextQuestion"
        >
          {{ currentIndex < questions.length - 1 ? '下一题' : '查看结果' }}
        </button>
      </div>

      <div v-else class="WordTest-Result">
        <h2>测试完成！</h2>
        <p>得分: {{ score }}/{{ questions.length }}</p>
        <p>正确率: {{ Math.round((score / questions.length) * 100) }}%</p>
        <button class="WordTest-RestartBtn" @click="restartTest">重新测试</button>
      </div>

      <!-- AI助手 -->
      <div class="WordTest-AI">
        <div class="WordTest-AI-Header">
          <div class="icon-wrapper">
            <div i-carbon-chart-logistic-regression />
          </div>
          <h3>AI互动反馈</h3>
          <div class="ai-badge">AI助手</div>
        </div>
        <div class="WordTest-AI-Content">
          <div class="ai-chat">
            <div class="ai-message">{{ aiMessage }}</div>
            <div class="user-input">
              <el-input v-model="userQuestion" placeholder="询问AI关于你的学习情况..." @keyup.enter="askAI" round>
              </el-input>
              <el-button type="primary" round @click="askAI" :disabled="!userQuestion">
                发送
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SideNavHolder>
</template>

<style lang="scss" scoped>
.WordTest {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  &-BookSelect {
    margin-bottom: 2.5rem;
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--el-text-color-primary);
    }
  }

  &-Content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  &-Progress {
    text-align: center;
    font-size: 1.1rem;
    color: var(--el-text-color-regular);
  }

  &-Question {
    h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: var(--el-text-color-primary);
      font-weight: 600;
      letter-spacing: 0.02em;
    }
  }

  &-Options {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
  }

  &-Option {
    padding: 1.2rem;
    border: 2px solid var(--el-border-color-light);
    border-radius: 12px;
    background: var(--el-bg-color-overlay);
    font-size: 1.2rem;
    color: var(--el-text-color-regular);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }

    &.is-selected {
      background-color: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary);
      color: var(--el-color-primary);
    }

    &.is-correct {
      background-color: var(--el-color-success-light-9);
      border-color: var(--el-color-success);
      color: var(--el-color-success);
    }

    &.is-wrong {
      background-color: var(--el-color-danger-light-9);
      border-color: var(--el-color-danger);
      color: var(--el-color-danger);
    }
  }

  &-NextBtn,
  &-RestartBtn {
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    border: none;
    border-radius: 8px;
    background-color: var(--el-color-primary);
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--el-color-primary-dark-2);
    }
  }

  &-Result {
    text-align: center;

    h2 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      color: var(--el-text-color-primary);
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: var(--el-text-color-regular);
    }
  }

  &-AI {
    margin-top: 3rem;
    padding: 2rem;
    background: var(--el-bg-color-overlay);
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);

    &-Header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    &-Content {
      .ai-chat {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .ai-message {
          padding: 0.8rem 1.2rem;
          background: var(--el-color-primary-light-9);
          border-radius: 8px;
          color: var(--el-color-primary);
          max-width: 90%;
          line-height: 1.5;
        }

        .user-input {
          display: flex;
          gap: 0.8rem;
          margin-top: 0.5rem;

          :deep(.el-input) {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>

<route lang="yaml">
meta:
  transition: nav
</route>