import { ref, watch } from 'vue'
import { useDark, useToggle, useStorage, usePreferredDark, useColorMode } from '@vueuse/core'

// 检测浏览器是否支持CSS过渡API
const supportsTransition = typeof document !== 'undefined' && 'startViewTransition' in document

// 颜色模式管理
export const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  storageKey: 'color-schema',
})

// 直接创建一个显式的切换函数，确保classList正确更新
const toggle = (forcedValue?: boolean) => {
  const newValue = forcedValue !== undefined ? forcedValue : !isDark.value
  isDark.value = newValue

  // 确保class被正确添加或移除
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', newValue)

    // 更新localStorage
    localStorage.setItem('color-schema', newValue ? 'dark' : 'light')
  }

  return newValue
}

export const toggleDark = (forcedValue?: boolean, event?: MouseEvent) => {
  // 如果传入了点击事件，则使用圆形扩散效果
  if (event && supportsTransition) {
    const x = event.clientX
    const y = event.clientY
    // 计算最大半径 - 从点击位置到最远角落的距离
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // 启动过渡动画
    // @ts-ignore - View Transition API不在所有类型定义中
    const transition = document.startViewTransition(async () => {
      toggle(forcedValue)
    })

    // 当准备好后开始动画
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 400,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      )
    })
  } else if (supportsTransition) {
    // 使用默认的滑动过渡效果
    // @ts-ignore - View Transition API不在所有类型定义中
    document.startViewTransition(() => {
      toggle(forcedValue)
    })
  } else {
    // 降级方案 - 直接切换
    toggle(forcedValue)
  }
}

// 主题色管理
export type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'red'
export const defaultThemeColor: ThemeColor = 'blue'

// 使用localStorage存储用户主题色偏好
export const themeColor = useStorage<ThemeColor>('leaves-word-theme-color', defaultThemeColor)

// 定义主题色映射
export const themeColorMap = {
  blue: {
    primary: '#1677ff',
    secondary: '#40a9ff',
    light: '#e6f7ff',
  },
  green: {
    primary: '#52c41a',
    secondary: '#73d13d',
    light: '#f6ffed',
  },
  purple: {
    primary: '#722ed1',
    secondary: '#9254de',
    light: '#f9f0ff',
  },
  orange: {
    primary: '#fa8c16',
    secondary: '#ffa940',
    light: '#fff7e6',
  },
  red: {
    primary: '#f5222d',
    secondary: '#ff4d4f',
    light: '#fff1f0',
  },
}

// 当主题色变化时应用CSS变量
watch(themeColor, (newColor) => {
  const colors = themeColorMap[newColor]
  if (typeof document !== 'undefined') {
    // 提取RGB值用于透明度计算
    const primaryHex = colors.primary.replace('#', '');
    const r = parseInt(primaryHex.substring(0, 2), 16);
    const g = parseInt(primaryHex.substring(2, 4), 16);
    const b = parseInt(primaryHex.substring(4, 6), 16);

    document.documentElement.style.setProperty('--theme-color-primary', colors.primary)
    document.documentElement.style.setProperty('--theme-color-secondary', colors.secondary)
    document.documentElement.style.setProperty('--theme-color-light', colors.light)
    document.documentElement.style.setProperty('--theme-color-primary-rgb', `${r}, ${g}, ${b}`)
  }
}, { immediate: true })

// 更改主题色的函数
export const changeThemeColor = (color: ThemeColor, event?: MouseEvent) => {
  // 如果传入了点击事件，则使用圆形扩散效果
  if (event && supportsTransition) {
    const x = event.clientX
    const y = event.clientY
    // 计算最大半径
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    // 保存当前颜色，用于动画过渡
    const oldColor = themeColor.value
    const oldColors = themeColorMap[oldColor]
    const newColors = themeColorMap[color]

    // @ts-ignore - View Transition API不在所有类型定义中
    const transition = document.startViewTransition(() => {
      themeColor.value = color
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      )

      // 为主题色相关元素添加过渡动画
      document.querySelectorAll('.theme-transition-element').forEach(el => {
        el.animate(
          [
            { backgroundColor: oldColors.primary },
            { backgroundColor: newColors.primary }
          ],
          {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
          }
        )
      })
    })
  } else if (supportsTransition) {
    // @ts-ignore - View Transition API不在所有类型定义中
    document.startViewTransition(() => {
      themeColor.value = color
    })
  } else {
    themeColor.value = color
  }
}

// 初始化主题过渡效果样式
if (typeof document !== 'undefined') {
  // 仅在浏览器环境下执行
  const style = document.createElement('style')
  style.textContent = `
    /* 基础动画效果 */
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    @keyframes slide-from-right {
      from { transform: translateX(30px); }
      to { transform: translateX(0); }
    }

    @keyframes slide-to-left {
      from { transform: translateX(0); }
      to { transform: translateX(-30px); }
    }

    /* 默认过渡效果 */
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }

    /* 控制暗色模式切换时的层级顺序 */
    ::view-transition-old(root) {
      z-index: 1;
    }

    ::view-transition-new(root) {
      z-index: 2147483646;
    }

    /* 暗色模式下调整层级顺序 */
    html.dark::view-transition-old(root) {
      z-index: 2147483646;
    }

    html.dark::view-transition-new(root) {
      z-index: 1;
    }
    
    /* 主题色过渡效果 */
    .theme-color-transition {
      transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    }
  `
  document.head.appendChild(style)
}

// 暴露API检测功能
export const features = {
  supportsTransition,
  prefersDark: usePreferredDark(),
}

// 完整的主题管理API
export const useTheme = () => {
  return {
    isDark,
    toggleDark,
    themeColor,
    changeThemeColor,
    themeColorMap,
    features,
  }
}

export default useTheme