<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import PageNavHolder from "~/components/page/holder/PageNavHolder.vue";
import { useLeafEventBus } from "~/composables/event";
import { TryAuthLogoutEvent } from "~/composables/event/auth";
import { globalAuthStorage } from "~/modules/auth";

const router = useRouter();
const eventBus = useLeafEventBus();

function handleLogout() {
  ElMessageBox.confirm("确定退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    eventBus.fireEvent(new TryAuthLogoutEvent());
  });
}
</script>

<template>
  <PageNavHolder :content-padding="false" class="SettingsPage" title="个人资料">
    <div
      class="SettingsPage-Container h-full w-full flex flex-col overflow-y-scroll p-4"
    >
      <SettingsItem title="头像" desc="自定义头像" :show-arrow="true">
        <UserAvatar border-rounded size="64px" />
      </SettingsItem>

      <SettingsItem
        title="昵称"
        desc="自定义昵称"
        :show-arrow="true"
        @click="router.push('/personal/edit/name')"
      >
        <div class="SettingsItem-right mx-2">
          {{ globalAuthStorage.user?.userName || "-" }}
        </div>
      </SettingsItem>

      <SettingsItem
        title="个性签名"
        desc="自定义个性签名"
        :show-arrow="true"
        @click="router.push('/personal/edit/profile')"
      >
        <div class="SettingsItem-right mx-2">
          {{ globalAuthStorage.user.userProfile || "-" }}
        </div>
      </SettingsItem>

      <SettingsItem title="UnionID" desc="自定义唯一标识符" :show-arrow="true">
        <div class="SettingsItem-right mx-2">
          {{ globalAuthStorage.user.unionId || "-" }}
        </div>
      </SettingsItem>

      <SettingsItem title="IdentifyID" desc="自定义唯一标识符">
        <div class="SettingsItem-right mx-2">
          #{{ globalAuthStorage.user.id || "-" }}
        </div>
      </SettingsItem>

      <SettingsItem
        danger
        title="退出登录"
        desc="退出登录"
        :show-arrow="true"
        @click="handleLogout"
      />
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped></style>
