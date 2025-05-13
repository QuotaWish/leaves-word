<script setup lang="ts">
import { useForm } from "alova/client";
import SettingsInput from "~/components/settings/SettingsInput.vue";
import { globalAuthStorage } from "~/modules/auth";
import { ToastEvent } from "../../../composables/event/toast-event";

const router = useRouter();
const originName = globalAuthStorage.value.user.userName ?? "";

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
  globalAuthStorage.value.user.userName = form.userName;

  sendToast(new ToastEvent("修改成功", "success"));

  await sleep(500);

  router.back();
});

onError(() => {
  sendToast(new ToastEvent("修改失败", "error"));
});
</script>

<template>
  <PageNavHolder loading-mask :loading="loading" title="修改我的昵称">
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
  </PageNavHolder>
</template>
