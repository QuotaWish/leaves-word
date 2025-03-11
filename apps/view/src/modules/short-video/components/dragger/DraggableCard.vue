<script lang="ts">
import { defineComponent, ref, h, onMounted, watch } from 'vue'
import { useLeafDraggable } from './dragger';

export default defineComponent({
  name: 'DraggableCard',
  props: {
    onLoadMore: {
      type: Function,
      required: true
    }
  },
  emits: ['load-more', 'switch', 'refresh'],
  setup(props, { emit, slots }) {
    // 滑动容器引用
    const containerRef = ref<HTMLElement | null>(null)

    const { state, items, render, setup: setupDraggable } = useLeafDraggable(containerRef, {
      onLoadMore: async () => {
        // 调用外部加载更多函数并转发事件
        const data = await props.onLoadMore()
        emit('load-more', data)
        return data
      },
      onSwitch: (direction, item) => {
        // 转发切换事件
        emit('switch', direction, item)
      },
      onRefresh: async () => {
        // 转发刷新事件
        emit('refresh')
      },
      renderCard: (item: any) => {
        console.log('render', item, slots)

        // 优先使用插槽渲染卡片，如果没有提供插槽，则使用默认渲染
        if (slots.default) {
          return h('div', {
            class: 'DraggableCard-Content',
            style: {
              width: '100%',
              height: '100%',
              position: 'relative'
            }
          }, slots.default({ item }))
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
      }
    })

    onMounted(() => {
      setupDraggable()
    })

    return {
      containerRef,
      state,
      items,
      render
    }
  },
  render() {
    return h('div', { class: 'DraggableCard' }, [
      // 这里可以添加下拉刷新区域的渲染逻辑
      // h('div', { class: 'refresh-indicator', style: getRefreshStyle.value }, [
      //   h('div', { class: 'refresh-default-indicator' }, [
      //     this.state.isRefreshing 
      //       ? h('div', { class: 'refresh-spinner' })
      //       : h('div', { class: 'refresh-arrow', style: {
      //           transform: `rotate(${Math.min(180, this.state.refreshProgress / REFRESH_THRESHOLD * 180)}deg)`
      //         }}),
      //     h('div', { class: 'refresh-text' }, this.state.isRefreshing ? '刷新中...' : '下拉刷新')
      //   ])
      // ]),

      /**
       * this.items.map(item =>
        h('div', {
          key: item.id,
          class: 'DraggableCard-Item'
        }, JSON.stringify(item)
       */
      h('div', {
        class: 'DraggableCard-Container',
        ref: 'containerRef'
      }, this.render)
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
</style>