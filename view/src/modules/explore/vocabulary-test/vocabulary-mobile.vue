<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { ElButton, ElCard, ElDialog, ElOption, ElProgress, ElSelect } from 'element-plus'
import 'element-plus/theme-chalk/el-card.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-progress.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-select.css'
import 'element-plus/theme-chalk/el-option.css'

defineOptions({
  name: 'VocabularyTestMobilePage',
})

interface Word {
  id: number
  english: string
  chinese: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface Question {
  id: number
  type: 'match-definition' | 'complete-sentence' | 'multiple-choice'
  word: Word
  question: string
  options: string[]
  answer: number
  explanation?: string
}

const testStarted = ref(false)
const testCompleted = ref(false)
const currentQuestionIndex = ref(0)
const userAnswers = ref<(number | null)[]>([])
const timeRemaining = ref(600) // 10 minutes in seconds
const timer = ref<number | null>(null)
const vocabulary = ref<Word[]>([])
const showStartDialog = ref(true)
const showAbilityDialog = ref(false)
const isGeneratingAnalysis = ref(false)
const aiAnalysis = ref('')
const selectedLevel = ref('all')

const levels = [
  { value: 'all', label: '全部词汇' },
  { value: 'cet4', label: '四级词汇' },
  { value: 'cet6', label: '六级词汇' },
  { value: 'ielts', label: '雅思词汇' },
  { value: 'toefl', label: '托福词汇' },
]

// 模拟词汇库
const wordBank = reactive<Word[]>([
  { id: 1, english: 'abandon', chinese: '放弃；抛弃', difficulty: 'easy' },
  { id: 2, english: 'abbreviate', chinese: '缩写；缩短', difficulty: 'medium' },
  { id: 3, english: 'abide', chinese: '遵守；容忍', difficulty: 'medium' },
  { id: 4, english: 'ability', chinese: '能力；才能', difficulty: 'easy' },
  { id: 5, english: 'abnormal', chinese: '不正常的；变态的', difficulty: 'easy' },
  { id: 6, english: 'abolish', chinese: '废除；取消', difficulty: 'medium' },
  { id: 7, english: 'abound', chinese: '富于；充满', difficulty: 'hard' },
  { id: 8, english: 'abrupt', chinese: '突然的；唐突的', difficulty: 'medium' },
  { id: 9, english: 'absurd', chinese: '荒谬的；荒唐的', difficulty: 'medium' },
  { id: 10, english: 'abundant', chinese: '丰富的；充裕的', difficulty: 'medium' },
  { id: 11, english: 'academic', chinese: '学术的；教学的', difficulty: 'easy' },
  { id: 12, english: 'accelerate', chinese: '加速；促进', difficulty: 'medium' },
  { id: 13, english: 'accomplishment', chinese: '成就；完成', difficulty: 'medium' },
  { id: 14, english: 'accumulate', chinese: '积累；积聚', difficulty: 'medium' },
  { id: 15, english: 'accurate', chinese: '准确的；精确的', difficulty: 'easy' },
])

// 生成测试问题
function generateQuestions(words: Word[]): Question[] {
  const questions: Question[] = []

  // 匹配定义
  words.forEach((word, index) => {
    if (index % 3 === 0) {
      const options = [word.chinese]

      // 添加干扰选项
      while (options.length < 4) {
        const randomWord = words[Math.floor(Math.random() * words.length)]
        if (!options.includes(randomWord.chinese) && randomWord.id !== word.id) {
          options.push(randomWord.chinese)
        }
      }

      // 随机排序选项
      const shuffledOptions = [...options].sort(() => Math.random() - 0.5)
      const correctAnswer = shuffledOptions.indexOf(word.chinese)

      questions.push({
        id: questions.length + 1,
        type: 'match-definition',
        word,
        question: `What is the meaning of "${word.english}"?`,
        options: shuffledOptions,
        answer: correctAnswer,
      })
    }
    // 完成句子
    else if (index % 3 === 1) {
      const sentenceTemplates = [
        'The project manager decided to _____ the meeting until next week.',
        'Scientists are trying to _____ a cure for the disease.',
        'It\'s important to _____ all the safety instructions before operating the machine.',
        'The company plans to _____ its operations in Asia next year.',
      ]

      const randomTemplate = sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)]

      const options = [word.english]

      // 添加干扰选项
      while (options.length < 4) {
        const randomWord = words[Math.floor(Math.random() * words.length)]
        if (!options.includes(randomWord.english) && randomWord.id !== word.id) {
          options.push(randomWord.english)
        }
      }

      // 随机排序选项
      const shuffledOptions = [...options].sort(() => Math.random() - 0.5)
      const correctAnswer = shuffledOptions.indexOf(word.english)

      questions.push({
        id: questions.length + 1,
        type: 'complete-sentence',
        word,
        question: randomTemplate,
        options: shuffledOptions,
        answer: correctAnswer,
      })
    }
    // 多项选择
    else {
      const synAntTemplates = [
        `Which word is a synonym for "${word.english}"?`,
        `Which word is an antonym for "${word.english}"?`,
        `Which word is closest in meaning to "${word.english}"?`,
      ]

      const randomTemplate = synAntTemplates[Math.floor(Math.random() * synAntTemplates.length)]

      // 这里简化处理，实际应用中应该有同义词和反义词的数据
      const options = ['option1', 'option2', 'option3', 'option4']
      const correctAnswer = Math.floor(Math.random() * 4)

      questions.push({
        id: questions.length + 1,
        type: 'multiple-choice',
        word,
        question: randomTemplate,
        options,
        answer: correctAnswer,
        explanation: '这是一个占位解释。在真实应用中，这里会有有意义的解释。',
      })
    }
  })

  return questions.slice(0, 10) // 只返回10个问题
}

function startTest(): void {
  showStartDialog.value = false
  testStarted.value = true
  testCompleted.value = false
  currentQuestionIndex.value = 0
  userAnswers.value = new Array(10).fill(null)

  // 获取词汇
  vocabulary.value = selectWords()

  // 开始计时
  timer.value = window.setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      finishTest()
    }
  }, 1000)
}

function selectWords(): Word[] {
  // 实际应用中根据选择的级别过滤单词
  return wordBank.sort(() => Math.random() - 0.5).slice(0, 10)
}

function finishTest(): void {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }

  testCompleted.value = true
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}

const questions = computed(() => {
  return generateQuestions(vocabulary.value)
})

const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value] || null
})

const progress = computed(() => {
  return Math.round(((currentQuestionIndex.value + 1) / questions.value.length) * 100)
})

const score = computed(() => {
  let correct = 0
  userAnswers.value.forEach((answer, index) => {
    if (answer === questions.value[index]?.answer) {
      correct++
    }
  })
  return correct
})

const accuracy = computed(() => {
  if (userAnswers.value.filter(a => a !== null).length === 0) {
    return 0
  }
  return Math.round((score.value / questions.value.length) * 100)
})

function selectAnswer(index: number): void {
  userAnswers.value[currentQuestionIndex.value] = index
}

function nextQuestion(): void {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  } else {
    finishTest()
  }
}

function previousQuestion(): void {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function restartTest(): void {
  showStartDialog.value = true
  testStarted.value = false
  testCompleted.value = false
  timeRemaining.value = 600
  userAnswers.value = []
}

function showAnalysis(): void {
  showAbilityDialog.value = true
  generateAnalysis()
}

function generateAnalysis(): void {
  isGeneratingAnalysis.value = true

  // 模拟AI分析生成
  setTimeout(() => {
    isGeneratingAnalysis.value = false

    const strengths = ['词义理解', '上下文推断']
    const weaknesses = ['多义词辨析', '同义词区分']

    const analysisText = `<h3>词汇能力分析</h3>
<p>基于您的测试表现，AI分析了您的词汇掌握情况：</p>

<div class="analysis-section">
  <h4>优势领域</h4>
  <ul>
    ${strengths.map(s => `<li>${s}</li>`).join('')}
  </ul>
</div>

<div class="analysis-section">
  <h4>需要提升</h4>
  <ul>
    ${weaknesses.map(w => `<li>${w}</li>`).join('')}
  </ul>
</div>

<div class="analysis-section">
  <h4>个性化学习建议</h4>
  <p>建议通过以下方式提升您的词汇量：</p>
  <ol>
    <li>每天学习5-10个新词汇，重点关注同义词辨析</li>
    <li>使用英语词典查询单词，而非直接翻译</li>
    <li>通过阅读英语文章在上下文中理解单词</li>
    <li>使用词汇记忆软件进行间隔重复学习</li>
  </ol>
</div>

<p>继续练习，您的词汇量将会稳步提升！</p>`

    aiAnalysis.value = analysisText
  }, 2000)
}
</script>

<template>
  <div class="VocabularyTestPage">
    <div class="VocabularyTestPage-Header">
      <h1>词汇测试</h1>
      <h2>Vocabulary Assessment</h2>
    </div>

    <!-- 测试界面 -->
    <div v-if="testStarted && !testCompleted" class="VocabularyTestPage-Test">
      <div class="VocabularyTestPage-StatusBar">
        <div class="VocabularyTestPage-Progress">
          <span>题目 {{ currentQuestionIndex + 1 }}/{{ questions.length }}</span>
          <ElProgress :percentage="progress" :stroke-width="6" />
        </div>

        <div class="VocabularyTestPage-Timer">
          <div class="i-carbon-time"></div>
          <span>{{ formatTime(timeRemaining) }}</span>
        </div>
      </div>

      <ElCard v-if="currentQuestion" class="VocabularyTestPage-Question">
        <h3 class="VocabularyTestPage-QuestionText">{{ currentQuestion.question }}</h3>

        <div class="VocabularyTestPage-Options">
          <div
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="VocabularyTestPage-Option"
            :class="{ selected: userAnswers[currentQuestionIndex] === index }"
            @click="selectAnswer(index)"
          >
            <div class="VocabularyTestPage-OptionMarker">{{ String.fromCharCode(65 + index) }}</div>
            <div class="VocabularyTestPage-OptionText">{{ option }}</div>
          </div>
        </div>

        <div class="VocabularyTestPage-Navigation">
          <ElButton
            v-if="currentQuestionIndex > 0"
            @click="previousQuestion"
            class="VocabularyTestPage-NavButton"
            plain
            size="small"
          >
            <div class="i-carbon-arrow-left"></div>
            上一题
          </ElButton>

          <ElButton
            @click="nextQuestion"
            class="VocabularyTestPage-NavButton"
            type="primary"
            size="small"
            :disabled="userAnswers[currentQuestionIndex] === null"
          >
            {{ currentQuestionIndex === questions.length - 1 ? '完成测试' : '下一题' }}
            <div v-if="currentQuestionIndex < questions.length - 1" class="i-carbon-arrow-right"></div>
            <div v-else class="i-carbon-checkmark"></div>
          </ElButton>
        </div>
      </ElCard>
    </div>

    <!-- 结果页面 -->
    <div v-else-if="testCompleted" class="VocabularyTestPage-Results">
      <ElCard class="VocabularyTestPage-ResultsCard">
        <div class="VocabularyTestPage-ResultsHeader">
          <h2>测试完成！</h2>
          <p>您已完成词汇能力测试，以下是您的成绩：</p>
        </div>

        <div class="VocabularyTestPage-ScoreCircle">
          <div class="VocabularyTestPage-ScoreText">
            <div class="VocabularyTestPage-ScoreValue">{{ score }}/{{ questions.length }}</div>
            <div class="VocabularyTestPage-ScorePercent">{{ accuracy }}%</div>
          </div>
        </div>

        <div class="VocabularyTestPage-ScoreDetails">
          <div class="VocabularyTestPage-ScoreMetric">
            <div class="VocabularyTestPage-ScoreMetricLabel">正确率</div>
            <div class="VocabularyTestPage-ScoreMetricValue">{{ accuracy }}%</div>
          </div>

          <div class="VocabularyTestPage-ScoreMetric">
            <div class="VocabularyTestPage-ScoreMetricLabel">完成时间</div>
            <div class="VocabularyTestPage-ScoreMetricValue">{{ 10 - Math.floor(timeRemaining / 60) }}:{{ 60 - (timeRemaining % 60) < 10 ? '0' : '' }}{{ 60 - (timeRemaining % 60) }}</div>
          </div>

          <div class="VocabularyTestPage-ScoreMetric">
            <div class="VocabularyTestPage-ScoreMetricLabel">测试难度</div>
            <div class="VocabularyTestPage-ScoreMetricValue">{{ selectedLevel === 'all' ? '综合' : selectedLevel.toUpperCase() }}</div>
          </div>
        </div>

        <div class="VocabularyTestPage-Actions">
          <ElButton @click="showAnalysis" type="primary" class="VocabularyTestPage-AIButton" size="small">
            <div class="i-carbon-machine-learning-model"></div>
            AI词汇能力分析
          </ElButton>

          <ElButton @click="restartTest" plain class="VocabularyTestPage-RestartButton" size="small">
            <div class="i-carbon-restart"></div>
            重新测试
          </ElButton>
        </div>
      </ElCard>
    </div>

    <!-- 开始测试对话框 -->
    <ElDialog
      v-model="showStartDialog"
      title="词汇能力测试"
      width="90%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="VocabularyTestPage-StartDialog">
        <div class="VocabularyTestPage-StartIcon">
          <div class="i-carbon-dictionary"></div>
        </div>

        <h3>欢迎参加词汇能力测试</h3>

        <p>本测试将评估您的英语词汇掌握水平，通过AI分析提供个性化学习建议。</p>

        <div class="VocabularyTestPage-TestInfo">
          <div class="VocabularyTestPage-TestInfoItem">
            <div class="i-carbon-document"></div>
            <div>
              <h4>测试内容</h4>
              <p>10道多选题，包含词义匹配、句子填空和同义词辨析</p>
            </div>
          </div>

          <div class="VocabularyTestPage-TestInfoItem">
            <div class="i-carbon-time"></div>
            <div>
              <h4>测试时间</h4>
              <p>10分钟，请合理安排答题时间</p>
            </div>
          </div>
        </div>

        <div class="VocabularyTestPage-LevelSelect">
          <span>选择词汇级别：</span>
          <ElSelect v-model="selectedLevel" placeholder="选择词汇级别" size="small">
            <ElOption
              v-for="item in levels"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </div>

        <div class="VocabularyTestPage-StartActions">
          <ElButton @click="startTest" type="primary" size="small">
            开始测试
          </ElButton>
        </div>
      </div>
    </ElDialog>

    <!-- AI分析对话框 -->
    <ElDialog
      v-model="showAbilityDialog"
      title="AI词汇能力分析"
      width="90%"
      :show-close="true"
    >
      <div v-if="isGeneratingAnalysis" class="VocabularyTestPage-Loading">
        <div class="VocabularyTestPage-LoadingIcon">
          <div class="i-carbon-circle-dash animate-spin"></div>
        </div>
        <p>AI正在分析您的词汇能力...</p>
      </div>

      <div v-else class="VocabularyTestPage-Analysis" v-html="aiAnalysis"></div>
    </ElDialog>
  </div>
</template>

<style lang="scss" scoped>
.VocabularyTestPage {
  padding: 0.75rem;
  max-width: 100%;
  overflow-x: hidden;

  &-Header {
    text-align: center;
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 0.25rem;
    }

    h2 {
      font-size: 1rem;
      font-weight: 400;
      color: var(--el-text-color-secondary);
    }
  }

  &-StatusBar {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.75rem;
  }

  &-Progress {
    flex: 1;
    margin-bottom: 0.75rem;

    span {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
      color: var(--el-text-color-secondary);
    }
  }

  &-Timer {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--el-color-primary-light-9);
    padding: 0.5rem;
    border-radius: 4px;
    color: var(--el-color-primary);
    font-size: 0.875rem;

    [class^='i-'] {
      margin-right: 0.5rem;
      font-size: 1rem;
    }

    span {
      font-weight: 500;
    }
  }

  &-Test {
    width: 100%;
  }

  &-Question {
    border-radius: 8px;
  }

  &-QuestionText {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: var(--el-text-color-primary);
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
    border-radius: 6px;
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

    &Marker {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: var(--el-fill-color);
      margin-right: 0.75rem;
      font-weight: 500;
      font-size: 0.875rem;
    }

    &Text {
      flex: 1;
      font-size: 0.875rem;
    }
  }

  &-Navigation {
    display: flex;
    justify-content: space-between;
  }

  &-NavButton {
    display: flex;
    align-items: center;
    font-size: 0.875rem;

    [class^='i-'] {
      margin-right: 0.3rem;
      margin-left: 0.3rem;
    }
  }

  &-Results {
    width: 100%;
  }

  &-ResultsCard {
    border-radius: 8px;
    text-align: center;
  }

  &-ResultsHeader {
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--el-color-primary);
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--el-text-color-secondary);
      font-size: 0.875rem;
    }
  }

  &-ScoreCircle {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    margin: 0 auto 1.5rem;
    background: conic-gradient(
      var(--el-color-success) 0% calc(v-bind('accuracy') * 1%),
      var(--el-fill-color-light) calc(v-bind('accuracy') * 1%) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
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

  &-ScoreText {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-ScoreValue {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--el-color-success);
  }

  &-ScorePercent {
    font-size: 0.875rem;
    color: var(--el-text-color-secondary);
  }

  &-ScoreDetails {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-bottom: 1.5rem;
  }

  &-ScoreMetric {
    text-align: center;
    margin: 0.5rem;
    flex: 1 0 30%;

    &Label {
      font-size: 0.75rem;
      color: var(--el-text-color-secondary);
      margin-bottom: 0.25rem;
    }

    &Value {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
  }

  &-Actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &-AIButton,
  &-RestartButton {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;

    [class^='i-'] {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }

  &-StartDialog {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0.75rem 0;
      color: var(--el-text-color-primary);
    }

    p {
      color: var(--el-text-color-secondary);
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
  }

  &-StartIcon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: var(--el-color-primary-light-9);
    display: flex;
    align-items: center;
    justify-content: center;

    [class^='i-'] {
      font-size: 1.75rem;
      color: var(--el-color-primary);
    }
  }

  &-TestInfo {
    width: 100%;
    margin-bottom: 1rem;

    &Item {
      display: flex;
      align-items: flex-start;
      text-align: left;
      padding: 0.75rem;
      border-radius: 6px;
      background-color: var(--el-fill-color-light);
      margin-bottom: 0.75rem;

      [class^='i-'] {
        font-size: 1.25rem;
        margin-right: 0.75rem;
        color: var(--el-color-primary);
      }

      h4 {
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.25rem;
        color: var(--el-text-color-primary);
      }

      p {
        font-size: 0.75rem;
        color: var(--el-text-color-secondary);
        margin: 0;
      }
    }
  }

  &-LevelSelect {
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    span {
      white-space: nowrap;
      font-size: 0.875rem;
    }

    :deep(.el-select) {
      width: 100%;
    }
  }

  &-StartActions {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &-Loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;

    &Icon {
      font-size: 2.5rem;
      color: var(--el-color-primary);
      margin-bottom: 0.75rem;
    }

    p {
      color: var(--el-text-color-secondary);
      font-size: 0.875rem;
    }
  }
}

// 对话框内的HTML内容样式
:deep(.analysis-section) {
  margin-bottom: 1rem;

  h3,
  h4 {
    margin-bottom: 0.5rem;
    color: var(--el-color-primary);
    font-size: 1rem;
  }

  ul,
  ol {
    padding-left: 1.25rem;
    font-size: 0.875rem;

    li {
      margin-bottom: 0.5rem;
    }
  }

  p {
    font-size: 0.875rem;
  }
}

:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
  
  .el-dialog__header {
    margin: 0;
    padding: 1rem;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
  
  .el-dialog__body {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .VocabularyTestPage {
    padding: 0.5rem;
    
    &-Header {
      margin-bottom: 1rem;
      
      h1 {
        font-size: 1.25rem;
      }
      
      h2 {
        font-size: 0.875rem;
      }
    }
    
    &-QuestionText {
      font-size: 0.875rem;
    }
    
    &-ScoreCircle {
      width: 120px;
      height: 120px;
    }
    
    &-ScoreValue {
      font-size: 1.25rem;
    }
    
    &-Actions {
      gap: 0.5rem;
    }
  }
}
</style>

<route lang="yaml">
meta:
  title: 词汇测试
  layout: explore
</route>
</script> 