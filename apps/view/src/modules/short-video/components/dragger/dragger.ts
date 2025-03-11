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
    touchPoints: [] as Array<{ time: number, y: number }>,
    animationFrameId: 0 // 添加动画帧ID跟踪
  })

  // 加载指示器元素
  let loadingIndicator: HTMLElement | null = null

  // 创建加载指示器
  function createLoadingIndicator() {
    if (loadingIndicator) return loadingIndicator;

    loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'DraggableCard-Loading';
    loadingIndicator.style.position = 'absolute';
    loadingIndicator.style.bottom = '20%';
    loadingIndicator.style.left = '50%';
    loadingIndicator.style.transform = 'translateX(-50%)';
    loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    loadingIndicator.style.color = 'white';
    loadingIndicator.style.padding = '8px 16px';
    loadingIndicator.style.borderRadius = '4px';
    loadingIndicator.style.zIndex = '9999';
    loadingIndicator.style.display = 'none';

    // 添加加载动画
    loadingIndicator.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center;">
        <div style="width: 16px; height: 16px; border: 2px solid #fff; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
        <span style="margin-left: 8px;">加载中...</span>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    container.appendChild(loadingIndicator);

    return loadingIndicator;
  }

  // 显示加载指示器
  function showLoadingIndicator() {
    const indicator = createLoadingIndicator();
    indicator.style.display = 'block';
  }

  // 隐藏加载指示器
  function hideLoadingIndicator() {
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }

  // 在加载数据时显示加载指示器
  async function loadData() {
    try {
      state.loading = true
      showLoadingIndicator();

      const data = await options.onLoadMore()

      console.log('load', data)

      items.value.push(...data)

      return data
    } finally {
      state.loading = false
      hideLoadingIndicator();
      setupCardDraggable()
    }
  }

  /**
 * 根据容器元素和选项设置卡片拖拽
 * 默认放 4 个卡片，先实现 4 个卡片的拖拽循环
 * @param container 容器元素
 * @param options 选项
 */
  function setupCardDraggable<T>() {
    const cardList: VNode[] = render.value?.length ? render.value : []

    function renderDraggableCard(item: any) {
      const cardContent = options.renderCard(item)

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
      }, cardContent)

      return card
    }

    for (let i = 0; i < 4; i++) {
      // 计算要渲染的索引，从当前索引开始，渲染当前及后续的3个卡片
      const targetIndex = (currentIndex.value + i) % items.value.length
      const targetData = items.value[targetIndex]

      if (targetData) {
        const render = renderDraggableCard(targetData)
        cardList[i] = render
      }
    }

    render.value = cardList
  }

  // 设置触摸事件处理
  function setupTouchEvents() {
    // 测量容器高度
    containerHeight.value = container.clientHeight

    // 触摸开始
    const handleTouchStart = (e: TouchEvent) => {
      isDragging.value = true
      touchState.startY = e.touches[0].clientY
      touchState.lastY = touchState.startY
      touchState.currentY = touchState.startY
      touchState.lastMoveTime = Date.now()
      touchState.moveSpeed = 0
      // 重置触摸点数组
      touchState.touchPoints = [{ time: Date.now(), y: e.touches[0].clientY }]
      // 添加取消可能存在的动画帧请求
      if (touchState.animationFrameId) {
        cancelAnimationFrame(touchState.animationFrameId)
        touchState.animationFrameId = 0
      }
    }

    // 触摸移动
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.value) return

      e.preventDefault()

      const currentY = e.touches[0].clientY
      const deltaY = currentY - touchState.lastY

      // 记录触摸点以计算速度，应用平滑处理
      touchState.touchPoints.push({
        time: Date.now(),
        y: currentY
      })

      // 只保留最近的8个触摸点用于计算速度，增加样本点以获得更平滑的速度计算
      if (touchState.touchPoints.length > 8) {
        touchState.touchPoints.shift()
      }

      // 应用低通滤波器来平滑移动
      const smoothingFactor = 0.8 // 平滑因子，值越大越平滑，但响应越慢
      touchState.moveSpeed = (touchState.moveSpeed * smoothingFactor) + (deltaY * (1 - smoothingFactor))

      touchState.currentY = currentY
      touchState.lastY = currentY
      touchState.lastMoveTime = Date.now()

      // 使用 requestAnimationFrame 来优化性能并减少抖动
      if (!touchState.animationFrameId) {
        touchState.animationFrameId = requestAnimationFrame(() => {
          // 更新卡片位置
          updateCardsPosition(deltaY)
          touchState.animationFrameId = 0
        })
      }
    }

    // 触摸结束
    const handleTouchEnd = () => {
      isDragging.value = false

      // 取消可能存在的动画帧请求
      if (touchState.animationFrameId) {
        cancelAnimationFrame(touchState.animationFrameId)
        touchState.animationFrameId = 0
      }

      // 计算最终速度 - 使用加权平均来平滑最终速度
      if (touchState.touchPoints.length >= 2) {
        const first = touchState.touchPoints[0]
        const last = touchState.touchPoints[touchState.touchPoints.length - 1]
        const timeDiff = last.time - first.time
        const distDiff = last.y - first.y

        if (timeDiff > 0) {
          // 使用时间加权计算最终速度
          const points = touchState.touchPoints
          let weightedSpeed = 0
          let totalWeight = 0

          for (let i = 1; i < points.length; i++) {
            const weight = Math.min(1, (points[i].time - points[i - 1].time) / 30) // 时间权重
            const pointSpeed = (points[i].y - points[i - 1].y) / (points[i].time - points[i - 1].time)
            weightedSpeed += pointSpeed * weight
            totalWeight += weight
          }

          touchState.moveSpeed = totalWeight > 0 ? weightedSpeed / totalWeight : distDiff / timeDiff
        }
      }

      // 根据滑动速度和距离决定是否切换卡片
      const threshold = containerHeight.value * 0.15 // 降低一点阈值，使切换更容易触发
      const moveDistance = touchState.currentY - touchState.startY
      const absMoveDistance = Math.abs(moveDistance)

      if (absMoveDistance > threshold || Math.abs(touchState.moveSpeed) > 0.4) {
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

    // 使用 transform 属性的 translate3d 和 scale 函数来启用硬件加速
    card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`
    card.style.opacity = opacity.toString()
    // 调整动画时间和缓动函数，使滑动更跟手，非拖拽状态时使用更自然的缓动
    card.style.transition = isDragging.value ? 'none' : 'all 0.25s cubic-bezier(0.23, 1, 0.32, 1)'
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
  async function switchCard(direction: 'next' | 'prev') {
    // 确保列表不为空
    if (items.value.length === 0) {
      // 尝试加载初始数据
      if (!state.loading) {
        await loadData();
      }

      // 如果加载后仍然没有数据，显示提示并返回
      if (items.value.length === 0) {
        const toast = document.createElement('div');
        toast.textContent = '暂无内容';
        toast.style.position = 'absolute';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toast.style.color = 'white';
        toast.style.padding = '8px 16px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '9999';

        container.appendChild(toast);

        setTimeout(() => {
          container.removeChild(toast);
        }, 3000);

        return;
      }
    }

    if (direction === 'next') {
      // 如果是最后一个且没有更多数据加载中，先尝试加载数据
      if (currentIndex.value === items.value.length - 1 && !state.loading) {
        try {
          // 显示加载动画
          state.loading = true;
          showLoadingIndicator();

          // 加载更多数据
          const newData = await options.onLoadMore();

          // 如果没有新数据，回弹并提示
          if (!newData || newData.length === 0) {
            // 回弹效果
            resetCardsPosition();

            // 创建提示元素
            const toast = document.createElement('div');
            toast.textContent = '没有更多内容了';
            toast.style.position = 'absolute';
            toast.style.bottom = '20%';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            toast.style.color = 'white';
            toast.style.padding = '8px 16px';
            toast.style.borderRadius = '4px';
            toast.style.zIndex = '9999';

            // 添加到容器中
            container.appendChild(toast);

            // 3秒后移除提示
            setTimeout(() => {
              container.removeChild(toast);
            }, 3000);

            return;
          }

          // 有新数据，添加到列表中
          items.value.push(...newData);
        } finally {
          state.loading = false;
          hideLoadingIndicator();
        }
      }

      // 如果当前是最后一个且没有更多数据，不允许滑动
      if (currentIndex.value === items.value.length - 1) {
        resetCardsPosition();
        return;
      }

      currentIndex.value = (currentIndex.value + 1) % items.value.length;

      // 如果快要滑到末尾，预加载更多数据
      if (currentIndex.value >= items.value.length - 2 && !state.loading) {
        loadData();
      }
    } else {
      currentIndex.value = (currentIndex.value - 1 + items.value.length) % items.value.length;
    }

    resetCardsPosition();

    // 调用外部切换回调
    if (options.onSwitch && items.value.length > 0) {
      options.onSwitch(direction, items.value[currentIndex.value]);
    }

    setupCardDraggable();
  }

  nextTick(() => {
    setupCardDraggable()
    loadData()

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