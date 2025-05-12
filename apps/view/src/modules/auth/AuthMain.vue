<script setup lang="ts">
import { useRequest } from 'alova/client'
import Fingerprint2 from 'fingerprintjs2'
import Apis from '~/composables/api/clients'

const options = reactive({
  platform: '',
  fingerprint: '',
  identifier: '',
  certificate: '',
})

Fingerprint2.get((components: any) => {
  const values = components.map((component: any, index: any) => {
    if (component.key === 'platform') {
      options.platform = component.value
    }

    if (index === 0) {
      // 把微信浏览器里UA的wifi或4G等网络替换成空,不然切换网络会ID不一样
      return {
        key: component.key,
        value: component.value.replace(/\bNetType\/\w+\b/, ''),
      };
    }

    return component
  });
  const murmur = Fingerprint2.x64hash128(values.join(''), 31);

  options.fingerprint = murmur;
});

const { send, loading } = useRequest(() => Apis.userController.userLoginTokenUsingPOST({
  data: {
    platform: "VIEW",
    deviceId: options.fingerprint,
    deviceType: options.platform,
    userAccount: options.identifier,
    userPassword: options.certificate,
  },
  meta: {
    authRole: 'login',
  },
}), {
  immediate: false,
})

async function handleAuth(event: Event) {
  event.preventDefault()

  if (!options.identifier || !options.certificate)
    return

  await send()
}
</script>

<template>
  <div v-loading="loading" class="AuthMain h-full w-full">
    <div class="AuthMain-Inner fake-background">
      <h1 class="title">
        登录
      </h1>
      <form class="login-form">
        <div class="input-group">
          <input id="username" v-model="options.identifier" type="text" name="username" required>
          <label for="username">用户名</label>
          <div class="input-line" />
        </div>
        <div class="input-group">
          <input id="password" v-model="options.certificate" type="password" name="password" required>
          <label for="password">密码</label>
          <div class="input-line" />
        </div>
        <button type="submit" class="submit-btn" @click="handleAuth">
          登录
        </button>
      </form>
      <div class="agreement-text">
        <p>
          未注册账号会自动注册
        </p>
        <p>
          登录即代表你同意
          <a href="https://protocol.quotawish.com" class="agreement-link">用户协议</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.AuthMain {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  width: 100%;
  height: 50%;
  min-height: 450px;

  left: 0;
  bottom: 0;

  overflow: hidden;
  border-radius: 38px 38px 0 0;

  &-Inner {
    padding: 2rem 2.5rem;
    width: 100%;
    height: 100%;
    --fake-opacity: 0.85;
    --fake-color: var(--el-bg-color);
    backdrop-filter: blur(18px) saturate(180%);
  }
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--theme-color-primary);
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  position: relative;
  margin-bottom: 1rem;

  input {
    width: 100%;
    padding: 0.8rem 0;
    font-size: 1rem;
    border: none;
    background: transparent;
    outline: none;
    color: var(--theme-color-primary);

    &:focus+label,
    &:not(:placeholder-shown)+label {
      transform: translateY(-1.5rem) scale(0.85);
      color: var(--theme-color-primary);
    }

    &:focus~.input-line::after {
      transform: scaleX(1);
    }
  }

  label {
    position: absolute;
    left: 0;
    top: 0.8rem;
    color: #7f8c8d;
    transform-origin: 0 0;
    transition:
      transform 0.3s ease,
      color 0.3s ease;
    pointer-events: none;

    font-size: 18px;
  }

  .input-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #e0e0e0;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--theme-color-primary);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
  }
}

.submit-btn {
  margin-top: 1rem;
  padding: 0.8rem;
  font-size: 1rem;
  color: white;
  background: var(--theme-color-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
}

.agreement-text {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.agreement-link {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
}
</style>
