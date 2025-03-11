export interface DraggableOptions<T> {
  /**
   * 当加载更多数据的时候
   */
  onLoadMore: () => Promise<T[]>
  /**
   * 当切换到的时候
   */
  onSwitch?: (direction: 'next' | 'prev', item: T) => void
  /**
   * 当触发下拉刷新的时候
   */
  onRefresh?: () => Promise<void>
  /**
   * 渲染卡片的组件
   */
  renderCard: (item: T) => VNode
}

import { h, ref, reactive, nextTick, onUnmounted, VNode, Ref } from 'vue'

interface DraggableState<T> {
  loading: boolean
}

interface DraggableOptionState<T> {
  state: DraggableState<T>
  items: Ref<T[]>
  render: Ref<VNode[]>
}

function useInnerDraggable<T extends { id: string }>(container: HTMLElement, options: DraggableOptions<T>, optionState: DraggableOptionState<T>) {
  const { state, items, render } = optionState
  // 当前显示的卡片索引
  const currentIndex = ref(0)
  // 容器尺寸
  const containerHeight = ref(0)
  // 是否正在拖拽
  const isDragging = ref(false)
  // 触摸相关状态
  const touchState = reactive({
    startY: 0,
    currentY: 0,
    lastY: 0,
    moveSpeed: 0,
    lastMoveTime: 0,
    touchPoints: [] as Array<{ time: number, y: number }>
  })

  async function loadData() {
    try {
      state.loading = true

      const data = await options.onLoadMore()

      items.value.push(...data)
    } finally {
      state.loading = false
    }
  }

  /**
 * 根据容器元素和选项设置卡片拖拽
 * 默认放 4 个卡片，先实现 4 个卡片的拖拽循环
 * @param container 容器元素
 * @param options 选项
 */
  function setupCardDraggable<T>() {
    const cardList: VNode[] = []

    function renderDraggableCard(name: string) {
      const card = h('div', {
        class: 'DraggableCard-Item',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
          overflow: 'hidden',
          backfaceVisibility: 'hidden'
        }
      }, name)

      return card
    }

    // 生成足够的卡片以确保无限滚动流畅
    for (let i = 0; i < 4; i++) {
      const render = renderDraggableCard(`card-${i}`)
      cardList.push(render)
    }

    return cardList
  }

  function useCardDraggable(card: VNode) {
    const cardRef = ref<HTMLElement | null>(null)

    return {
      cardRef
    }
  }

  // 设置触摸事件处理
  function setupTouchEvents() {
    // 测量容器高度
    containerHeight.value = container.clientHeight

    // 触摸开始
    const handleTouchStart = (e: TouchEvent) => {
      isDragging.value = true
      touchState.startY = e.touches[0].clientY
      touchState.currentY = e.touches[0].clientY
      touchState.lastY = e.touches[0].clientY
      touchState.lastMoveTime = Date.now()
      touchState.moveSpeed = 0
      // 重置触摸点数组
      touchState.touchPoints = [{ time: Date.now(), y: e.touches[0].clientY }]
    }

    // 触摸移动
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.value) return

      e.preventDefault()

      touchState.currentY = e.touches[0].clientY
      const deltaY = touchState.currentY - touchState.lastY

      // 记录触摸点以计算速度
      touchState.touchPoints.push({
        time: Date.now(),
        y: touchState.currentY
      })

      // 只保留最近的5个触摸点用于计算速度
      if (touchState.touchPoints.length > 5) {
        touchState.touchPoints.shift()
      }

      // 更新滑动速度
      const now = Date.now()
      const timeDiff = now - touchState.lastMoveTime
      if (timeDiff > 0) {
        touchState.moveSpeed = deltaY / timeDiff
      }

      touchState.lastY = touchState.currentY
      touchState.lastMoveTime = now

      // 更新卡片位置
      updateCardsPosition(deltaY)
    }

    // 触摸结束
    const handleTouchEnd = () => {
      isDragging.value = false

      // 计算最终速度 - 使用最近几个触摸点的平均速度
      if (touchState.touchPoints.length >= 2) {
        const first = touchState.touchPoints[0]
        const last = touchState.touchPoints[touchState.touchPoints.length - 1]
        const timeDiff = last.time - first.time
        const distDiff = last.y - first.y

        if (timeDiff > 0) {
          touchState.moveSpeed = distDiff / timeDiff
        }
      }

      // 根据滑动速度和距离决定是否切换卡片
      const threshold = containerHeight.value * 0.2
      const moveDistance = touchState.currentY - touchState.startY
      const absMoveDistance = Math.abs(moveDistance)

      if (absMoveDistance > threshold || Math.abs(touchState.moveSpeed) > 0.5) {
        // 确定方向
        const direction = moveDistance > 0 ? 'prev' : 'next'
        switchCard(direction)
      } else {
        // 恢复到当前卡片
        resetCardsPosition()
      }
    }

    // 添加事件监听
    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    // 返回清理函数
    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }

  // 更新卡片位置
  function updateCardsPosition(deltaY: number) {
    const cards = container.querySelectorAll('.DraggableCard-Item')
    cards.forEach((card, index) => {
      updateCardStyle(card as HTMLElement, index, deltaY)
    })
  }

  // 更新单个卡片样式
  function updateCardStyle(card: HTMLElement, index: number, deltaY: number = 0) {
    const offset = index - currentIndex.value
    let translateY = offset * containerHeight.value

    // 添加当前拖拽的偏移量
    if (isDragging.value) {
      translateY += deltaY
    }

    // 使用缩放和透明度效果增强视觉体验
    const scale = 1 - Math.min(0.1, Math.abs(offset) * 0.05)
    const opacity = 1 - Math.min(0.3, Math.abs(offset) * 0.15)

    card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
    card.style.opacity = opacity.toString()
    card.style.transition = isDragging.value ? 'none' : 'all 0.3s cubic-bezier(0.33, 1, 0.68, 1)'
    card.style.zIndex = (10 - Math.abs(offset)).toString()
  }

  // 重置卡片位置
  function resetCardsPosition() {
    const cards = container.querySelectorAll('.DraggableCard-Item')
    cards.forEach((card, index) => {
      updateCardStyle(card as HTMLElement, index)
    })
  }

  // 切换卡片
  function switchCard(direction: 'next' | 'prev') {
    if (direction === 'next') {
      currentIndex.value = (currentIndex.value + 1) % (items.value.length || 4)
      // 如果快要滑到末尾，加载更多数据
      if (currentIndex.value >= (items.value.length || 4) - 2 && !state.loading) {
        loadData()
      }
    } else {
      currentIndex.value = (currentIndex.value - 1 + (items.value.length || 4)) % (items.value.length || 4)
    }

    resetCardsPosition()

    // 调用外部切换回调
    if (options.onSwitch && items.value.length > 0) {
      options.onSwitch(direction, items.value[currentIndex.value])
    }
  }

  nextTick(() => {
    const cards = setupCardDraggable()
    loadData()
    render.value = cards

    // 设置触摸事件
    const cleanup = setupTouchEvents()

    // 初始化卡片位置
    nextTick(() => {
      resetCardsPosition()
    })

    // 返回清理函数
    onUnmounted(() => {
      cleanup()
    })
  })
}

/**
 * 定义一个拖拽组件
 * 1.此组件是纵向无限滚动组件
 * 2.根据手势可以拖动
 *
 * @param container 容器元素
 * @returns
 */
export function useLeafDraggable<T extends { id: string }>(container: Ref<HTMLElement | null>, options: DraggableOptions<T>) {
  const render = ref<VNode[]>([])
  const items = shallowRef<T[]>([])
  const state = reactive<DraggableState<T>>({
    loading: false,
  })

  function setup() {
    if (!container.value) {
      throw new Error('container is required')
    }

    useInnerDraggable(container.value, options, { state, items, render })
  }

  return {
    items,
    state,
    render,
    setup
  }
}