<!-- 圆形搜索框组件 -->
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'

defineProps<{
  placeholder: string
}>()

const emit = defineEmits(['search'])

const searchText = ref('')
const isLoading = ref(false)
const isFocused = ref(false)
const isComposing = ref(false)

async function handleSearch() {
  if (isLoading.value || isComposing.value || !searchText.value.trim())
    return

  isLoading.value = true
  try {
    await emit('search', searchText.value)
  }
  finally {
    isLoading.value = false
  }
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
}

function handleClear() {
  searchText.value = ''
  emit('search', '')
}
</script>

<template>
  <div class="search-bar-container" :class="{ 'is-focused': isFocused }">
    <el-input
      v-model="searchText" :placeholder="placeholder || '搜索'" class="search-input"
      :class="{ 'is-composing': isComposing }" clearable @focus="handleFocus" @blur="handleBlur"
      @compositionstart="isComposing = true" @compositionend="isComposing = false" @clear="handleClear"
      @keyup.enter="handleSearch"
    >
      <template #prefix>
        <el-icon>
          <Search />
        </el-icon>
      </template>
      <template #suffix>
        <el-button class="search-button" type="primary" :loading="isLoading" @click="handleSearch">
          搜索
        </el-button>
      </template>
    </el-input>
  </div>
</template>

<style scoped>
.search-bar-container {
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
}

.search-bar-container.is-focused {
  transform: scale(1.01);
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 25px;
  padding-right: 8px;
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__inner) {
  height: 40px;
  font-size: 14px;
}

.search-bar-container :deep(.el-input) {
  --el-input-bg-color: var(--el-fill-color);
}

.search-button {
  position: relative;

  left: 4px;
  height: 36px;
  width: 72px;
  padding: 8px;
  font-size: 16px;

  border-radius: 25px;
}

.search-input :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
}

/* 输入法状态样式 */
.search-input.is-composing :deep(.el-input__wrapper) {
  background-color: var(--el-fill-color-light);
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .search-bar-container {
    max-width: 100%;
  }

  .search-input :deep(.el-input__inner) {
    height: 36px;
    font-size: 14px;
  }

  .search-button {
    height: 32px;
    padding: 6px;
  }
}
</style>
