<script setup lang="ts">
import { ref, provide } from 'vue'

const isExpanded = ref(false)

const toggleDrawer = () => {
  isExpanded.value = !isExpanded.value
}

provide('drawerControl', {
  isExpanded,
  toggleDrawer,
  expand: () => isExpanded.value = true,
  collapse: () => isExpanded.value = false
})
</script>

<template>
  <RoutePage class="DrawerPage">
    <div class="DrawerPage-Main">
      <slot name="main" />
      <button class="close-button" @click="$emit('close')">关闭</button>
    </div>
    <div class="DrawerPage-Drawer" :class="{ expanded: isExpanded }">
      <div class="DrawerPage-Drawer-Content fake-background">
        <div class="drawer-decoration-bar" />
        <slot name="drawer" />
      </div>
    </div>

    <template #bg>
      <slot name="bg" />
    </template>
  </RoutePage>
</template>

<style lang="scss" scoped>
.DrawerPage {
  .close-button {
    position: absolute;
    top: 24px;
    right: 24px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 200;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &-Main {
    z-index: 10;
    position: absolute;

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &-Drawer {
    &-Content {
      position: relative;
      
      .drawer-decoration-bar {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 6px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        opacity: 0.75;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
      }
      padding-top: 32px;

      overflow: hidden;
      --fake-opacity: 0.75;
      backdrop-filter: blur(18px) saturate(180%);
      border-radius: 28px 28px 0 0;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    z-index: 100;
    position: relative;
    padding-top: calc(180% - 0px);

    width: 100%;
    height: 100%;

    overflow-y: scroll;
    overflow-x: hidden;

    &.expanded {
      padding-top: 50%;
      .DrawerPage-Drawer-Content {
        transform: translateY(0);
      }
    }
  }
}
</style>