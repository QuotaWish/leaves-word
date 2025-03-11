<script lang="ts">
import { defineComponent, ref, h, onMounted, watch, reactive } from 'vue'
import { useLeafDraggable } from './dragger';

export default defineComponent({
  name: 'DraggableCard',
  props: {
    onLoadMore: {
      type: Function,
      required: true
    },
    onPullUpRefresh: {
      type: Function
    },
    desertMessageText: {
      type: String,
      default: '你来到了荒漠'
    },
    noMoreContentText: {
      type: String,
      default: '没有更多内容了'
    },
    loadingText: {
      type: String,
      default: '加载中...'
    }
  },
  emits: ['switch', 'refresh', 'pull-up-refresh'],
  setup(props, { emit, slots }) {
    // 滑动容器引用
    const containerRef = ref<HTMLElement | null>(null)
    
    // 状态提示控制
    const uiState = reactive({
      showDesertMessage: false
    })

    const { state, items, render, setup: setupDraggable } = useLeafDraggable(containerRef, {
      onLoadMore: async () => {
        const data = await props.onLoadMore()
        return data
      },
      onSwitch: (direction, item) => {
        // 处理达到末尾的情况
        if (direction === 'end') {
          uiState.showDesertMessage = true
          // 3秒后自动隐藏
          setTimeout(() => {
            uiState.showDesertMessage = false
          }, 3000)
        }
        
        // 转发切换事件
        emit('switch', direction, item)
      },
      onRefresh: async () => {
        // 转发刷新事件
        emit('refresh')
      },
      onPullUpRefresh: async () => {
        // 转发上拉刷新事件
        emit('pull-up-refresh')
        // 确保props.onPullUpRefresh存在再调用
        if (typeof props.onPullUpRefresh === 'function') {
          try {
            const newData = await props.onPullUpRefresh()
            return newData || [] // 确保返回数组
          } catch (error) {
            console.error('上拉刷新执行出错:', error)
            return [] // 出错时返回空数组
          }
        }
        return [] // 没有函数时返回空数组
      },
      renderCard: (item: any, index: number) => {
        // 优先使用插槽渲染卡片，如果没有提供插槽，则使用默认渲染
        if (slots.default) {
          const debugInfo = h('div', {
            style: {
              zIndex: '10',
              position: 'absolute',
              right: '1rem',
              bottom: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              opacity: '0.7'
            }
          }, `${index}`)

          // 渲染内容
          return h('div', {
            class: 'DraggableCard-Content',
            style: {
              width: '100%',
              height: '100%',
              position: 'relative'
            }
          }, [debugInfo, slots.default({ item })])
        }

        // 默认渲染
        return h('div', {
          class: 'DraggableCard-Content',
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#333',
            fontSize: '14px',
            padding: '20px',
            borderRadius: '4px',
            boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)'
          }
        }, JSON.stringify(item))
      },
      // 传递自定义文本
      desertMessageText: props.desertMessageText,
      noMoreContentText: props.noMoreContentText,
      loadingText: props.loadingText
    })

    onMounted(() => {
      setupDraggable()
    })

    return {
      containerRef,
      state,
      items,
      render,
      uiState
    }
  },
  render() {
    // 渲染荒漠提示
    const desertMessage = h('div', {
      class: 'desert-message',
      style: {
        display: this.uiState.showDesertMessage ? 'flex' : 'none',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)'
      }
    }, [
      h('div', {
        style: { 
          fontSize: '24px', 
          marginBottom: '8px' 
        }
      }, '🏜️'),
      h('div', null, this.desertMessageText),
      h('div', {
        style: {
          fontSize: '14px',
          marginTop: '6px',
          opacity: '0.7'
        }
      }, this.noMoreContentText)
    ])

    return h('div', { class: 'DraggableCard' }, [
      // 滑动容器
      h('div', {
        class: 'DraggableCard-Container',
        ref: 'containerRef'
      }, this.render),
      
      // 添加提示消息
      desertMessage
    ])
  }
})
</script>

<style lang="scss" scoped>
.DraggableCard {
  &-Item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform;
    overflow: hidden;
    backface-visibility: hidden;
  }

  &-Content {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  background-color: var(--el-bg-color);
}

.DraggableCard-Container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

// 增加状态提示样式
.desert-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  position: absolute;
  z-index: 999;
  text-align: center;
  transition: opacity 0.3s ease;
}
</style>