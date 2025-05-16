<script setup lang="ts">
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

const route = useRoute()
const selectedArticle = computed(() => articles.find((item) => +item.id === +route.query.article))

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

function getArticleVocabulary(article: Article): Vocabulary[] {
  return vocabList.filter(word => article.vocabulary.includes(word.id))
}
</script>

<template>
  <PageNavHolder immersive head-color="#fff" nav-color="#BF1414" title="文章详情">
    <div v-if="selectedArticle" class="RedTyphoonPage-ArticleDetail">
      <div class="RedTyphoonPage-ArticleHeader">
        <img :src="selectedArticle.imageUrl" alt="Article header" class="RedTyphoonPage-ArticleHeaderImage">
        <div class="RedTyphoonPage-ArticleOverlay"></div>
        <h2 class="RedTyphoonPage-ArticleTitle">
          {{ selectedArticle.title }}
        </h2>
        <p class="RedTyphoonPage-ArticleAuthorDetail">
          By {{ selectedArticle.author }}
        </p>
      </div>

      <div class="RedTyphoonPage-ArticleBody">
        <div class="RedTyphoonPage-VocabHighlight">
          <div class="i-carbon-dictionary"></div>
          <span>重点词汇</span>
          <div class="RedTyphoonPage-VocabTags">
            <div v-for="word in getArticleVocabulary(selectedArticle)" :key="word.id" class="RedTyphoonPage-VocabTag">
              <span>{{ word.english }}</span>
              <span>{{ word.chinese }}</span>
            </div>
          </div>
        </div>

        <p v-for="(paragraph, index) in selectedArticle.content.split('\n\n')" :key="index"
          class="RedTyphoonPage-Paragraph">
          {{ paragraph }}
        </p>

        <div class="RedTyphoonPage-ArticleActions">
          <ElButton class="RedTyphoonPage-ArticleButton">
            <div class="i-carbon-volume-up"></div>
            朗读文章
          </ElButton>
          <ElButton class="RedTyphoonPage-ArticleButton">
            <div class="i-carbon-document-export"></div>
            导出笔记
          </ElButton>
          <ElButton type="primary" class="RedTyphoonPage-ArticleButton">
            <div class="i-carbon-translate"></div>
            翻译练习
          </ElButton>
        </div>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.RedTyphoonPage {


  &-ArticleHeader {
    position: relative;
    height: 250px;

    &Image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-ArticleOverlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
  }

  &-ArticleTitle {
    position: absolute;
    bottom: 50px;
    left: 1.5rem;
    right: 1.5rem;
    color: white;
    font-size: 1.75rem;
    font-weight: 600;
  }

  &-ArticleAuthorDetail {
    position: absolute;
    bottom: 20px;
    left: 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
  }

  &-ArticleBody {
    flex: 1;
    padding: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }





  &-Paragraph {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--el-text-color-primary);
    margin-bottom: 1.5rem;
  }

  &-ArticleActions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  &-ArticleButton {
    display: flex;
    align-items: center;

    [class^='i-'] {
      margin-right: 0.5rem;
    }
  }
}
</style>