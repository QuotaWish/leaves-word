<script setup lang="ts">
const props = defineProps<{
  icon: string,
  active: boolean
}>()

</script>

<template>
  <div class="FooterButton" :class="{ active }">
    <span class="button-icon" v-html="icon" />
    <span class="button-main">
      <slot />
    </span>
  </div>
</template>

<style>
.FooterButton {
  padding: .75rem .75rem;

  width: 56px;
  height: 56px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transition: .25s;
  color: #262626F0;
  border-radius: 8px;
  box-sizing: border-box;
}

.FooterButton.active {
  color: #262626;
  background-color: #e6e6e680;
}

.FooterButton.active .button-icon {
  transform: translateY(50%) scale(1.25);
}

.FooterButton.active .button-icon {
  transition: .25s;
}

.FooterButton.active .button-main {
  opacity: 0;
  transform: translateY(10%);
}

.FooterButton .button-main {
  transition: .25s;
}

.FooterButton .button-icon svg {
  width: 90%;
  height: 90%;
}
</style>
