<script setup lang="ts">
import PageNavHolder from "~/components/page/holder/PageNavHolder.vue";
import PageSettingsItem from "~/components/display/settings/PageSettingsItem.vue";
import { globalAuthStorage } from "~/modules/auth";
import { useLeafEventBus } from "~/composables/event";
import { TryAuthLogoutEvent } from "~/composables/event/auth";
import { ElMessageBox, ElMessage } from "element-plus";
import { nextTick } from 'vue';

const eventBus = useLeafEventBus();

async function handleEditNickname() {
  try {
    const { value } = await ElMessageBox.prompt('请输入新的昵称', '修改昵称', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: globalAuthStorage.user?.userName || '',
      inputValidator: (value) => {
        if (!value) return '昵称不能为空';
        if (value.length > 20) return '昵称长度不能超过20个字符';
        return true;
      }
    });
    
    if (value && value !== globalAuthStorage.user?.userName) {
      // 创建一个新的用户对象来触发响应式更新
      const updatedUser = JSON.parse(JSON.stringify(globalAuthStorage.value.user || {}));
      updatedUser.userName = value;
      globalAuthStorage.value.user = updatedUser;
      
      // 强制更新视图
      await nextTick();
      ElMessage.success('昵称修改成功');
    }
  } catch (err) {
    // 用户取消操作，不需要处理
  }
}

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
    <div class="SettingsPage-Container w-full h-full overflow-y-scroll flex flex-col p-4">
      <PageSettingsItem title="头像" desc="自定义头像" :show-arrow="true">
        <UserAvatar border-rounded size="64px" />
      </PageSettingsItem>

      <PageSettingsItem 
        title="昵称" 
        desc="自定义昵称" 
        :show-arrow="true"
        @click="handleEditNickname"
      >
        <div class="PageSettingsItem-right mx-2">
          {{ globalAuthStorage.user?.userName || "-" }}
        </div>
      </PageSettingsItem>

      <PageSettingsItem title="个性签名" desc="自定义个性签名" :show-arrow="true">
        <div class="PageSettingsItem-right mx-2">
          {{ globalAuthStorage.user.userProfile || "-" }}
        </div>
      </PageSettingsItem>

      <PageSettingsItem title="UnionID" desc="自定义唯一标识符" :show-arrow="true">
        <div class="PageSettingsItem-right mx-2">
          {{ globalAuthStorage.user.unionId || "-" }}
        </div>
      </PageSettingsItem>

      <PageSettingsItem title="IdentifyID" desc="自定义唯一标识符">
        <div class="PageSettingsItem-right mx-2">
          #{{ globalAuthStorage.user.id || "-" }}
        </div>
      </PageSettingsItem>

      <PageSettingsItem
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
