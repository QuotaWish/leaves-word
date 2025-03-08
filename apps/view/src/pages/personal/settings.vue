<script setup lang="ts">
import PageNavHolder from '~/components/page/holder/PageNavHolder.vue'
</script>

<template>
  <PageNavHolder class="SettingsPage" title="个人设置">
    <div class="SettingsPage-Container flex flex-col gap-3">
      <!-- 主题与皮肤 -->
      <div class="SettingsPage-Section">
        <LineArrow>
          <template #icon>
            <div i-carbon:paint-brush />
          </template>
          主题与皮肤
        </LineArrow>
        <div class="SettingsPage-SectionItem">
          <div class="SettingsPage-SectionItem-content">
            <div class="SettingsPage-SectionItem-title">
              主题切换
            </div>
            <div class="theme-preview">
              <div class="theme-option theme-light" />
              <div class="theme-option theme-dark" />
              <div class="theme-option theme-blue" />
            </div>
          </div>
          <span class="arrow" />
        </div>
        <div class="SettingsPage-SectionItem">
          <div class="SettingsPage-SectionItem-content">
            <div class="SettingsPage-SectionItem-title">
              皮肤定制
            </div>
            <div class="SettingsPage-SectionItem-desc">
              自定义颜色、字体和背景
            </div>
          </div>
          <span class="arrow" />
        </div>
      </div>

      <!-- 基础设置 -->
      <div class="SettingsPage-Section">
        <LineArrow>
          <template #icon>
            <div i-carbon:settings />
          </template>
          基础设置
        </LineArrow>
        <div class="SettingsPage-SectionItem">
          <div class="SettingsPage-SectionItem-content">
            <div class="SettingsPage-SectionItem-title">
              通知设置
            </div>
            <div class="SettingsPage-SectionItem-desc">
              管理消息接收方式
            </div>
          </div>
          <span class="arrow" />
        </div>
        <div class="SettingsPage-SectionItem">
          <div class="SettingsPage-SectionItem-content">
            <div class="SettingsPage-SectionItem-title">
              隐私设置
            </div>
            <div class="SettingsPage-SectionItem-desc">
              数据安全与权限管理
            </div>
          </div>
          <span class="arrow" />
        </div>
      </div>

      <!-- 广告与推广 -->
      <div class="SettingsPage-Section">
        <LineArrow>
          <template #icon>
            <div i-carbon:share />
          </template>
          广告与推广
        </LineArrow>
        <div class="SettingsPage-SectionItem">
          <div class="SettingsPage-SectionItem-content">
            <div class="SettingsPage-SectionItem-title">
              无广告订阅
            </div>
            <div class="SettingsPage-SectionItem-desc">
              提升学习体验
            </div>
          </div>
          <label class="switch">
            <input type="checkbox">
            <span class="slider" />
          </label>
        </div>
        <div class="SettingsPage-SectionItem">
          <div class="SettingsPage-SectionItem-content">
            <div class="SettingsPage-SectionItem-title">
              活动海报
            </div>
            <div class="SettingsPage-SectionItem-desc">
              查看最新平台活动
            </div>
          </div>
          <span class="arrow" />
        </div>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.SettingsPage-Container {
  width: 100%;
  height: 100%;

  overflow-y: scroll;
}

.SettingsPage-Section {
  border-radius: 15px;
  background: var(--el-fill-color-light);
}

.SettingsPage-Section-title {
  padding: 10px 0; // 调整内边距
  font-size: 16px; // 增加字体大小
  color: #333; // 改变文字颜色
  border-bottom: 1px solid #eee;
  position: sticky; // 添加 sticky 样式
  top: 0; // 添加 top 样式
  background: #fff; // 添加背景色以避免与内容重叠
  z-index: 1; // 确保标题在内容之上
}

.SettingsPage-SectionItem {
  padding: 1rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color-light);
}

.SettingsPage-SectionItem:last-child {
  border-bottom: none;
}

.SettingsPage-SectionItem-content {
  flex-grow: 1;
}

.SettingsPage-SectionItem-title {
  font-size: 16px;
  margin-bottom: 5px; // 调整间距
}

.SettingsPage-SectionItem-desc {
  font-size: 14px; // 增加字体大小
  color: #666;
}

.switch {
  position: relative;
  width: 50px;
  height: 30px;
  cursor: pointer; // 添加鼠标指针样式
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

.theme-preview {
  display: flex;
  gap: 15px;
}

.theme-option {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 2px solid var(--el-border-color-light);
  transition: border-color 0.3s ease;
}

.theme-option:hover {
  border-color: var(--theme-color-dark);
}

.theme-light {
  background: #ffffff;
}

.theme-dark {
  background: #1a1a1a;
}

.theme-blue {
  background: var(--theme-color);
}
</style>
