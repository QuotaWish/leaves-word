<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElCard, ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-card.css'

defineOptions({
  name: 'CETPage',
})

interface QuestionType {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const activeTab = ref('cet4')
const score = ref(0)
const currentQuestionIndex = ref(0)
const showResult = ref(false)
const isLoading = ref(false)
const userAnswers = ref<number[]>([])

const cet4Questions = reactive<QuestionType[]>([
  {
    id: 1,
    question: 'What is the synonym of "abandon"?',
    options: ['Forsake', 'Maintain', 'Cherish', 'Embrace'],
    answer: 0,
    explanation: '"Forsake" means to give up or leave entirely, which is synonymous with "abandon".',
  },
  {
    id: 2,
    question: 'Choose the correct word: "The weather forecast ___ rain for tomorrow."',
    options: ['predicts', 'foresees', 'anticipates', 'All of the above'],
    answer: 3,
    explanation: 'All of these words can be used in this context to indicate a future prediction about the weather.',
  },
  {
    id: 3,
    question: 'What does "articulate" mean?',
    options: ['To join together', 'To express clearly', 'To move freely', 'All of the above'],
    answer: 3,
    explanation: '"Articulate" can mean all of these things: to join (articulated bus), to express clearly (articulate speaker), and joints that move freely (articulated skeleton).',
  },
])

const cet6Questions = reactive<QuestionType[]>([
  {
    id: 1,
    question: 'What is the antonym of "ephemeral"?',
    options: ['Eternal', 'Temporary', 'Fleeting', 'Momentary'],
    answer: 0,
    explanation: '"Eternal" means lasting forever, which is the opposite of "ephemeral" (lasting for a very short time).',
  },
  {
    id: 2,
    question: 'Choose the word that best completes the sentence: "His argument was so ___ that it changed many people\'s opinions."',
    options: ['redundant', 'cogent', 'fallacious', 'ambiguous'],
    answer: 1,
    explanation: '"Cogent" means clear, logical, and convincing, which fits best in this context.',
  },
  {
    id: 3,
    question: 'What does "equivocate" mean?',
    options: ['To speak directly', 'To use unclear language to deceive', 'To adjust equally', 'To reverse a decision'],
    answer: 1,
    explanation: 'To "equivocate" means to use ambiguous language to conceal the truth or avoid committing oneself.',
  },
])

const questions = computed(() => {
  return activeTab.value === 'cet4' ? cet4Questions : cet6Questions
})

function setTab(tab: string): void {
  activeTab.value = tab
  resetQuiz()
}

function resetQuiz(): void {
  currentQuestionIndex.value = 0
  score.value = 0
  showResult.value = false
  userAnswers.value = []
}

function selectAnswer(optionIndex: number): void {
  userAnswers.value[currentQuestionIndex.value] = optionIndex

  // If it's the correct answer, increment the score
  if (optionIndex === questions.value[currentQuestionIndex.value].answer) {
    score.value++
  }
}

function nextQuestion(): void {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  } else {
    showResult.value = true
  }
}

function previousQuestion(): void {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function generateAIAnalysis(): void {
  isLoading.value = true

  // 模拟AI分析生成
  setTimeout(() => {
    isLoading.value = false
    ElMessage.success('AI分析已生成，基于您的答题情况，建议重点关注同义词辨析和上下文语境理解。')
  }, 1500)
}

function isAnswered(index: number): boolean {
  return userAnswers.value[index] !== undefined
}

function isCorrect(index: number): boolean {
  return userAnswers.value[index] === questions.value[index].answer
}

const scorePercentage = computed(() => {
  return `${Math.round((score.value / questions.value.length) * 100)}%`
})
</script>

<template>
  <div class="CETPage">
    <div class="CETPage-Tabs">
      <div class="CETPage-Tab" :class="{ active: activeTab === 'cet4' }" @click="setTab('cet4')">
        四级 (CET-4)
      </div>
      <div class="CETPage-Tab" :class="{ active: activeTab === 'cet6' }" @click="setTab('cet6')">
        六级 (CET-6)
      </div>
    </div>

    <div v-if="!showResult" class="CETPage-Quiz">
      <ElCard class="CETPage-Question">
        <div class="CETPage-Progress">
          <div class="CETPage-ProgressBar">
            <div class="CETPage-ProgressFill" :style="`width: ${((currentQuestionIndex + 1) / questions.length) * 100}%`"></div>
          </div>
          <div class="CETPage-ProgressText">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</div>
        </div>

        <h2 class="CETPage-QuestionText">{{ questions[currentQuestionIndex].question }}</h2>

        <div class="CETPage-Options">
          <div
            v-for="(option, index) in questions[currentQuestionIndex].options"
            :key="index"
            class="CETPage-Option"
            :class="{
              selected: userAnswers[currentQuestionIndex] === index,
              correct: isAnswered(currentQuestionIndex) && index === questions[currentQuestionIndex].answer,
              incorrect: isAnswered(currentQuestionIndex) && userAnswers[currentQuestionIndex] === index && userAnswers[currentQuestionIndex] !== questions[currentQuestionIndex].answer,
            }"
            @click="selectAnswer(index)"
          >
            <div class="CETPage-OptionMarker">{{ String.fromCharCode(65 + index) }}</div>
            <div class="CETPage-OptionText">{{ option }}</div>
          </div>
        </div>

        <div v-if="isAnswered(currentQuestionIndex)" class="CETPage-Explanation">
          <h3>解析</h3>
          <p>{{ questions[currentQuestionIndex].explanation }}</p>
        </div>

        <div class="CETPage-Actions">
          <button class="CETPage-Button secondary" @click="previousQuestion" :disabled="currentQuestionIndex === 0">
            上一题
          </button>
          <button class="CETPage-Button primary" @click="nextQuestion" :disabled="!isAnswered(currentQuestionIndex)">
            {{ currentQuestionIndex === questions.length - 1 ? '查看结果' : '下一题' }}
          </button>
        </div>
      </ElCard>
    </div>

    <div v-else class="CETPage-Results">
      <ElCard class="CETPage-ResultsCard">
        <h2 class="CETPage-ResultsTitle">您的得分</h2>

        <div class="CETPage-ScoreCircle" :style="`--score-percentage: ${scorePercentage}`">
          <div class="CETPage-Score">{{ score }}/{{ questions.length }}</div>
          <div class="CETPage-ScoreText">{{ Math.round((score / questions.length) * 100) }}%</div>
        </div>

        <div class="CETPage-ResultsSummary">
          <h3>答题情况</h3>
          <div class="CETPage-ResultsList">
            <div
              v-for="(question, index) in questions"
              :key="question.id"
              class="CETPage-ResultItem"
              :class="{ correct: isCorrect(index), incorrect: !isCorrect(index) }"
            >
              <div class="CETPage-ResultNumber">{{ index + 1 }}</div>
              <div class="CETPage-ResultIcon">
                <div v-if="isCorrect(index)" class="i-carbon-checkmark"></div>
                <div v-else class="i-carbon-close"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="CETPage-AI">
          <button class="CETPage-Button ai" @click="generateAIAnalysis" :disabled="isLoading">
            <div class="i-carbon-machine-learning-model mr-2"></div>
            {{ isLoading ? '生成中...' : 'AI学习分析' }}
          </button>
          <p class="CETPage-AITip">AI将分析您的答题情况，提供个性化学习建议</p>
        </div>

        <div class="CETPage-Actions mt-4">
          <button class="CETPage-Button secondary" @click="resetQuiz">
            重新测试
          </button>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.CETPage {
  padding: 1rem;

  &-Tabs {
    display: flex;
    margin-bottom: 1.5rem;
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--el-fill-color-light);
  }

  &-Tab {
    flex: 1;
    padding: 0.75rem;
    text-align: center;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;

    &.active {
      background-color: var(--el-color-primary);
      color: white;
    }
  }

  &-Quiz,
  &-Results {
    max-width: 700px;
    margin: 0 auto;
  }

  &-Question,
  &-ResultsCard {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &-Progress {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;

    &Bar {
      flex: 1;
      height: 8px;
      background-color: var(--el-fill-color-light);
      border-radius: 4px;
      overflow: hidden;
      margin-right: 1rem;
    }

    &Fill {
      height: 100%;
      background-color: var(--el-color-primary);
      transition: width 0.3s ease;
    }

    &Text {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  &-QuestionText {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }

  &-Options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  &-Option {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid var(--el-border-color);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--el-color-primary-light-5);
      background-color: var(--el-color-primary-light-9);
    }

    &.selected {
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-8);
    }

    &.correct {
      border-color: var(--el-color-success);
      background-color: var(--el-color-success-light-9);
    }

    &.incorrect {
      border-color: var(--el-color-danger);
      background-color: var(--el-color-danger-light-9);
    }

    &Marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: var(--el-fill-color);
      margin-right: 0.75rem;
      font-weight: 500;
    }

    &Text {
      flex: 1;
    }
  }

  &-Explanation {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: var(--el-color-info-light-9);

    h3 {
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--el-color-info-dark-2);
    }

    p {
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--el-text-color-regular);
    }
  }

  &-Actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
  }

  &-Button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.25rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &.primary {
      background-color: var(--el-color-primary);
      color: white;

      &:hover {
        background-color: var(--el-color-primary-dark-2);
      }

      &:disabled {
        background-color: var(--el-color-primary-light-5);
        cursor: not-allowed;
      }
    }

    &.secondary {
      background-color: var(--el-fill-color-light);
      color: var(--el-text-color-regular);

      &:hover {
        background-color: var(--el-fill-color-dark);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    &.ai {
      background: linear-gradient(135deg, #3662ec, #8a54ff);
      color: white;
      padding: 0.75rem 1.5rem;
      width: 100%;

      &:hover {
        filter: brightness(1.05);
      }

      &:disabled {
        filter: grayscale(0.5);
        cursor: wait;
      }
    }
  }

  &-ResultsTitle {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  &-ScoreCircle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: conic-gradient(
      var(--el-color-primary) 0% var(--score-percentage),
      var(--el-fill-color-light) var(--score-percentage) 100%
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2rem;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 10px;
      right: 10px;
      bottom: 10px;
      left: 10px;
      background-color: white;
      border-radius: 50%;
    }
  }

  &-Score {
    position: relative;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--el-color-primary);
  }

  &-ScoreText {
    position: relative;
    font-size: 1rem;
    color: var(--el-text-color-secondary);
  }

  &-ResultsSummary {
    margin-bottom: 2rem;

    h3 {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }
  }

  &-ResultsList {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &-ResultItem {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 48px;
    height: 48px;
    border-radius: 8px;

    &.correct {
      background-color: var(--el-color-success-light-9);
      color: var(--el-color-success);
    }

    &.incorrect {
      background-color: var(--el-color-danger-light-9);
      color: var(--el-color-danger);
    }

    &Number {
      font-size: 0.875rem;
      font-weight: 500;
    }

    &Icon {
      font-size: 1rem;
    }
  }

  &-AI {
    margin-top: 2rem;

    &Tip {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--el-text-color-secondary);
      text-align: center;
    }
  }
}
</style>

<route lang="yaml">
meta:
  title: 四六级
  layout: explore
</route>
