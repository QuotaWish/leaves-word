<!-- 这是从ComprehensiveStat.vue移动过来的 -->
<template>
  <!-- 使用拆分后的组件 -->
  <stats :data="data" />
</template>

<script setup lang="ts">
import { Statistics } from '~/modules/words/core/word';
import Stats from './stats/index.vue'

defineProps<{
  data: Statistics<any>
}>()
</script> 