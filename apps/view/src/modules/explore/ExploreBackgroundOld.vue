<script setup lang="ts">
import { ref } from 'vue'

const location = ref('杭州')
const menuItems = ref([
  { icon: '📦', text: '抢单大厅' },
  { icon: '🚗', text: '车辆管理' },
  { icon: '📅', text: '日程安排' },
  { icon: '💰', text: '保险理赔' },
  { icon: '💬', text: '帮助中心' },
])

const bannerText = '填问卷 抽奖品!'
const bannerSubText = '投放平台满意度调查，欢迎你的建议与反馈'
</script>

<template>
  <div class="ExploreBackground absolute-layout">
    <!-- Header -->
    <div class="header">
      <div class="location">
        <span>{{ location }}</span>
        <span class="arrow-down">▼</span>
      </div>
      <div class="header-icons">
        <span class="search">🔍</span>
        <span class="notification">👤</span>
      </div>
    </div>

    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <div class="banner-text">
          <h3>{{ bannerText }}</h3>
          <p>{{ bannerSubText }}</p>
        </div>
        <button class="participate-btn">
          立即参与
        </button>
      </div>
    </div>

    <!-- Menu Grid -->
    <div class="menu-grid">
      <div v-for="(item, index) in menuItems" :key="index" class="menu-item">
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-text">{{ item.text }}</span>
      </div>
    </div>

    <!-- Additional Content -->
    <div class="content-cards">
      <div class="report-card">
        <h4>行业报告</h4>
        <p>2021年行业报告</p>
      </div>
      <div class="rewards-card">
        <h4>推荐有礼</h4>
        <p>分享获得增增奖励金</p>
      </div>
    </div>

    <!-- Order List -->
    <div class="order-list">
      <div class="order-filters">
        <span class="active filter">智能模式</span>
        <span class="filter">离我最近</span>
        <span class="filter">价格最优</span>
        <span class="filter">时间优先</span>
      </div>

      <div class="order-item">
        <div class="route">
          <span>杭州 富阳</span>
          <span class="arrow">→</span>
          <span>温州 龙湾</span>
        </div>
        <div class="specs">
          <span class="size">2.7/4.2/6.8米</span>
          <span class="type">平板/厢式/高栏</span>
        </div>
        <div class="details">
          <div class="time">
            9月15日上午10:00装货
          </div>
          <div class="capacity">
            可口可乐 | 40吨
          </div>
        </div>
        <div class="price-action">
          <span class="price">2000元/趟</span>
          <button class="grab-btn">
            立即抢单
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="bottom-nav">
      <div class="active nav-item">
        <span class="nav-icon">📦</span>
        <span>抢单</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon">🚚</span>
        <span>运单</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon">📱</span>
        <span>消息</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon">👤</span>
        <span>我的</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ExploreBackground {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  max-width: 480px;
  margin: 0 auto;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
}

.location {
  font-size: 16px;
  font-weight: 500;
}

.header-icons span {
  margin-left: 16px;
  font-size: 20px;
}

.banner {
  margin: 12px;
  background: #e8f0ff;
  border-radius: 12px;
  padding: 16px;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.participate-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 16px;
  background: white;
  margin-top: 12px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.menu-icon {
  font-size: 24px;
}

.menu-text {
  font-size: 12px;
}

.content-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 16px;
}

.report-card,
.rewards-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
}

.order-list {
  background: white;
  margin-top: 12px;
  padding: 16px;
}

.order-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.filter {
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 14px;
}

.filter.active {
  background: #e8f0ff;
  color: #1a73e8;
}

.order-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
}

.route {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.specs {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.details {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.price-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f44336;
  font-weight: 500;
}

.grab-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 8px 0;
  border-top: 1px solid #eee;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.nav-icon {
  font-size: 20px;
}

.nav-item.active {
  color: #1a73e8;
}
</style>
