<script setup lang="ts">
import { globalAuthStorage } from '~/modules/auth'

const userInfo = computed(() => globalAuthStorage.value.user)

const cardNumber = computed(() => {
  const text = userInfo.value.id?.toString().split('').reverse().join('')

  const result = text?.replace(/(\d{4})(?=\d)/g, '$1 ')

  return result
})

const cardExpireDate = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  return date.toLocaleDateString()
})
</script>

<template>
  <div class="CardCarousel">
    <div class="container">
      <div class="box">
        <span class="title">Leaf Games</span>
        <div>
          <strong>游戏唯一身份认证卡</strong>
          <p>{{ cardNumber }}</p>
          <span>有效至</span> <span>{{ cardExpireDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.CardCarousel {
  position: relative;
  margin: 1rem 0;

  width: 94%;
  height: 180px;
}

.container {
  color: #fff;
  position: relative;
  font-family: sans-serif;

  border-radius: 8px;
  background-color: #0f0f0fe0;
  backdrop-filter: blur(18px) saturate(180%);
}

.container::before,
.container::after {
  content: '';
  background-color: #fab5704c;
  position: absolute;
}

.container::before {
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  top: 30%;
  right: 7%;
}

.container::after {
  content: '';
  position: absolute;
  height: 3rem;
  top: 8%;
  right: 5%;
  border: 1px solid;
}

.container .box {
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.074);
  border: 1px solid rgba(255, 255, 255, 0.222);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-radius: 0.7rem;
  transition: all ease 0.3s;
}

.container .box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.container .box .title {
  font-size: 2rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.container .box div strong {
  display: block;
  margin-bottom: 0.5rem;
}

.container .box div p {
  margin: 0;
  font-size: 0.9em;
  font-weight: 300;
  letter-spacing: 0.1em;
}

.container .box div span {
  font-size: 0.7rem;
  font-weight: 300;
}

.container .box div span:nth-child(3) {
  font-weight: 500;
  margin-right: 0.2rem;
}

.container .box:hover {
  box-shadow: 0px 0px 20px 1px #ffbb763f;
  border: 1px solid rgba(255, 255, 255, 0.454);
}
</style>
