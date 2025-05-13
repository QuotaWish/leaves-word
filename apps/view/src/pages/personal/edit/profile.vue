<script setup lang="ts">
import { useForm } from "alova/client";
import { showFailToast, showSuccessToast } from "vant";

import SettingsInput from "~/components/settings/SettingsInput.vue";
import { globalAuthStorage } from "~/modules/auth";

const router = useRouter();
const originProfile = globalAuthStorage.value.user.userProfile ?? "";

const { loading, form, send, onSuccess, onError } = useForm(
  (formData: any) =>
    Apis.userController.updateMyUserUsingPOST({
      data: formData,
    }),
  {
    initialForm: {
      userAvatar: globalAuthStorage.value.user.userAvatar,
      userName: globalAuthStorage.value.user.userName,
      userProfile: originProfile,
    },
  },
);

onSuccess(async () => {
  globalAuthStorage.value.user.userProfile = form.value.userProfile;

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
    title="修改我的个性签名"
  >
    <template #action>
      <el-button
        link
        :disabled="originProfile === form.userProfile"
        type="primary"
        @click="send"
      >
        保存
      </el-button>
    </template>

    <SettingsInput
      v-model="form.userProfile"
      placeholder="输入你的个性签名"
      :max="30"
    >
      <template #mention> {{ form.userProfile.length }}/30字 </template>
    </SettingsInput>
    <p px-2 text-sm op-75>
      *您的个性签名将在社交，打卡，查看个人资料时用作展示
    </p>
  </PageNavHolder>
</template>
