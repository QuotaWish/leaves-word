<script setup lang="ts">
import { useForm } from "alova/client";
import { showFailToast, showSuccessToast } from "vant";

import SettingsInput from "~/components/settings/SettingsInput.vue";
import { globalAuthStorage } from "~/modules/auth";

const router = useRouter();
let originName = globalAuthStorage.value.user.userName ?? "";

const { loading, form, send, onSuccess, onError } = useForm(
  (formData: any) =>
    Apis.userController.updateMyUserUsingPOST({
      data: formData,
    }),
  {
    initialForm: {
      userAvatar: globalAuthStorage.value.user.userAvatar,
      userName: originName,
      userProfile: globalAuthStorage.value.user.userProfile,
    },
  },
);

onSuccess(async () => {
  globalAuthStorage.value.user.userName = form.value.userName;

  originName = form.value.userName;

  showSuccessToast("修改成功");

  await sleep(1400);

  router.back();
});

onError(() => {
  showFailToast("修改失败");
});
</script>

<template>
  <PageNavHolder
    :content-padding="false"
    loading-mask
    :loading="loading"
    title="修改我的昵称"
  >
    <template #action>
      <el-button
        @click="send"
        link
        :disabled="originName === form.userName"
        type="primary"
      >
        保存
      </el-button>
    </template>

    <SettingsInput v-model="form.userName" placeholder="输入你的昵称" :max="10">
      <template #mention> {{ form.userName.length }}/10字 </template>
    </SettingsInput>
    <p px-2 text-sm op-75>*您的昵称将在社交，打卡，分享时用作展示</p>
  </PageNavHolder>
</template>
