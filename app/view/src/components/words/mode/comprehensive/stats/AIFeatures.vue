<template>
  <div class="ai-features-container">
    <div class="ai-feature-card">
      <div class="ai-feature-header">
        <div class="icon-wrapper">
          <i class="el-icon-magic-stick"></i>
        </div>
        <h3>AI智能学习建议</h3>
        <div class="ai-badge">AI智能</div>
      </div>
      <div class="ai-feature-content">
        <div class="ai-typing-effect">{{ getPersonalizedTips() }}</div>
        <div class="ai-animation-dots">
          <span></span><span></span><span></span>
        </div>
        <div class="ai-actions">
          <el-button size="small" type="primary" round @click="regenerateTips">重新生成建议</el-button>
        </div>
      </div>
    </div>
    
    <div class="ai-feature-card">
      <div class="ai-feature-header">
        <div class="icon-wrapper">
          <i class="el-icon-warning"></i>
        </div>
        <h3>难点智能识别</h3>
        <div class="ai-badge">AI分析</div>
      </div>
      <div class="ai-feature-content">
        <div v-if="difficultWords.length > 0" class="difficulty-tags">
          <el-tag 
            v-for="word in difficultWords" 
            :key="word.word"
            :type="getTagType(word.attempts)"
            effect="dark"
            class="word-tag"
          >
            {{ word.word }}
          </el-tag>
        </div>
        <p v-else>暂未发现明显的学习难点，继续保持！</p>
        <div class="ai-difficulty-analysis">
          <div class="ai-analysis-header">
            <i class="el-icon-cpu"></i>
            <span>AI分析结果</span>
          </div>
          <p>{{ getDifficultyAnalysis() }}</p>
        </div>
      </div>
    </div>
    
    <div class="ai-feature-card">
      <div class="ai-feature-header">
        <div class="icon-wrapper">
          <i class="el-icon-map-location"></i>
        </div>
        <h3>个性化学习路径</h3>
        <div class="ai-badge">AI定制</div>
      </div>
      <div class="ai-feature-content">
        <div class="learning-path">
          <el-steps :active="learningPathStep" finish-status="success" simple>
            <el-step v-for="(step, index) in learningPath" :key="index" :title="step.title" :description="step.description"></el-step>
          </el-steps>
        </div>
        <div class="ai-learning-tip">
          <div class="ai-chip">
            <i class="el-icon-s-opportunity"></i>
            <span>AI 建议</span>
          </div>
          <p class="learning-path-tip">{{ getLearningPathTip() }}</p>
        </div>
      </div>
    </div>
    
    <div class="ai-feature-card">
      <div class="ai-feature-header">
        <div class="icon-wrapper">
          <i class="el-icon-chat-dot-round"></i>
        </div>
        <h3>AI互动反馈</h3>
        <div class="ai-badge">AI助手</div>
      </div>
      <div class="ai-feature-content">
        <div class="ai-chat">
          <div class="ai-message">
            <div class="ai-avatar">
              <div class="ai-avatar-pulse"></div>
            </div>
            <div class="message-content">{{ aiMessage }}</div>
          </div>
          <div class="user-input">
            <el-input 
              v-model="userQuestion" 
              placeholder="询问AI关于你的学习情况..." 
              @keyup.enter="askAI"
              round
            >
              <template #prefix>
                <i class="el-icon-search"></i>
              </template>
            </el-input>
            <el-button type="primary" round @click="askAI" :disabled="!userQuestion">
              <i class="el-icon-s-promotion"></i>
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
  { title: '能力提升', description: '提高反应速度' },
  { title: '难点突破', description: '攻克学习障碍' },
  { title: '综合应用', description: '灵活运用所学' }
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
  gap: 24px;
  margin-bottom: 32px;
}

.ai-feature-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.ai-feature-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(126,87,194,0.03) 0%, transparent 50%);
  animation: rotate 20s linear infinite;
  z-index: -1;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(126,87,194,0.2);
  border-color: rgba(126,87,194,0.2);
}

.ai-feature-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  position: relative;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(126,87,194,0.8), rgba(33,150,243,0.8));
  box-shadow: 0 4px 8px rgba(126,87,194,0.3);
  position: relative;
  overflow: hidden;
}

.icon-wrapper::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
  animation: pulse-light 3s ease-in-out infinite;
}

@keyframes pulse-light {
  0% { transform: scale(0.8); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: scale(1.2); opacity: 0; }
}

.ai-feature-header i {
  font-size: 24px;
  color: white;
  position: relative;
  z-index: 2;
}

.ai-feature-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  flex-grow: 1;
}

.ai-badge {
  background: linear-gradient(90deg, #7e57c2, #2196f3);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.ai-feature-content {
  font-size: 16px;
  color: var(--el-text-color-regular);
  line-height: 1.8;
  padding: 0 16px;
  position: relative;
}

/* AI 动画效果 */
.ai-typing-effect {
  border-left: 3px solid #7e57c2;
  padding-left: 16px;
  position: relative;
}

.ai-animation-dots {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  margin-left: 16px;
  height: 20px;
}

.ai-animation-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7e57c2;
  opacity: 0.6;
  display: inline-block;
  animation: dot-pulse 1.5s infinite ease-in-out;
}

.ai-animation-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.ai-animation-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}

.ai-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.difficulty-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.word-tag {
  transition: transform 0.2s;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.word-tag:hover {
  transform: scale(1.05);
}

.ai-difficulty-analysis {
  margin-top: 16px;
  padding: 16px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  border-left: 4px solid #7e57c2;
  position: relative;
}

.ai-analysis-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #7e57c2;
  font-weight: 500;
}

.ai-analysis-header i {
  font-size: 16px;
}

.learning-path {
  margin: 16px 0;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 16px;
}

.ai-learning-tip {
  margin-top: 16px;
  position: relative;
}

.ai-chip {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #7e57c2, #2196f3);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 8px;
  gap: 6px;
}

.learning-path-tip {
  margin-top: 8px;
  font-style: italic;
  color: var(--el-text-color-secondary);
  padding: 12px;
  background: rgba(126,87,194,0.1);
  border-radius: 8px;
  position: relative;
}

.ai-chat {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-message {
  display: flex;
  gap: 12px;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7e57c2, #2196f3);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(126,87,194,0.4);
  position: relative;
}

.ai-avatar-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: transparent;
  border: 2px solid rgba(126,87,194,0.4);
  animation: avatar-pulse 2s infinite;
}

@keyframes avatar-pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}

.message-content {
  background: rgba(255,255,255,0.15);
  padding: 12px 16px;
  border-radius: 18px;
  border-top-left-radius: 4px;
  max-width: calc(100% - 60px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: relative;
}

.message-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(126,87,194,0.05), transparent);
  border-radius: 18px;
  border-top-left-radius: 4px;
  pointer-events: none;
}

.user-input {
  display: flex;
  gap: 10px;
  margin-top: 16px;
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
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(126, 87, 194, 0.2);
}

:deep(.el-input__inner) {
  color: var(--el-text-color-primary);
}

:deep(.el-input__inner::placeholder) {
  color: var(--el-text-color-secondary);
}

/* 黑暗模式适配 */
:root[data-theme='dark'] .ai-feature-card {
  background: rgba(126, 87, 194, 0.15);
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme='dark'] .ai-feature-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme='dark'] .ai-difficulty-analysis,
:root[data-theme='dark'] .ai-learning-path-section {
  background: rgba(126, 87, 194, 0.1);
}

:root[data-theme='dark'] .ai-feature-graph {
  background: rgba(126, 87, 194, 0.05);
}
</style> 