<script setup lang="ts">
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElOption,
  ElSelect,
  ElTooltip,
} from 'element-plus'
import { MOCK_DEVICES, useGlobalSplashState } from '.'
import DarkModeSwitch from '~/components/button/DarkModeSwitch.vue'

const splashState = useGlobalSplashState()

const mockDevice = computed(() => splashState.mockDevice)
const devices = Object.values(MOCK_DEVICES)

const { pixelRatio } = useDevicePixelRatio()

// 工具菜单选项
const tools = [
  { label: '元素检查', icon: 'cursor' },
  { label: '控制台', icon: 'terminal' },
  { label: '网络', icon: 'connection' },
  { label: '性能', icon: 'trend-charts' },
  { label: '应用', icon: 'mobile' },
  { label: '存储', icon: 'database' },
]
</script>

<template>
  <div class="SplashMenu h-full w-full px-4">
    <div class="SplashMenu-Left w-[30%] justify-start flex items-center gap-4">
      <div class="SplashMenu-Icon flex items-center gap-2">
        <Logo class="h-6 w-6" />
        <span class="text-14px font-medium">Leaf<b>Developer</b></span>
      </div>

      <ElDropdown trigger="click">
        <div class="menu-trigger flex cursor-pointer items-center gap-1">
          <Icon name="menu" class="text-gray-600" />
          <span class="text-sm">菜单</span>
        </div>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem v-for="tool in tools" :key="tool.label">
              <div class="flex items-center gap-2">
                <div :class="tool.icon" />
                <span>{{ tool.label }}</span>
              </div>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </div>

    <div class="SplashMenu-Center w-[30%] justify-center flex items-center gap-4">
      <div class="device-selector flex items-center gap-3">
        <ElSelect v-model="mockDevice.value" class="min-w-[120px]" size="small">
          <ElOption
            v-for="device in devices"
            :key="device.label"
            :label="device.label"
            :value="device.value"
          />
        </ElSelect>

        <!-- <div v-if="currentDevice === 'custom'" class="custom-size flex items-center gap-2">
          <input v-model="customWidth" type="number" class="w-16 border rounded px-2 py-1 text-sm">
          <span class="text-gray-500">×</span>
          <input v-model="customHeight" type="number" class="w-16 border rounded px-2 py-1 text-sm">
        </div> -->

        <!-- <ElTooltip content="切换方向">
          <div class="cursor-pointer" @click="toggleOrientation">
            <Icon :name="orientation === 'portrait' ? 'mobile' : 'mobile-rotate'" />
          </div>
        </ElTooltip> -->
      </div>

      <div class="zoom-control flex items-center gap-2">
        <ElTooltip content="缩放">
          <div class="flex items-center gap-1">
            <!-- <Icon name="zoom-in" class="cursor-pointer" @click="zoom = Math.min(zoom + 10, 200)" /> -->
            <span class="text-sm">{{ pixelRatio * 100 }}%</span>
            <!-- <Icon name="zoom-out" class="cursor-pointer" @click="zoom = Math.max(zoom - 10, 25)" /> -->
          </div>
        </ElTooltip>
      </div>
    </div>

    <div class="SplashMenu-Right w-[30%] justify-end flex items-center gap-3">
      <DarkModeSwitch />

      <div class="tools-bar flex items-center gap-2">
        <!-- <ElTooltip
          v-for="(tool, index) in tools"
          :key="tool.label"
          :content="tool.label"
        >
          <div
            class="tool-item cursor-pointer rounded p-1"
            :class="{ 'bg-gray-100': activeToolIndex === index }"
            @click="activeToolIndex = index"
          >
            <Icon :name="tool.icon" />
          </div>
        </ElTooltip> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SplashMenu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;

  .menu-trigger {
    padding: 4px 8px;
    border-radius: 4px;
    &:hover {
      background: var(--el-fill-color-light);
    }
  }

  .tool-item {
    transition: all 0.2s;
    &:hover {
      background: var(--el-text-color-primary);
    }
  }

  input[type='number'] {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
