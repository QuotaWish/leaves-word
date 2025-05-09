export interface CardRenderState {
  isCurrent: boolean
}

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
  renderCard: (item: T, index: number, state: CardRenderState) => VNode
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

// 卡片状态缓存，使用Map存储每个卡片的状态
interface CardStateCache {
  [id: string]: CardRenderState
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
  const containerWidth = ref(0)
  const containerHeight = ref(0)
  // 是否正在拖拽
  const isDragging = ref(false)
  // 触摸相关状态
  const touchState = reactive({
    isDown: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    moveSpeed: 0,
    touchPoints: [] as { x: number, y: number, time: number }[],
    animationFrameId: 0,
    pullUpRefreshProgress: 0,
    pullDownRefreshProgress: 0, // 添加下拉刷新进度
    isLocked: false, // 添加锁定状态，防止在刷新过程中操作
  })

  // 加载指示器元素
  let loadingIndicator: HTMLElement | null = null
  let topLoadingIndicator: HTMLElement | null = null;
  let bottomLoadingIndicator: HTMLElement | null = null;

  // 是否自动显示第一个视频
  const showFirstVideoByDefault = options.showFirstVideoByDefault !== false

  // 获取文本配置，使用传入的或默认值
  const desertMessageText = options.desertMessageText || '啥都没有...'
  const noMoreContentText = options.noMoreContentText || '没有更多内容了'
  const loadingText = options.loadingText || '加载中...'

  // 创建卡片状态缓存，保持最多4个活跃卡片的状态
  const cardStates = ref<CardStateCache>({})

  // 获取或创建卡片状态
  function getCardState(itemId: string, index: number): CardRenderState {
    if (!cardStates.value[itemId]) {
      cardStates.value[itemId] = {
        isCurrent: index === currentIndex.value
      }
    } else {
      // 更新卡片的当前状态 - 只在必要时更新
      if (cardStates.value[itemId].isCurrent !== (index === currentIndex.value)) {
        cardStates.value[itemId].isCurrent = index === currentIndex.value
      }
    }

    return cardStates.value[itemId]
  }

  // 清理非活跃卡片状态 - 只在必要时调用
  function cleanupCardStates() {
    const activeIndices = [
      currentIndex.value,
      currentIndex.value + 1,
      currentIndex.value - 1,
      currentIndex.value + 2
    ]
    
    // 过滤非活跃卡片状态
    const itemsToRemove = Object.keys(cardStates.value).filter(id => {
      const item = items.value.find(item => item.id === id)
      if (!item) return true // 如果项目不存在，也移除
      const index = items.value.indexOf(item)
      return !activeIndices.includes(index)
    })
    
    // 只清理确实需要清理的状态
    if (itemsToRemove.length > 0) {
      const newStates = { ...cardStates.value }
      itemsToRemove.forEach(id => {
        delete newStates[id]
      })
      cardStates.value = newStates
    }
  }
  
  // 更新特定卡片的状态
  function updateCardCurrentState(oldIndex: number, newIndex: number) {
    // 只更新前一个和当前卡片的状态
    if (oldIndex >= 0 && oldIndex < items.value.length) {
      const oldItem = items.value[oldIndex]
      if (cardStates.value[oldItem.id]) {
        cardStates.value[oldItem.id].isCurrent = false
      }
    }
    
    if (newIndex >= 0 && newIndex < items.value.length) {
      const newItem = items.value[newIndex]
      if (!cardStates.value[newItem.id]) {
        cardStates.value[newItem.id] = { isCurrent: true }
      } else {
        cardStates.value[newItem.id].isCurrent = true
      }
    }
    
    // 打印日志，帮助调试
    console.log('Updated card states:', JSON.stringify(cardStates.value));
    
    // 清理非活跃卡片状态
    cleanupCardStates();
  }

  // 创建顶部加载指示器（用于下拉刷新）
  function createTopLoadingIndicator() {
    if (topLoadingIndicator) return topLoadingIndicator;

    topLoadingIndicator = document.createElement('div');
    topLoadingIndicator.className = 'DraggableCard-TopLoading';
    topLoadingIndicator.style.position = 'absolute';
    topLoadingIndicator.style.top = '0px';
    topLoadingIndicator.style.left = '0';
    topLoadingIndicator.style.width = '100%';
    topLoadingIndicator.style.height = '80px';
    topLoadingIndicator.style.display = 'flex';
    topLoadingIndicator.style.alignItems = 'center';
    topLoadingIndicator.style.justifyContent = 'center';
    topLoadingIndicator.style.backgroundColor = '#f5f5f5';
    topLoadingIndicator.style.color = '#333';
    topLoadingIndicator.style.zIndex = '998';
    topLoadingIndicator.style.display = 'none';
    topLoadingIndicator.style.transform = 'translateY(-80px)';
    topLoadingIndicator.style.transition = 'transform 0.3s ease';

    // 添加加载动画
    topLoadingIndicator.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center;">
        <div style="width: 24px; height: 24px; border: 2px solid #666; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; margin-right: 12px;"></div>
        <span style="font-size: 14px;">${loadingText}</span>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    container.appendChild(topLoadingIndicator);
    return topLoadingIndicator;
  }

  // 创建底部加载指示器（用于上拉刷新）
  function createBottomLoadingIndicator() {
    if (bottomLoadingIndicator) return bottomLoadingIndicator;

    bottomLoadingIndicator = document.createElement('div');
    bottomLoadingIndicator.className = 'DraggableCard-BottomLoading';
    bottomLoadingIndicator.style.position = 'absolute';
    bottomLoadingIndicator.style.bottom = '0px';
    bottomLoadingIndicator.style.left = '0';
    bottomLoadingIndicator.style.width = '100%';
    bottomLoadingIndicator.style.height = '80px';
    bottomLoadingIndicator.style.display = 'flex';
    bottomLoadingIndicator.style.alignItems = 'center';
    bottomLoadingIndicator.style.justifyContent = 'center';
    bottomLoadingIndicator.style.backgroundColor = '#f5f5f5';
    bottomLoadingIndicator.style.color = '#333';
    bottomLoadingIndicator.style.zIndex = '998';
    bottomLoadingIndicator.style.display = 'none';
    bottomLoadingIndicator.style.transform = 'translateY(80px)';
    bottomLoadingIndicator.style.transition = 'transform 0.3s ease';

    // 添加加载动画
    bottomLoadingIndicator.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center;">
        <div style="width: 24px; height: 24px; border: 2px solid #666; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; margin-right: 12px;"></div>
        <span style="font-size: 14px;">${loadingText}</span>
      </div>
    `;

    container.appendChild(bottomLoadingIndicator);
    return bottomLoadingIndicator;
  }

  // 显示顶部加载指示器
  function showTopLoadingIndicator(text: string = loadingText) {
    const indicator = createTopLoadingIndicator();
    // 更新加载文本
    const textSpan = indicator.querySelector('span');
    if (textSpan) {
      textSpan.textContent = text;
    }
    indicator.style.display = 'flex';
    indicator.style.transform = 'translateY(0)';
  }

  // 显示底部加载指示器
  function showBottomLoadingIndicator(text: string = loadingText) {
    const indicator = createBottomLoadingIndicator();
    // 更新加载文本
    const textSpan = indicator.querySelector('span');
    if (textSpan) {
      textSpan.textContent = text;
    }
    indicator.style.display = 'flex';
    indicator.style.transform = 'translateY(0)';
  }

  // 隐藏顶部加载指示器
  function hideTopLoadingIndicator() {
    if (topLoadingIndicator) {
      topLoadingIndicator.style.transform = 'translateY(-80px)';
      // 动画完成后隐藏
      setTimeout(() => {
        if (topLoadingIndicator) {
          topLoadingIndicator.style.display = 'none';
        }
      }, 300);
    }
  }

  // 隐藏底部加载指示器
  function hideBottomLoadingIndicator() {
    if (bottomLoadingIndicator) {
      bottomLoadingIndicator.style.transform = 'translateY(80px)';
      // 动画完成后隐藏
      setTimeout(() => {
        if (bottomLoadingIndicator) {
          bottomLoadingIndicator.style.display = 'none';
        }
      }, 300);
    }
  }

  // 在加载数据时显示加载指示器
  async function loadData() {
    try {
      state.loading = true
      showBottomLoadingIndicator();

      const data = await options.onLoadMore()

      console.log('load', data)

      items.value.push(...data)

      return data
    } finally {
      state.loading = false
      hideBottomLoadingIndicator();
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
      // 获取卡片状态，并传递正确的CardRenderState对象
      const cardState = getCardState(item.id, targetIndex)
      const cardContent = options.renderCard(item, targetIndex, cardState)

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
      // 如果正在加载或锁定状态，禁止操作
      if (state.loading || touchState.isLocked) {
        return;
      }

      isDragging.value = true
      touchState.startX = e.touches[0].clientX
      touchState.startY = e.touches[0].clientY
      touchState.currentX = e.touches[0].clientX
      touchState.currentY = e.touches[0].clientY
      touchState.moveSpeed = 0
      // 重置触摸点数组
      touchState.touchPoints = [{ x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() }]
      // 添加取消可能存在的动画帧请求
      if (touchState.animationFrameId) {
        cancelAnimationFrame(touchState.animationFrameId)
        touchState.animationFrameId = 0
      }
    }

    // 触摸移动
    const handleTouchMove = (e: TouchEvent) => {
      // 如果正在加载或锁定状态，禁止操作
      if (state.loading || touchState.isLocked) {
        return;
      }

      e.preventDefault()

      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const deltaX = currentX - touchState.startX
      const deltaY = currentY - touchState.startY

      // 记录触摸点以计算速度
      touchState.touchPoints.push({ x: currentX, y: currentY, time: Date.now() })

      // 只保留最近的5个触摸点用于计算速度
      if (touchState.touchPoints.length > 5) {
        touchState.touchPoints.shift()
      }

      touchState.moveSpeed = deltaY

      touchState.currentX = currentX
      touchState.currentY = currentY

      // 在任何情况下都直接应用卡片偏移，确保跟手效果
      updateCardsPosition(deltaY)

      // 当在第一个卡片时，且向下拖动时，处理下拉刷新
      if (currentIndex.value === 0 && deltaY > 0 && options.onRefresh) {
        // 计算下拉刷新进度，将其限制在合理范围内
        touchState.pullDownRefreshProgress = Math.min(150, deltaY);

        // 显示顶部刷新区域
        const indicator = createTopLoadingIndicator();
        indicator.style.display = 'flex';

        // 下拉进度越大，露出的刷新区域越多
        const revealAmount = Math.min(80, touchState.pullDownRefreshProgress);
        indicator.style.transform = `translateY(${revealAmount - 80}px)`;

        // 当下拉超过70px时，显示下拉刷新提示
        if (touchState.pullDownRefreshProgress > 70) {
          const textSpan = indicator.querySelector('span');
          if (textSpan) {
            textSpan.textContent = '松开立即刷新';
          }
        } else {
          const textSpan = indicator.querySelector('span');
          if (textSpan) {
            textSpan.textContent = '下拉可以刷新';
          }
        }
      }

      // 当在最后一个卡片时，且向上拖动时，处理上拉加载更多
      if (currentIndex.value === items.value.length - 1 && deltaY < 0) {
        // 如果是在底部并且向上拉动，应用上拉刷新的阻尼效果
        const dampingFactor = 0.6
        const dampenedDeltaY = deltaY * dampingFactor;

        // 设置上拉刷新状态和进度
        touchState.pullUpRefreshProgress = Math.min(150, Math.abs(deltaY));

        // 显示底部刷新区域
        const indicator = createBottomLoadingIndicator();
        indicator.style.display = 'flex';

        // 上拉进度越大，露出的刷新区域越多
        const revealAmount = Math.min(80, touchState.pullUpRefreshProgress);
        indicator.style.transform = `translateY(${80 - revealAmount}px)`;

        // 当上拉超过70px时，显示上拉刷新提示
        if (touchState.pullUpRefreshProgress > 70) {
          const textSpan = indicator.querySelector('span');
          if (textSpan) {
            textSpan.textContent = '松开立即加载更多';
          }
        } else {
          const textSpan = indicator.querySelector('span');
          if (textSpan) {
            textSpan.textContent = '上拉加载更多';
          }
        }
      }
    }

    // 触摸结束
    const handleTouchEnd = async () => {
      isDragging.value = false;

      // 取消可能存在的动画帧请求
      if (touchState.animationFrameId) {
        cancelAnimationFrame(touchState.animationFrameId);
        touchState.animationFrameId = 0;
      }

      // 如果正在锁定状态，禁止操作
      if (touchState.isLocked) {
        return;
      }

      // 检查是否需要触发下拉刷新
      const totalDeltaY = touchState.currentY - touchState.startY;
      if (currentIndex.value === 0 && totalDeltaY > 0 &&
        touchState.pullDownRefreshProgress > 70 &&
        options.onRefresh) {

        try {
          // 锁定UI，防止用户操作
          touchState.isLocked = true;
          state.loading = true;

          // 显示下拉刷新加载指示器并完全展示
          showTopLoadingIndicator('刷新中...');

          // 下移卡片，显示刷新区域
          const allCards = container.querySelectorAll('.DraggableCard-Item');
          allCards.forEach((card) => {
            const cardEl = card as HTMLElement;
            cardEl.style.transform = `translate3d(0, 80px, 0)`;
            cardEl.style.transition = 'transform 0.2s ease-out';
          });

          // 调用下拉刷新回调
          await options.onRefresh();

          // 显示刷新成功的文字在刷新区域
          if (topLoadingIndicator) {
            const textSpan = topLoadingIndicator.querySelector('span');
            if (textSpan) {
              textSpan.textContent = '刷新成功';
            }
          }

          // 延迟一会儿后恢复
          await new Promise(resolve => setTimeout(resolve, 800));

        } catch (error) {
          console.error('下拉刷新失败:', error);

          // 显示刷新失败的文字在刷新区域
          if (topLoadingIndicator) {
            const textSpan = topLoadingIndicator.querySelector('span');
            if (textSpan) {
              textSpan.textContent = '刷新失败，请重试';
            }
          }

          // 延迟一会儿后恢复
          await new Promise(resolve => setTimeout(resolve, 800));

        } finally {
          // 先隐藏刷新区域
          hideTopLoadingIndicator();

          // 恢复UI位置
          const allCards = container.querySelectorAll('.DraggableCard-Item');
          allCards.forEach((card) => {
            const cardEl = card as HTMLElement;
            cardEl.style.transform = `translate3d(0, 0, 0)`;
          });

          // 重置状态
          state.loading = false;
          touchState.pullDownRefreshProgress = 0;
          touchState.isLocked = false;

          // 等待动画完成
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // 重置位置并退出
        resetCardsPosition();
        return;
      }

      // 检查是否需要触发上拉刷新
      if (currentIndex.value === items.value.length - 1 && totalDeltaY < 0 &&
        touchState.pullUpRefreshProgress > 70 &&
        options.onPullUpRefresh) {

        try {
          // 锁定UI，防止用户操作
          touchState.isLocked = true;
          state.loading = true;

          // 显示上拉刷新加载指示器并完全展示
          showBottomLoadingIndicator('加载中...');

          // 上移卡片，显示刷新区域
          const allCards = container.querySelectorAll('.DraggableCard-Item');
          allCards.forEach((card) => {
            const cardEl = card as HTMLElement;
            cardEl.style.transform = `translate3d(0, -80px, 0)`;
            cardEl.style.transition = 'transform 0.2s ease-out';
          });

          // 调用上拉刷新回调
          const newData = await options.onPullUpRefresh();

          // 完全替换列表数据
          if (newData && newData.length > 0) {
            items.value = newData;
            currentIndex.value = 0;

            // 重新设置卡片并更新渲染
            setupCardDraggable();

            // 显示刷新成功的文字在刷新区域
            if (bottomLoadingIndicator) {
              const textSpan = bottomLoadingIndicator.querySelector('span');
              if (textSpan) {
                textSpan.textContent = '加载成功';
              }
            }
          } else {
            // 如果没有数据返回，显示没有更多内容提示
            if (bottomLoadingIndicator) {
              const textSpan = bottomLoadingIndicator.querySelector('span');
              if (textSpan) {
                textSpan.textContent = noMoreContentText;
              }
            }
          }

          // 延迟一会儿后恢复
          await new Promise(resolve => setTimeout(resolve, 800));

        } catch (error) {
          console.error('上拉刷新失败:', error);

          // 显示刷新失败的文字在刷新区域
          if (bottomLoadingIndicator) {
            const textSpan = bottomLoadingIndicator.querySelector('span');
            if (textSpan) {
              textSpan.textContent = '加载失败，请重试';
            }
          }

          // 延迟一会儿后恢复
          await new Promise(resolve => setTimeout(resolve, 800));

        } finally {
          // 先隐藏刷新区域
          hideBottomLoadingIndicator();

          // 恢复UI位置
          const allCards = container.querySelectorAll('.DraggableCard-Item');
          allCards.forEach((card) => {
            const cardEl = card as HTMLElement;
            cardEl.style.transform = `translate3d(0, 0, 0)`;
          });

          // 重置状态
          state.loading = false;
          touchState.pullUpRefreshProgress = 0;
          touchState.isLocked = false;

          // 等待动画完成
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // 重置位置并退出
        resetCardsPosition();
        return;
      }

      // 重置上下拉刷新进度
      touchState.pullUpRefreshProgress = 0;
      touchState.pullDownRefreshProgress = 0;

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
      // 降低触发阈值，使卡片切换更灵敏
      const threshold = containerHeight.value * 0.1
      const moveDistance = touchState.currentY - touchState.startY
      const absMoveDistance = Math.abs(moveDistance)
      const absSpeed = Math.abs(touchState.moveSpeed)

      // 如果滑动距离超过阈值或者滑动速度足够大，则触发切换
      if (absMoveDistance > threshold || absSpeed > 0.3) {
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

    // 直接应用拖拽偏移量，优化所有卡片的跟手效果
    translateY += deltaY;

    // 设置适当的透明度变化
    const opacity = 1 - Math.min(0.3, Math.abs(offset) * 0.15)

    // 使用 translate3d 进行硬件加速，直接应用偏移值
    card.style.transform = `translate3d(0, ${translateY}px, 0)`;
    card.style.opacity = opacity.toString()

    // 拖动时完全关闭过渡动画
    if (isDragging.value) {
      card.style.transition = 'none'
    } else {
      // 松手后才使用过渡动画
      card.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out'
    }
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
      return;
    }

    // 保存旧索引用于状态更新
    const oldIndex = currentIndex.value;
    let newIndex = oldIndex;

    // 处理向下滑动（显示下一个）
    if (direction === 'next') {
      // 已经到达最后一个，需要加载更多数据
      if (currentIndex.value === items.value.length - 1) {
        try {
          state.loading = true;
          showBottomLoadingIndicator();

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
          hideBottomLoadingIndicator();
        }
      }

      // 如果当前是最后一个且没有更多数据，不允许滑动
      if (currentIndex.value === items.value.length - 1) {
        resetCardsPosition();
        return;
      }

      newIndex = currentIndex.value + 1;
      
    }
    // 处理向上滑动（显示上一个）
    else if (direction === 'prev') {
      // 从第一个向上滑动，不直接跳转到最后一个
      if (currentIndex.value === 0) {
        resetCardsPosition();
        return;
      }

      newIndex = currentIndex.value - 1;
    }

    // 仅在此处更新当前索引和卡片状态，避免多次更新
    currentIndex.value = newIndex;
    
    // 更新卡片状态
    updateCardCurrentState(oldIndex, newIndex);
    
    resetCardsPosition();

    // 调用外部切换回调
    if (options.onSwitch && items.value.length > 0) {
      options.onSwitch(direction, items.value[currentIndex.value]);
    }

    setupCardDraggable();

    // 如果快要滑到末尾，预加载更多数据
    if (direction === 'next' && currentIndex.value >= items.value.length - 2 && !state.loading) {
      loadData();
    }
  }

  // 初始化并加载数据
  function initializeData() {
    return new Promise<void>(async (resolve) => {
      try {
        // 加载初始数据
        await loadData()

        // 确保设置currentIndex为0
        currentIndex.value = 0

        // 初始化第一个卡片的状态
        if (items.value.length > 0) {
          const firstItem = items.value[0]
          if (!cardStates.value[firstItem.id]) {
            cardStates.value[firstItem.id] = { isCurrent: true }
          } else {
            cardStates.value[firstItem.id].isCurrent = true
          }
        }

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