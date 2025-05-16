<script setup lang="ts">
import { ElButton, ElCard, ElDialog, ElDivider, ElInput, ElSkeleton } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import 'element-plus/theme-chalk/el-card.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-divider.css'
import 'element-plus/theme-chalk/el-skeleton.css'
import 'element-plus/theme-chalk/el-dialog.css'

defineOptions({
  name: 'RedTyphoonPage',
})

interface Vocabulary {
  id: number
  english: string
  chinese: string
  sentence: string
  category: string
}

interface Article {
  id: number
  title: string
  author: string
  content: string
  vocabulary: number[]
  imageUrl: string
}

const router = useRouter()
const activeTab = ref('study')
const searchQuery = ref('')
const isGenerating = ref(false)
const selectedArticle = ref<Article | null>(null)
const aiResponse = ref('')
const userPrompt = ref('')

const categories = [
  { id: 'history', name: '历史事件', icon: 'i-carbon-document' },
  { id: 'figures', name: '革命人物', icon: 'i-carbon-user-profile' },
  { id: 'spirit', name: '红色精神', icon: 'i-carbon-idea' },
  { id: 'places', name: '革命圣地', icon: 'i-carbon-location' },
]

const vocabList = reactive<Vocabulary[]>([
  {
    id: 1,
    english: 'revolution',
    chinese: '革命',
    sentence: 'The revolution changed the course of Chinese history.',
    category: 'history',
  },
  {
    id: 2,
    english: 'solidarity',
    chinese: '团结',
    sentence: 'The solidarity of the workers was their greatest strength.',
    category: 'spirit',
  },
  {
    id: 3,
    english: 'perseverance',
    chinese: '毅力',
    sentence: 'Their perseverance during the Long March is legendary.',
    category: 'spirit',
  },
  {
    id: 4,
    english: 'struggle',
    chinese: '斗争',
    sentence: 'The struggle for independence lasted many years.',
    category: 'history',
  },
  {
    id: 5,
    english: 'liberation',
    chinese: '解放',
    sentence: 'The liberation of China was achieved in 1949.',
    category: 'history',
  },
  {
    id: 6,
    english: 'comrade',
    chinese: '同志',
    sentence: 'The comrades worked together to achieve their goals.',
    category: 'figures',
  },
  {
    id: 7,
    english: 'historical materialism',
    chinese: '历史唯物主义',
    sentence: 'Historical materialism is a methodological approach to history and society.',
    category: 'spirit',
  },
  {
    id: 8,
    english: 'revolutionary base',
    chinese: '革命根据地',
    sentence: 'Yan\'an served as a revolutionary base during the war.',
    category: 'places',
  },
])

const articles = reactive<Article[]>([
  {
    id: 1,
    title: 'The Long March: A Testament to Perseverance',
    author: 'Historical Committee',
    content: `The Long March was a military retreat undertaken by the Red Army of the Communist Party of China, the forerunner of the People's Liberation Army, to evade the pursuit of the Kuomintang (KMT or Chinese Nationalist Party) army. The Long March took place from October 1934 to October 1935.

Although the retreat was originally intended to link up with forces in Shaanxi province, the harsh conditions, constant attacks from enemies, and internal political struggles made the journey extremely difficult. The Long March covered approximately 9,000 kilometers over some of China's most difficult terrain.

The determination and perseverance shown by the participants of the Long March have made it a central event in Chinese Communist history. It consolidated Mao Zedong's leadership position and the experience became a source of inspiration for the Chinese people.`,
    vocabulary: [3, 1, 4],
    imageUrl: 'https://img2.quotawish.com/2025/03/07/67c9e5a3f06a5.jpg',
  },
  {
    id: 2,
    title: 'Yan\'an: The Cradle of Chinese Revolution',
    author: 'Cultural Research Group',
    content: `Yan'an, a city in Shaanxi province, served as the headquarters of the Chinese Communist Party from 1935 to 1947. After completing the Long March, the Communist forces established their base in this remote area.

During this period, Yan'an became the center for revolutionary education and culture. The Communist Party implemented various reforms and policies, which later became the blueprint for governing China after 1949.

The Yan'an spirit, characterized by self-reliance, hard work, and serving the people, continues to be an important part of Chinese revolutionary heritage. Today, Yan'an is a popular revolutionary tourism destination, where visitors can learn about this crucial period in Chinese history.`,
    vocabulary: [1, 8, 2],
    imageUrl: 'https://img2.quotawish.com/2025/03/07/67c9e5a49e5cc.jpg',
  },
])

const filteredVocab = computed(() => {
  if (!searchQuery.value)
    return vocabList
  const query = searchQuery.value.toLowerCase()
  return vocabList.filter(
    word => word.english.toLowerCase().includes(query) ||
      word.chinese.includes(query),
  )
})

const categorizedVocab = computed(() => {
  const result: Record<string, Vocabulary[]> = {}
  for (const cat of categories) {
    result[cat.id] = filteredVocab.value.filter(word => word.category === cat.id)
  }
  return result
})

function setTab(tab: string): void {
  activeTab.value = tab
}

function getArticleVocabulary(article: Article): Vocabulary[] {
  return vocabList.filter(word => article.vocabulary.includes(word.id))
}

function showArticle(article: Article): void {
  selectedArticle.value = article

  router.push({
    path: '/explore/revolution/article',
    query: {
      article: article.id
    }
  })
}

function generateAiResponse(): void {
  if (!userPrompt.value.trim())
    return

  isGenerating.value = true
  aiResponse.value = ''

  // 模拟AI生成响应
  setTimeout(() => {
    isGenerating.value = false

    // 模拟的AI回复
    aiResponse.value = `Based on your question about "${userPrompt.value}", here's what I can tell you:

The Chinese revolution was characterized by its focus on peasant mobilization, which was different from the industrial worker focus of many European revolutions. This approach was adapted to China's specific conditions, where the vast majority of the population lived in rural areas.

Revolutionary bases like Yan'an were crucial for developing both military strategy and political theory. These "liberated areas" served as laboratories for Communist policies before nationwide implementation.

I recommend exploring the concept of "Mass Line" - the political and organizational method developed by the CPC to maintain ties with the population. This principle of "from the masses, to the masses" became a cornerstone of Chinese revolutionary thought.

Would you like to know more about any specific aspect of Chinese revolutionary history?`
  }, 2000)
}
</script>

<template>
  <div class="RedTyphoonPage">
    <div class="RedTyphoonPage-Banner">
      <h1>红色革命</h1>
      <h2>Revolution in English</h2>
    </div>

    <div class="RedTyphoonPage-Tabs">
      <div
        v-for="tab in [
          { id: 'study', name: '学习', icon: 'i-carbon-book' },
          { id: 'readings', name: '文章', icon: 'i-carbon-document' },
          { id: 'ai', name: 'AI 导师', icon: 'i-carbon-machine-learning-model' },
        ]"
        :key="tab.id"
        class="RedTyphoonPage-Tab"
        :class="{ active: activeTab === tab.id }"
        @click="setTab(tab.id)"
      >
        <div :class="tab.icon"></div>
        <span>{{ tab.name }}</span>
      </div>
    </div>

    <!-- 词汇学习部分 -->
    <div v-if="activeTab === 'study'" class="RedTyphoonPage-Study">
      <div class="RedTyphoonPage-Search">
        <ElInput
          v-model="searchQuery"
          placeholder="搜索红色词汇..."
          clearable
          prefix-icon="i-carbon-search"
        />
      </div>

      <div v-for="category in categories" :key="category.id" class="RedTyphoonPage-Category">
        <div v-if="categorizedVocab[category.id]?.length" class="RedTyphoonPage-CategoryHeader">
          <div :class="category.icon"></div>
          <h3>{{ category.name }}</h3>
        </div>

        <div class="RedTyphoonPage-Words">
          <ElCard
            v-for="word in categorizedVocab[category.id]"
            :key="word.id"
            class="RedTyphoonPage-Word"
            shadow="hover"
          >
            <div class="RedTyphoonPage-WordHeader">
              <h4>{{ word.english }}</h4>
              <span class="RedTyphoonPage-WordChinese">{{ word.chinese }}</span>
            </div>
            <p class="RedTyphoonPage-WordSentence">
              {{ word.sentence }}
            </p>
            <div class="RedTyphoonPage-WordActions">
              <ElButton type="text" size="small" class="RedTyphoonPage-VoiceButton">
                <div class="i-carbon-volume-up"></div>
              </ElButton>
            </div>
          </ElCard>
        </div>
      </div>
    </div>

    <!-- 红色文章部分 -->
    <div v-else-if="activeTab === 'readings'" class="RedTyphoonPage-Readings">
      <ElCard
        v-for="article in articles"
        :key="article.id"
        class="RedTyphoonPage-Article"
        shadow="hover"
        @click="showArticle(article)"
      >
        <div class="RedTyphoonPage-ArticleContent">
          <h3>{{ article.title }}</h3>
          <p class="RedTyphoonPage-ArticleAuthor">
            By {{ article.author }}
          </p>
          <p class="RedTyphoonPage-ArticleExcerpt">
            {{ article.content.slice(0, 150) }}...
          </p>

          <div class="RedTyphoonPage-ArticleVocab">
            <div class="i-carbon-dictionary"></div>
            <div
              v-for="word in getArticleVocabulary(article)"
              :key="word.id"
              class="RedTyphoonPage-ArticleVocabTag"
            >
              {{ word.english }}
            </div>
          </div>
        </div>
        <div class="RedTyphoonPage-ArticleImage">
          <img :src="article.imageUrl" alt="Article illustration">
        </div>
      </ElCard>
    </div>

    <!-- AI导师部分 -->
    <div v-else-if="activeTab === 'ai'" class="RedTyphoonPage-AI">
      <ElCard class="RedTyphoonPage-AICard" shadow="never">
        <div class="RedTyphoonPage-AIHeader">
          <div class="i-carbon-machine-learning-model RedTyphoonPage-AIIcon"></div>
          <h3>红色旋风 AI 导师</h3>
        </div>

        <p class="RedTyphoonPage-AIDescription">
          向AI提问有关中国革命史、革命词汇或者相关英语表达的问题，获取即时解答和学习指导。
        </p>

        <ElDivider></ElDivider>

        <div class="RedTyphoonPage-AIChat">
          <div class="RedTyphoonPage-AIResponse">
            <ElSkeleton v-if="isGenerating" :rows="6" animated />
            <template v-else>
              <div v-if="aiResponse" v-html="aiResponse.replace(/\n/g, '<br>')"></div>
              <div v-else class="RedTyphoonPage-AIPlaceholder">
                <div class="i-carbon-chat RedTyphoonPage-AIPlaceholderIcon"></div>
                <p>向AI导师提问，探索中国革命的英语表达</p>
                <div class="RedTyphoonPage-AISuggestions">
                  <div class="RedTyphoonPage-AISuggestion" @click="userPrompt = 'What were the major differences between the Chinese Revolution and other communist revolutions?'">
                    中国革命与其他共产主义革命的主要区别是什么？
                  </div>
                  <div class="RedTyphoonPage-AISuggestion" @click="userPrompt = 'Explain the significance of Yan\'an in revolutionary history.'">
                    延安在革命历史中的重要性
                  </div>
                  <div class="RedTyphoonPage-AISuggestion" @click="userPrompt = 'How can I use revolutionary terms in English conversation appropriately?'">
                    如何在英语对话中恰当使用革命术语？
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="RedTyphoonPage-AIInput">
            <ElInput
              v-model="userPrompt"
              type="textarea"
              :rows="3"
              placeholder="输入您的问题..."
              resize="none"
            />
            <ElButton
              type="primary"
              class="RedTyphoonPage-AIButton"
              :loading="isGenerating"
              :disabled="!userPrompt.trim()"
              @click="generateAiResponse"
            >
              <div class="i-carbon-send"></div>
              发送
            </ElButton>
          </div>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.RedTyphoonPage {
  &-Banner {
    background: linear-gradient(135deg, #d50000, #b71c1c);
    color: white;
    padding: 2rem 1.5rem;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    text-align: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('https://img2.quotawish.com/2025/03/07/67c9e5a3c9afd.png');
      background-size: 180px;
      background-repeat: no-repeat;
      background-position: right bottom;
      opacity: 0.2;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 400;
      opacity: 0.9;
    }
  }

  &-Tabs {
    z-index: 10;
    position: sticky;
    display: flex;

    top: 0;

    margin-bottom: 1.5rem;
    background-color: var(--el-fill-color-light);
    overflow: hidden;
  }

  &-Tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0;
    cursor: pointer;
    transition: all 0.3s ease;

    [class^='i-'] {
      font-size: 1.5rem;
      margin-bottom: 0.25rem;
    }

    span {
      font-size: 0.875rem;
    }

    &.active {
      background-color: #d32f2f;
      color: white;
    }
  }

  &-Search {
    margin-bottom: 1.5rem;
  }

  &-Category {
    margin-bottom: 1.5rem;

    &Header {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;

      [class^='i-'] {
        font-size: 1.25rem;
        margin-right: 0.5rem;
        color: #d32f2f;
      }

      h3 {
        font-size: 1.125rem;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }
  }

  &-Words {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  &-Word {
    border-radius: 8px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-3px);
    }

    &Header {
      display: flex;
      align-items: baseline;
      margin-bottom: 0.5rem;

      h4 {
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin-right: 0.5rem;
      }
    }

    &Chinese {
      font-size: 0.9rem;
      color: #d32f2f;
    }

    &Sentence {
      color: var(--el-text-color-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }

    &Actions {
      display: flex;
      justify-content: flex-end;
    }
  }

  &-VoiceButton {
    [class^='i-'] {
      font-size: 1.1rem;
      color: var(--el-color-primary);
    }
  }

  &-Readings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &-AI {
    &Card {
      border-radius: 12px;
    }

    &Header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        font-size: 1.25rem;
        font-weight: 500;
      }
    }

    &Icon {
      font-size: 1.5rem;
      margin-right: 0.75rem;
      color: #d32f2f;
    }

    &Description {
      font-size: 0.875rem;
      color: var(--el-text-color-secondary);
      line-height: 1.5;
    }

    &Chat {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &Response {
      background-color: var(--el-fill-color-light);
      border-radius: 12px;
      padding: 1.5rem;
      min-height: 200px;
      line-height: 1.6;
      font-size: 0.9375rem;
    }

    &Placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      color: var(--el-text-color-secondary);

      p {
        margin: 1rem 0;
      }
    }

    &PlaceholderIcon {
      font-size: 2.5rem;
      opacity: 0.5;
    }

    &Suggestions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      max-width: 500px;
    }

    &Suggestion {
      background-color: white;
      border: 1px solid var(--el-border-color);
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      text-align: left;
      transition: all 0.2s;

      &:hover {
        border-color: #d32f2f;
        background-color: rgba(211, 47, 47, 0.05);
      }
    }

    &Input {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &Button {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #d32f2f;
      border-color: #d32f2f;

      [class^='i-'] {
        margin-right: 0.5rem;
      }

      &:hover,
      &:focus {
        background-color: #b71c1c;
        border-color: #b71c1c;
      }
    }
  }

  &-VocabHighlight {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background-color: rgba(211, 47, 47, 0.1);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;

    [class^='i-'] {
      color: #d32f2f;
      font-size: 1.25rem;
      margin-right: 0.5rem;
    }

    span {
      font-weight: 500;
      color: #d32f2f;
    }
  }

  &-Article {
    display: flex;
    cursor: pointer;
    border-radius: 18px;

    &Content {
      flex: 1;
      padding-right: 1rem;

      h3 {
        font-size: 1.1rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--el-text-color-primary);
      }
    }

    &Author {
      font-size: 0.875rem;
      color: var(--el-text-color-secondary);
      margin-bottom: 0.75rem;
    }

    &Excerpt {
      font-size: 0.875rem;
      color: var(--el-text-color-secondary);
      line-height: 1.5;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    &Image {
      width: 120px;
      height: 120px;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &Vocab {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;

      [class^='i-'] {
        color: #d32f2f;
        font-size: 1rem;
      }
    }

    &VocabTag {
      font-size: 0.75rem;
      color: var(--el-text-color-regular);
      background-color: var(--el-fill-color-light);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
  }

  &-VocabTags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-left: 1rem;
    flex: 1;
  }

  &-VocabTag {
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid rgba(211, 47, 47, 0.3);
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    font-size: 0.875rem;

    span {
      &:first-child {
        color: var(--el-text-color-primary);
        font-weight: 500;
        margin-right: 0.25rem;
      }

      &:last-child {
        color: #d32f2f;
        font-size: 0.75rem;
      }
    }
  }

  
}
</style>
