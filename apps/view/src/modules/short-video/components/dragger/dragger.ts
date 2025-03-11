export interface DraggableOptions<T> {
  /**
   * 当加载更多数据的时候
   */
  onLoadMore: () => Promise<T[]>
  /**
   * 当切换到的时候
   */
  onSwitch?: (direction: 'next' | 'prev' | 'end', item: T) => void
  /**
   * 当触发下拉刷新的时候
   */
  onRefresh?: () => Promise<void>
  /**
   * 当触发上拉刷新的时候（当前在列表顶部并继续上拉时触发）
   */
  onPullUpRefresh?: () => Promise<T[]>
  /**
   * 渲染卡片的组件
   */
  renderCard: (item: T, index: number) => VNode
  /**
   * 是否立即显示首个视频（默认为true）
   */
  showFirstVideoByDefault?: boolean
  /**
   * 自定义荒漠提示文本
   */
  desertMessageText?: string
  /**
   * 自定义没有更多内容提示文本
   */
  noMoreContentText?: string
  /**
   * 自定义加载中提示文本
   */
  loadingText?: string
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
    animationFrameId: 0, // 添加动画帧ID跟踪
    pullUpRefreshProgress: 0 // 添加上拉刷新进度
  })

  // 加载指示器元素
  let loadingIndicator: HTMLElement | null = null

  // 是否自动显示第一个视频
  const showFirstVideoByDefault = options.showFirstVideoByDefault !== false

  // 获取文本配置，使用传入的或默认值
  const desertMessageText = options.desertMessageText || '你来到了荒漠'
  const noMoreContentText = options.noMoreContentText || '没有更多内容了'
  const loadingText = options.loadingText || '加载中...'

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
        <span style="margin-left: 8px;">${loadingText}</span>
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
  function showLoadingIndicator(text: string = loadingText) {
    const indicator = createLoadingIndicator();
    // 更新加载文本
    const textSpan = indicator.querySelector('span');
    if (textSpan) {
      textSpan.textContent = text;
    }
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

    function renderDraggableCard(item: any, targetIndex: number) {
      const cardContent = options.renderCard(item, targetIndex)

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

    // 只渲染实际存在的数据项，不再自动添加荒漠提示
    for (let i = 0; i < 4; i++) {
      // 计算要渲染的索引，从当前索引开始，渲染当前及后续的卡片
      const targetIndex = (currentIndex.value + i) % items.value.length
      const targetData = items.value[targetIndex]

      if (targetData) {
        const render = renderDraggableCard(targetData, targetIndex)
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

      // 记录触摸点以计算速度
      touchState.touchPoints.push({
        time: Date.now(),
        y: currentY
      })

      // 只保留最近的5个触摸点用于计算速度
      if (touchState.touchPoints.length > 5) {
        touchState.touchPoints.shift()
      }

      // 使用原始的deltaY，增强跟手感
      touchState.moveSpeed = deltaY

      touchState.currentY = currentY
      touchState.lastY = currentY
      touchState.lastMoveTime = Date.now()

      // 检测特殊的上拉刷新手势（当在列表顶部时）
      const totalDeltaY = touchState.currentY - touchState.startY
      if (currentIndex.value === 0 && totalDeltaY < 0 && options.onPullUpRefresh) {
        // 如果是在顶部并且向上拉动，应用上拉刷新的阻尼效果
        const dampingFactor = 0.4  // 阻尼系数，使得拉动更有抵抗感
        const dampenedDeltaY = totalDeltaY * dampingFactor

        // 设置上拉刷新状态和进度
        touchState.pullUpRefreshProgress = Math.min(Math.abs(dampenedDeltaY), 150) // 限制最大进度为150px
      }

      // 立即更新卡片位置，不使用动画帧，直接应用变化提高跟手度
      updateCardsPosition(deltaY)
    }

    // 触摸结束
    const handleTouchEnd = async () => {
      isDragging.value = false

      // 取消可能存在的动画帧请求
      if (touchState.animationFrameId) {
        cancelAnimationFrame(touchState.animationFrameId)
        touchState.animationFrameId = 0
      }

      // 检查是否需要触发上拉刷新
      const totalDeltaY = touchState.currentY - touchState.startY
      if (currentIndex.value === 0 && totalDeltaY < 0 &&
        touchState.pullUpRefreshProgress > 90 && // 上拉超过阈值
        options.onPullUpRefresh) {

        try {
          // 显示上拉刷新加载指示器
          state.loading = true;
          showLoadingIndicator('上拉刷新中...');

          // 调用上拉刷新回调
          const newData = await options.onPullUpRefresh();

          // 完全替换列表数据
          if (newData && newData.length > 0) {
            items.value = newData;
            currentIndex.value = 0;

            // 重新设置卡片并更新渲染
            setupCardDraggable();
            resetCardsPosition();

            // 显示刷新成功提示
            const toast = document.createElement('div');
            toast.textContent = '刷新成功';
            toast.style.position = 'absolute';
            toast.style.top = '20%';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            toast.style.color = 'white';
            toast.style.padding = '8px 16px';
            toast.style.borderRadius = '4px';
            toast.style.zIndex = '9999';

            container.appendChild(toast);

            // 2秒后移除提示
            setTimeout(() => {
              container.removeChild(toast);
            }, 2000);

            // 重置上拉刷新进度
            touchState.pullUpRefreshProgress = 0;
            return;
          }
        } catch (error) {
          console.error('上拉刷新失败:', error);

          // 显示刷新失败提示
          const toast = document.createElement('div');
          toast.textContent = '刷新失败，请重试';
          toast.style.position = 'absolute';
          toast.style.top = '20%';
          toast.style.left = '50%';
          toast.style.transform = 'translateX(-50%)';
          toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          toast.style.color = 'white';
          toast.style.padding = '8px 16px';
          toast.style.borderRadius = '4px';
          toast.style.zIndex = '9999';

          container.appendChild(toast);

          // 2秒后移除提示
          setTimeout(() => {
            container.removeChild(toast);
          }, 2000);
        } finally {
          state.loading = false;
          hideLoadingIndicator();
          touchState.pullUpRefreshProgress = 0;
        }
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

      // 重置上拉刷新进度
      touchState.pullUpRefreshProgress = 0;

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

    // 添加当前拖拽的偏移量，优化跟手效果
    if (isDragging.value) {
      // 直接应用偏移量，增强跟手感
      translateY += deltaY
    }

    // 为下一张卡片设置更强的跟随效果
    if (offset === 1 && deltaY < 0) {
      // 增加跟随比例
      const followRatio = 0.95; // 更高的跟随比例
      translateY += deltaY * followRatio;
    }
    
    // 为前一张卡片也设置跟随效果
    if (offset === -1 && deltaY > 0) {
      const followRatio = 0.95; // 高跟随比例
      translateY += deltaY * followRatio;
    }

    // 设置适当的透明度变化
    const opacity = 1 - Math.min(0.3, Math.abs(offset) * 0.15)

    // 使用 transform 中的 translateY，完全移除动画，使用硬件加速
    card.style.transform = `translate3d(0, ${translateY}px, 0)`;
    card.style.opacity = opacity.toString()
    
    // 拖动时完全关闭过渡动画
    if (isDragging.value) {
      card.style.transition = 'none'
    } else {
      // 松手后才使用过渡动画
      card.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out'
    }
    
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
        // 没有数据时显示空状态（通过调用方提供的渲染函数）
        return;
      }
    }

    // 处理向下滑动（显示下一个）
    if (direction === 'next') {
      // 如果是最后一个且没有更多数据加载中，先尝试加载数据
      if (currentIndex.value === items.value.length - 1 && !state.loading) {
        try {
          // 显示加载动画
          state.loading = true;
          showLoadingIndicator();

          // 加载更多数据
          const newData = await options.onLoadMore();

          // 如果没有新数据，保持在当前位置
          if (!newData || newData.length === 0) {
            // 回弹效果
            resetCardsPosition();
            
            // 使用自定义事件通知外部显示荒漠提示
            if (options.onSwitch) {
              options.onSwitch('end', items.value[currentIndex.value]);
            }

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
    } 
    // 处理向上滑动（显示上一个）
    else if (direction === 'prev') {
      // 从第一个向上滑动，不直接跳转到最后一个
      if (currentIndex.value === 0) {
        resetCardsPosition();
        return;
      }
      
      currentIndex.value = (currentIndex.value - 1 + items.value.length) % items.value.length;
    }

    resetCardsPosition();

    // 调用外部切换回调
    if (options.onSwitch && items.value.length > 0) {
      options.onSwitch(direction, items.value[currentIndex.value]);
    }

    setupCardDraggable();
  }

  // 初始化并加载数据
  function initializeData() {
    return new Promise<void>(async (resolve) => {
      try {
        // 加载初始数据
        await loadData()
        
        // 确保设置currentIndex为0
        currentIndex.value = 0
        
        // 设置卡片
        setupCardDraggable()
        
        // 初始化卡片位置
        nextTick(() => {
          resetCardsPosition()
          resolve()
        })
      } catch (error) {
        console.error('初始化数据失败:', error)
        resolve()
      }
    })
  }

  nextTick(() => {
    setupCardDraggable()
    
    // 使用初始化函数加载第一个视频
    if (showFirstVideoByDefault) {
      initializeData()
    } else {
      loadData()
    }

    // 设置触摸事件
    const cleanup = setupTouchEvents()

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

  // 确保默认显示首个视频
  const mergedOptions: DraggableOptions<T> = {
    ...options,
    showFirstVideoByDefault: options.showFirstVideoByDefault !== false
  }

  function setup() {
    if (!container.value) {
      throw new Error('container is required')
    }

    useInnerDraggable(container.value, mergedOptions, { state, items, render })
  }

  return {
    items,
    state,
    render,
    setup
  }
}