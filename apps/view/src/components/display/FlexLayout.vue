<script lang='ts' setup generic="T extends { id: number | string }">
interface Props {
  data: T[]
  columnCount?: number
  loadMoreMargin?: string
  renderItem?: (item: T) => any
}

const props = defineProps<Props>()
//     {{ days }}
//   columnCount: 4,
//   loadMoreMargin: '0px 0px 300px 0px',
// }

const emit = defineEmits<{
  loadMore: []
}>()
const allColumnData = reactive<T[][]>(Array.from({ length: props.columnCount }, () => []))

// Initialize first row of data
for (let i = 0; i < Math.min(props.data.length, props.columnCount); i++) {
  allColumnData[i].push(props.data[i])
}

let dataIndex = props.columnCount

// Observer for infinite loading
const observerObj = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const { target, isIntersecting } = entry
      if (isIntersecting) {
        addItem()
        observerObj.unobserve(target)
      }
    }
  },
  {
    rootMargin: props.loadMoreMargin,
  },
)

function addItem() {
  if (dataIndex >= props.data.length) {
    emit('loadMore')
    return
  }

  const columnArray: NodeListOf<HTMLElement> = document.querySelectorAll('.flex-column')
  const eleHeight = Array.from(columnArray).map(col => col.offsetHeight)

  // Find column with minimum height
  const minHeight = Math.min(...eleHeight)
  const minHeightIndex = eleHeight.indexOf(minHeight)

  // Add next item to shortest column
  allColumnData[minHeightIndex].push(props.data[dataIndex++])

  // Observe new element after render
  nextTick(() => {
    const columns = document.querySelectorAll('.flex-column')[minHeightIndex].querySelectorAll('.flex-column-ele')
    observerObj.observe(columns[columns.length - 1])
  })
}

// Watch data changes
watch(() => props.data, (newData: T[]) => {
  if (newData.length > props.data.length) {
    addItem()
  }
}, { deep: true })

onMounted(() => {
  addItem()
})
</script>

<template>
  <div class="FlexLayout">
    <div
      v-for="(column, colIndex) in allColumnData"
      :key="colIndex"
      class="flex-column"
      :style="{ width: `${100 / props.columnCount}%` }"
    >
      <div
        v-for="item in column"
        :key="item.id"
        class="flex-column-ele"
      >
        <slot
          name="item"
          :item="item"
        >
          <!-- Default slot content -->
          <slot name="default" :item="item">
            {{ item }}
          </slot>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.FlexLayout {
  display: flex;
  width: 100%;
  gap: 16px;
  align-items: stretch;
}

.flex-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 8px;
}

.flex-column-ele {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.flex-column-ele :deep(*) {
  flex: 1;
  width: 100%;
}
</style>
