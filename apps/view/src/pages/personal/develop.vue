<script setup lang="ts">
import PageNavHolder from '~/components/page/holder/PageNavHolder.vue'
import { useDevMode } from '~/modules/develop'

// 导入开发者模式设置
const { devModeEnabled, toggleDevMode } = useDevMode()
</script>

<template>
  <PageNavHolder :content-padding="false" class="DevelopPage" title="开发者模式">
    <div class="DevelopPage-Container h-full p-4 overflow-y-scroll flex flex-col gap-3">
      <!-- 开发工具 -->
      <div class="DevelopPage-Section">
        <LineArrow>
          <template #icon>
            <div i-carbon:code />
          </template>
          开发工具
        </LineArrow>
        <div class="DevelopPage-SectionItem">
          <div class="DevelopPage-SectionItem-content">
            <div class="DevelopPage-SectionItem-title">
              开发者模式状态
            </div>
            <div class="DevelopPage-SectionItem-desc">
              控制开发者模式的启用状态
            </div>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              :checked="devModeEnabled" 
              @change="toggleDevMode"
            >
            <span class="slider" />
          </label>
        </div>
        <div class="DevelopPage-SectionItem">
          <div class="DevelopPage-SectionItem-content">
            <div class="DevelopPage-SectionItem-title">
              日志查看器
            </div>
            <div class="DevelopPage-SectionItem-desc">
              查看应用运行日志
            </div>
          </div>
          <span class="arrow" />
        </div>
      </div>

      <!-- 调试工具 -->
      <div class="DevelopPage-Section">
        <LineArrow>
          <template #icon>
            <div i-carbon:debug />
          </template>
          调试工具
        </LineArrow>
        <div class="DevelopPage-SectionItem">
          <div class="DevelopPage-SectionItem-content">
            <div class="DevelopPage-SectionItem-title">
              网络监控
            </div>
            <div class="DevelopPage-SectionItem-desc">
              监控网络请求和响应
            </div>
          </div>
          <span class="arrow" />
        </div>
        <div class="DevelopPage-SectionItem">
          <div class="DevelopPage-SectionItem-content">
            <div class="DevelopPage-SectionItem-title">
              性能分析
            </div>
            <div class="DevelopPage-SectionItem-desc">
              分析应用性能瓶颈
            </div>
          </div>
          <span class="arrow" />
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="DevelopPage-Section">
        <LineArrow>
          <template #icon>
            <div i-carbon:data-base />
          </template>
          数据管理
        </LineArrow>
        <div class="DevelopPage-SectionItem">
          <div class="DevelopPage-SectionItem-content">
            <div class="DevelopPage-SectionItem-title">
              本地存储查看
            </div>
            <div class="DevelopPage-SectionItem-desc">
              查看和修改本地存储数据
            </div>
          </div>
          <span class="arrow" />
        </div>
        <div class="DevelopPage-SectionItem">
          <div class="DevelopPage-SectionItem-content">
            <div class="DevelopPage-SectionItem-title">
              清除应用缓存
            </div>
            <div class="DevelopPage-SectionItem-desc">
              重置应用数据和缓存
            </div>
          </div>
          <span class="arrow" />
        </div>
      </div>

      <!-- 测试工具 -->
      <div class="DevelopPage-Section">
        <LineArrow>
          <template #icon>
            <div i-carbon:test />
          </template>
          测试工具
        </LineArrow>
        <div class="DevelopPage-SectionItem">
          <div class="DevelopPage-SectionItem-content">
            <div class="DevelopPage-SectionItem-title">
              UI测试
            </div>
            <div class="DevelopPage-SectionItem-desc">
              测试界面组件
            </div>
          </div>
          <span class="arrow" />
        </div>
        <div class="DevelopPage-SectionItem">
          <div class="DevelopPage-SectionItem-content">
            <div class="DevelopPage-SectionItem-title">
              API测试
            </div>
            <div class="DevelopPage-SectionItem-desc">
              测试后端接口
            </div>
          </div>
          <span class="arrow" />
        </div>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.DevelopPage-Container {
  width: 100%;
  height: 100%;

  overflow-y: scroll;
}

.DevelopPage-Section {
  border-radius: 15px;
  background: var(--el-fill-color-light);
}

.DevelopPage-Section-title {
  padding: 10px 0;
  font-size: 16px;
  color: #333;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}

.DevelopPage-SectionItem {
  padding: 1rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color-light);
}

.DevelopPage-SectionItem:last-child {
  border-bottom: none;
}

.DevelopPage-SectionItem-content {
  flex-grow: 1;
}

.DevelopPage-SectionItem-title {
  font-size: 16px;
  margin-bottom: 5px;
}

.DevelopPage-SectionItem-desc {
  font-size: 14px;
  color: #666;
}

.switch {
  position: relative;
  width: 50px;
  height: 30px;
  cursor: pointer;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--el-fill-color-light);
  border-radius: 15px;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input:checked + .slider {
  background-color: var(--theme-color);
  transition: background-color 0.3s ease;
}

input:checked + .slider:before {
  transform: translateX(20px);
  transition: transform 0.3s ease;
}

.arrow::after {
  content: '>';
  color: #999;
  font-size: 14px;
}
</style> 