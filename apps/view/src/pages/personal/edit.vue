<script setup lang="ts">
import PageNavHolder from '~/components/page/holder/PageNavHolder.vue'
import PageSettingsSection from '~/components/display/settings/PageSettingsSection.vue'
import PageSettingsItem from '~/components/display/settings/PageSettingsItem.vue'
import { useDevMode } from '~/modules/develop'
import { useRouter } from 'vue-router'
import { globalAuthStorage } from '~/modules/auth'

// 导入开发者模式设置
const { devModeEnabled, toggleDevMode } = useDevMode()
const router = useRouter()

// 页面跳转函数
function navigateTo(path: string) {
  router.push(path)
}

// 跳转到开发者页面
function navigateToDeveloperPage() {
  navigateTo('/personal/develop')
}

// 跳转到主题设置页面
function navigateToThemePage() {
  navigateTo('/personal/theme')
}

// 默认广告状态
const noAdsEnabled = ref(false)

// 切换广告状态
function toggleNoAds(value: boolean) {
  noAdsEnabled.value = value
}
</script>

<template>
  <PageNavHolder :content-padding="false" class="SettingsPage" title="个人资料">
    <div class="SettingsPage-Container w-full h-full overflow-y-scroll flex flex-col p-4">
      <PageSettingsItem title="头像" desc="自定义头像" :show-arrow="true">
        <UserAvatar border-rounded size="64px" />
      </PageSettingsItem>

      <PageSettingsItem title="昵称" desc="自定义昵称" :show-arrow="true">
        <div class="PageSettingsItem-right mx-2">
          {{ globalAuthStorage.user.userName || '-' }}
        </div>
      </PageSettingsItem>

      <PageSettingsItem title="个性签名" desc="自定义个性签名" :show-arrow="true">
        <div class="PageSettingsItem-right mx-2">
          {{ globalAuthStorage.user.userProfile || '-' }}
        </div>
      </PageSettingsItem>

      <PageSettingsItem title="UnionID" desc="自定义唯一标识符" :show-arrow="true">
        <div class="PageSettingsItem-right mx-2">
          {{ globalAuthStorage.user.unionId || '-' }}
        </div>
      </PageSettingsItem>

      <PageSettingsItem title="IdentifyID" desc="自定义唯一标识符">
        <div class="PageSettingsItem-right mx-2">
          #{{ globalAuthStorage.user.id || '-' }}
        </div>
      </PageSettingsItem>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
</style>
