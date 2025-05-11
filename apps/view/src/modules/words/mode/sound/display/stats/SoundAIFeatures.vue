<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElButton, ElInput, ElStep, ElSteps, ElTag } from 'element-plus';

const props = defineProps<{
  analysis: Record<string, any>;
  soundData: Record<string, any>;
}>();

// 学习进度状态
const learningPath = [
  { title: '听音识别', description: '培养基础听力' },
  { title: '听写能力', description: '掌握拼写规则' },
  { title: '例句理解', description: '提升语境理解' },
  { title: '语音交互', description: '实际对话能力' },
  { title: '自然反应', description: '无障碍沟通' },
];

// 根据正确率和反应时间计算当前进度阶段
const learningPathStep = computed(() => {
  const dictationRate = props.analysis.dictationCorrectRate || 0;
  const exampleRate = props.analysis.exampleCorrectRate || 0;
  const avgRate = (dictationRate + exampleRate) / 2;

  if (avgRate < 0.5) {
    return 0;
  }
  if (avgRate < 0.7) {
    return 1;
  }
  if (avgRate < 0.85) {
    return 2;
  }
  if (avgRate < 0.95) {
    return 3;
  }
  return 4;
});

// 获取学习难点词汇
const difficultWords = computed(() => {
  const wordDetails = props.soundData.wordsDetails || [];
  return wordDetails
    .filter(word => (word.attempts > 1 || word.timeSpent > 8000) && !word.isCorrect)
    .sort((a, b) => (b.attempts || 0) - (a.attempts || 0))
    .slice(0, 5);
});

// 用户交互相关
const userQuestion = ref('');
const aiMessage = ref('你好！我是你的AI听力助手。你想了解什么关于你的听力学习数据？');

// AI洞察与建议方法
function getAiInsight() {
  if (!props.analysis.dictationCorrectRate) return '完成更多练习后，AI将为你提供个性化学习洞察。';

  // 根据不同的学习数据提供不同的洞察
  const dictationRate = props.analysis.dictationCorrectRate;
  const exampleRate = props.analysis.exampleCorrectRate;
  const avgDictationTime = props.analysis.avgDictationTimePerWord;

  if (dictationRate < 0.6) {
    return '听写正确率偏低，建议首先专注于单词发音的准确识别，可以尝试单独训练常见音素和音节。';
  }

  if (exampleRate < 0.6) {
    return '例句识别能力有待提高，建议通过频繁听取相似语境下的例句，培养语境理解能力。';
  }

  if (avgDictationTime > 8000) {
    return '单词听写反应时间较长，说明你可能需要加强音形关联的快速反应训练。';
  }

  return '你的学习数据显示听力能力处于稳步提升阶段，继续保持当前的学习方法和频率。';
}

// 学习路径提示
function getLearningPathTip() {
  const tips = [
    '专注基础听力训练，尝试区分相似发音，提高声音识别准确度。',
    '巩固听写能力，注意拼写规则与发音的对应关系，缩短反应时间。',
    '加强例句练习，关注上下文语境，提升整体理解能力。',
    '尝试真实对话练习，锻炼听力与表达的协调能力。',
    '恭喜达到高级水平！建议尝试多种口音和语速的听力材料，挑战自我。'
  ];

  return tips[learningPathStep.value];
}

// 得到难点单词的标签类型
function getTagType(attempts) {
  if (!attempts) return 'info';
  if (attempts >= 3) return 'danger';
  if (attempts >= 2) return 'warning';
  return 'info';
}

// AI问答互动
function askAI() {
  if (!userQuestion.value) return;

  // 根据用户提问生成相应的回答
  // 实际应用中这里应该调用后端API获取AI回复
  const dictationRate = props.analysis.dictationCorrectRate || 0;
  const exampleRate = props.analysis.exampleCorrectRate || 0;
  const avgDictTime = props.analysis.avgDictationTimePerWord || 0;

  const responses = [
    '你的听写正确率为' + (dictationRate * 100).toFixed(1) + '%，例句正确率为' + (exampleRate * 100).toFixed(1) + '%。根据数据分析，建议加强' + (dictationRate < exampleRate ? '听写' : '例句') + '练习。',
    '你的平均听写反应时间为' + (avgDictTime / 1000).toFixed(1) + '秒。对于听力学习，建议将反应时间控制在5秒以内，可以通过增加练习频率来提高反应速度。',
    '分析显示你的学习模式比较稳定，建议每天固定时间进行15-20分钟的集中听力训练，效果会更好。',
    'AI建议你尝试"影子跟读"技巧 - 听到单词或句子后立即跟读，这有助于加强听觉记忆和发音准确性。',
    '根据你的学习数据，建议增加听力输入量，每天听取3-5分钟的英语音频（如新闻、对话等），不求完全理解，培养语感。'
  ];

  aiMessage.value = responses[Math.floor(Math.random() * responses.length)];
  userQuestion.value = '';
}
</script>

<template>
  <div class="sound-ai-features">
    <h3 class="section-title"><span class="ai-badge">AI</span> 听力学习特色功能</h3>

    <!-- AI洞察卡片 -->
    <div class="feature-card primary-card">
      <div class="feature-header">
        <div class="icon-wrapper">
          <div class="i-carbon-ai-status" />
        </div>
        <h4>AI智能洞察</h4>
      </div>
      <div class="feature-content">
        <p>{{ getAiInsight() }}</p>
      </div>
    </div>

    <!-- 学习路径卡片 -->
    <div class="feature-card">
      <div class="feature-header">
        <div class="icon-wrapper">
          <div class="i-carbon-road" />
        </div>
        <h4>听力学习路径</h4>
      </div>
      <div class="feature-content">
        <ElSteps :active="learningPathStep" finish-status="success" simple direction="vertical" :space="40">
          <ElStep v-for="(step, index) in learningPath" :key="index" :title="step.title" :description="step.description"></ElStep>
        </ElSteps>
        <div class="path-tip">
          <div class="icon-wrapper sm">
            <div class="i-carbon-idea" />
          </div>
          <p>{{ getLearningPathTip() }}</p>
        </div>
      </div>
    </div>

    <!-- 难点词汇卡片 -->
    <div class="feature-card">
      <div class="feature-header">
        <div class="icon-wrapper">
          <div class="i-carbon-warning-alt" />
        </div>
        <h4>听力难点单词</h4>
      </div>
      <div class="feature-content">
        <div v-if="difficultWords.length > 0" class="difficult-words">
          <ElTag
            v-for="word in difficultWords"
            :key="word.word"
            :type="getTagType(word.attempts)"
            effect="light"
            class="word-tag"
          >
            {{ word.word }}
            <small v-if="word.attempts">({{ word.attempts }}次)</small>
          </ElTag>

          <div class="difficulty-tip">
            <p>这些单词是你听力学习中的难点，建议多听多练，注意音标和发音规则。</p>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>暂未发现明显的听力难点词汇，继续保持！</p>
        </div>
      </div>
    </div>

    <!-- AI互动卡片 -->
    <div class="feature-card">
      <div class="feature-header">
        <div class="icon-wrapper">
          <div class="i-carbon-chat" />
        </div>
        <h4>听力助手问答</h4>
      </div>
      <div class="feature-content">
        <div class="ai-chat">
          <div class="ai-message">{{ aiMessage }}</div>
          <div class="user-input">
            <ElInput
              v-model="userQuestion"
              placeholder="询问AI关于你的听力学习情况..."
              @keyup.enter="askAI"
              clearable
            >
            </ElInput>
            <ElButton type="primary" @click="askAI" :disabled="!userQuestion" round>
              发送
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sound-ai-features {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary, #2c3e50);
  margin-bottom: 12px;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border-subtle, #e5e7eb);
}

.ai-badge {
  background: linear-gradient(45deg, #7e57c2, #2196f3);
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm, 0 6px 12px rgba(0, 0, 0, 0.08));
  border-color: rgba(126, 87, 194, 0.15);
}

.primary-card {
  background-color: rgba(126, 87, 194, 0.08);
}

.feature-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.icon-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(126, 87, 194, 0.8);
  border-radius: 8px;
  color: white;
}

.icon-wrapper.sm {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: rgba(126, 87, 194, 0.6);
}

.feature-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary, #2c3e50);
}

.feature-content {
  font-size: 0.95rem;
  color: var(--color-text-secondary, #555e6d);
  line-height: 1.6;
}

/* 学习路径样式 */
:deep(.el-step__title) {
  font-size: 0.95rem;
  font-weight: 600;
}

:deep(.el-step__description) {
  font-size: 0.8rem;
}

.path-tip {
  margin-top: 16px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background-color: rgba(126, 87, 194, 0.05);
  padding: 12px;
  border-radius: 8px;
}

.path-tip p {
  margin: 0;
  font-size: 0.9rem;
}

/* 难点词汇样式 */
.difficult-words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.word-tag {
  padding: 8px 12px;
  font-size: 0.9rem;
}

.word-tag small {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-left: 4px;
}

.difficulty-tip {
  margin-top: 12px;
  font-size: 0.85rem;
  color: var(--color-text-secondary, #555e6d);
  font-style: italic;
}

.empty-state {
  text-align: center;
  color: var(--color-text-secondary, #555e6d);
  font-style: italic;
  padding: 20px 0;
}

/* AI聊天样式 */
.ai-chat {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-message {
  background-color: rgba(126, 87, 194, 0.05);
  padding: 12px 16px;
  border-radius: 12px;
  border-top-left-radius: 4px;
  position: relative;
  font-size: 0.9rem;
  line-height: 1.5;
}

.user-input {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .sound-ai-features {
    padding: 16px;
    gap: 16px;
  }

  .feature-card {
    padding: 16px;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .feature-header h4 {
    font-size: 1rem;
  }

  .word-tag {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
}
</style>
