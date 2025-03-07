<template>
  <div class="ai-features-container">
    <div class="ai-feature-card primary-card">
      <div class="ai-feature-header">
        <h3>AI智能学习建议</h3>
        <div class="ai-badge">AI建议</div>
      </div>
      <div class="ai-feature-content">
        {{ getPersonalizedTips() }}
      </div>
    </div>

    <div class="ai-feature-card">
      <div class="ai-feature-header">
        <div class="icon-wrapper">
          <div i-carbon-ai-results />
        </div>
        <h3>难点智能识别</h3>
        <div class="ai-badge">AI分析</div>
      </div>
      <div class="ai-feature-content">
        <div v-if="difficultWords.length > 0" class="difficulty-tags">
          <el-tag v-for="word in difficultWords" :key="word.word" :type="getTagType(word.attempts)" effect="plain"
            class="word-tag">
            {{ word.word }}
          </el-tag>
        </div>
        <p v-else>暂未发现明显的学习难点，继续保持！</p>
        <div class="ai-analysis">
          <p>{{ getDifficultyAnalysis() }}</p>
        </div>
      </div>
    </div>

    <div class="ai-feature-card">
      <div class="ai-feature-header">
        <div class="icon-wrapper">
          <div i-carbon-compass/>
        </div>
        <h3>个性化学习路径</h3>
        <div class="ai-badge">AI定制</div>
      </div>
      <div class="ai-feature-content">
        <div class="learning-path">
          <el-steps :active="learningPathStep" finish-status="success" simple>
            <el-step v-for="(step, index) in learningPath" :key="index" :title="step.title"
              :description="step.description"></el-step>
          </el-steps>
        </div>
        <div class="ai-tip">
          <p>{{ getLearningPathTip() }}</p>
        </div>
      </div>
    </div>

    <div class="ai-feature-card">
      <div class="ai-feature-header">
        <div class="icon-wrapper">
          <div i-carbon-chart-logistic-regression />
        </div>
        <h3>AI互动反馈</h3>
        <div class="ai-badge">AI助手</div>
      </div>
      <div class="ai-feature-content">
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElTag, ElSteps, ElStep, ElInput, ElButton } from 'element-plus'

const props = defineProps<{
  correctRate: number
  averageTimePerWord: number
  sessionDuration: number
  wordsDetails: any[]
}>()

// AI特色功能相关数据
const userQuestion = ref('')
const aiMessage = ref('你好！我是你的AI学习助手。你想了解什么关于你的学习情况？')
const difficultWords = computed(() => {
  if (!props.wordsDetails?.length) return []
  return props.wordsDetails
    .filter(word => word.attempts > 1 || word.timeSpent > 8000)
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 5)
})

const learningPath = [
  { title: '基础巩固', description: '掌握基本词汇' },
  { title: '理解记忆', description: '可以理解记忆' },
  { title: '能力提升', description: '提高反应速度' },
  { title: '难点突破', description: '攻克学习障碍' },
  { title: '综合应用', description: '灵活运用所学' },
]

const learningPathStep = computed(() => {
  if (!props.wordsDetails?.length) return 0
  const correctRateVal = props.correctRate
  if (correctRateVal < 0.5) return 0
  if (correctRateVal < 0.7) return 1
  if (correctRateVal < 0.85) return 2
  return 3
})

// AI特色功能方法
const getPersonalizedTips = () => {
  if (!props.wordsDetails?.length) return '当你开始学习后，AI将为你提供个性化的学习建议。'

  const tips = [
    '根据你的学习表现，建议你增加每日复习次数，尤其是对于反应时间较慢的单词。',
    '你的学习曲线显示定期复习效果最佳，建议每3天系统复习一次学过的内容。',
    '检测到你在长单词上花费时间较多，建议尝试词根词缀记忆法提高效率。',
    '你的学习专注度很高，建议在疲劳前适当休息，保持高效学习状态。',
    '分析显示你在晚上学习效率更高，建议调整学习时间获得更好效果。'
  ]

  // 根据用户表现选择最合适的建议
  if (props.correctRate < 0.6) return tips[0]
  if (props.averageTimePerWord > 5000) return tips[2]
  if (props.sessionDuration > 30 * 60 * 1000) return tips[3]

  // 随机返回一条建议
  return tips[Math.floor(Math.random() * tips.length)]
}

const regenerateTips = () => {
  // 实际应用中这里应该调用后端API获取新的AI生成建议
  // 这里仅模拟刷新
  const currentTip = getPersonalizedTips()
  let newTip = currentTip
  while (newTip === currentTip) {
    newTip = getPersonalizedTips()
  }
}

const getTagType = (attempts: number) => {
  if (attempts >= 3) return 'danger'
  if (attempts >= 2) return 'warning'
  return 'info'
}

const getDifficultyAnalysis = () => {
  if (!difficultWords.value.length) return '暂无难点数据分析'

  const patterns = [
    '你的学习难点主要集中在较长的词汇上，建议采用拆分记忆法。',
    '分析显示您对抽象概念类词汇掌握较慢，建议通过具体场景联想增强记忆。',
    'AI检测到你对含特殊拼写规则的词汇记忆困难，推荐通过规则归纳提高效率。',
    '根据你的学习数据，AI建议你对这些难点词汇增加50%的复习频率。'
  ]

  return patterns[Math.floor(Math.random() * patterns.length)]
}

const getLearningPathTip = () => {
  const tips = [
    '专注基础词汇学习，多使用情景记忆法提高记忆效果。',
    '建议挑战自我，适当增加学习难度，控制每个单词的反应时间。',
    '针对难点进行专项训练，结合AI分析找出记忆瓶颈。',
    '恭喜你已达到高级水平！建议尝试更复杂的学习材料挑战自我。'
  ]

  return tips[learningPathStep.value]
}

const askAI = () => {
  if (!userQuestion.value) return

  // 实际应用中这里应该调用后端API获取AI回复
  // 这里仅模拟AI回复
  const responses = [
    `根据你的学习数据分析，你在"${difficultWords.value[0]?.word || '词汇'}"上存在困难。建议增加该类词汇的练习频率。`,
    '你的学习效率在过去一周提升了12%，继续保持这种学习节奏非常理想。',
    '分析显示你的记忆曲线呈现正常的艾宾浩斯遗忘曲线，建议遵循科学的间隔重复法则进行复习。',
    '你的学习状态略有波动，可能与学习环境或时间有关，建议固定学习时间以获得更稳定的效果。',
    '如果你遇到记忆困难，AI推荐你尝试词根词缀记忆法或联想记忆法，这对于你的学习类型特别有效。'
  ]

  aiMessage.value = responses[Math.floor(Math.random() * responses.length)]
  userQuestion.value = ''
}
</script>

<style scoped>
.ai-features-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.ai-feature-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
  width: 100%;
}

.primary-card {
  background-color: rgba(126, 87, 194, 0.08);
}

.ai-feature-card:hover {
  transform: translateY(-2px);
  border-color: rgba(126, 87, 194, 0.15);
}

.ai-feature-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
  position: relative;
}

.icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(126, 87, 194, 0.8);
}

.ai-feature-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  flex-grow: 1;
}

.ai-badge {
  background-color: rgba(126, 87, 194, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 400;
}

.ai-feature-content {
  font-size: 15px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.difficulty-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.word-tag {
  border-radius: 12px;
  font-weight: 400;
}

.ai-analysis {
  margin-top: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.learning-path {
  margin: 16px 0;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.ai-tip {
  margin-top: 14px;
  font-style: italic;
  color: var(--el-text-color-secondary);
  padding: 12px;
  background: rgba(126, 87, 194, 0.05);
  border-radius: 10px;
}

.ai-chat {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-message {
  background: rgba(255, 255, 255, 0.05);
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 10px;
}

.user-input {
  display: flex;
  gap: 10px;
}

:deep(.el-steps--simple) {
  background: transparent;
}

:deep(.el-step__title) {
  font-size: 14px;
}

:deep(.el-step__description) {
  font-size: 12px;
}

:deep(.el-button) {
  font-weight: 400;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(126, 87, 194, 0.1);
}

:deep(.el-input__inner) {
  color: var(--el-text-color-primary);
}

:deep(.el-input__inner::placeholder) {
  color: var(--el-text-color-secondary);
}

/* 黑暗模式适配 */
:root[data-theme='dark'] .ai-feature-card {
  background: rgba(30, 30, 40, 0.5);
}

:root[data-theme='dark'] .primary-card {
  background: rgba(126, 87, 194, 0.08);
}

:root[data-theme='dark'] .ai-analysis,
:root[data-theme='dark'] .ai-tip,
:root[data-theme='dark'] .learning-path {
  background: rgba(30, 30, 40, 0.5);
}
</style>