<script setup lang="ts">
import WordsCET from './CET4_edited.txt?raw'
import LineSelect from './LineSelect.vue';
const animateAward = inject('animateAward')!

const props = defineProps<{
  modelValue?: boolean,
  display: boolean
}>()

// 解析这个wordsCET文件 随机抽取4行
const words = WordsCET.split('\n').filter(Boolean)
// 随机抽取4行
const randomWords = words.sort(() => Math.random() - 0.5).filter(item => item.indexOf('[') !== -1).slice(0, 4)

// 每一行单词是 单词 [音标] 词性意思
// 比如 man [man] n.男人；人；人类
// 按照以上格式划分为json格式
const wordList = randomWords.map(word => {
  // regex
  const regex = /(.*)\s+\[(.*)\]\s+(.*)/
  const match = word.match(regex)
  if (match?.length !== 4) {
    console.error('Invalid word format:', word)
    throw new Error('Invalid word format')
  }
  return {
    word: match![1],
    phonetic: match![2],
    partOfSpeech: match![3]
  }
})

// // 将单词组成问题
// // 随机两种问题
// // 比如 xxx是不是有xx意思
// // 比如 xx意思是不是单词xxx
// const questionList = wordList.flatMap(word => {
//   // 先删除 partOfSpeech 中的磁性，然后随机抽一个意思
//   const meaning = word.partOfSpeech.replace(/n\./g, '').split(';')[Math.floor(Math.random() * word.partOfSpeech.split(';').length)]

//   // 随机选择一个问题返回
//   return [{
//     question: `${word.word}是不是有${meaning}意思？`,
//     answer: word.word
//   },
//   {
//     question: `${meaning}意思是不是单词${word.word}？`,
//     answer: meaning
//   }].sort(() => Math.random() - 0.5)[0]
// })

// 从 4 个单词中抽取一个正确单词
const correct = wordList[Math.floor(Math.random() * wordList.length)]
// 其余 3 个单词的意思作为选项
const options = wordList.sort(() => Math.random() - 0.5)

console.log('w', correct, options)

const selection = ref('')

defineExpose({
  handleClick: () => {
    return selection.value === correct.partOfSpeech
  }
})
</script>

<template>
  <div class="AwardInner">
    <div :class="{ display }" class="Mention">
      <p class="Title">嗯呢</p>
      <p>{{ correct.word }}的意思是</p>
      <p> {{ correct.partOfSpeech }}</p>
    </div>
    <p class="Title">{{ correct.word }} 的意思是？</p>
    <LineSelect v-model="selection" :name="item.partOfSpeech" v-for="item in options">
      {{ item.partOfSpeech }}
    </LineSelect>
  </div>
</template>

<style>
.Mention.display {
  opacity: 1;
  pointer-events: all;
}

.Mention {
  z-index: 100;
  position: absolute;
  padding: 1rem 2rem;
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  top: 10%;
  left: 10%;

  width: 80%;
  height: 80%;

  opacity: 0;
  color: #000;
  transition: .25s;
  border-radius: 8px;
  pointer-events: none;
  background-color: #eeeeeeEF;
}
</style>
