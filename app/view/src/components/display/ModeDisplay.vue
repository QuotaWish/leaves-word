<script setup lang="ts">
import type { ISignMode } from "~/composables/words/mode";

const props = defineProps<{
  mode: ISignMode<any, any>;
}>();

const mainColor = computed(() => props.mode.getMainColor());
</script>

<template>
  <div class="ModeDisplay fake-background transition-cubic">
    <div class="ModeDisplay-Main">
      <div class="ModeDisplay-Main-Icon">
        <div class="ModeDisplay-Main-Icon-Inner">
          {{ props.mode.getModeIcon() }}
        </div>
      </div>

      <div class="ModeDisplay-Main-Text">
        <p class="font-size-4 font-bold">
          {{ props.mode.getModeName() }}
        </p>

        <p class="text-sm">
          {{ props.mode.getModeDesc() }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.ModeDisplay-Main {
  &-Text {
    margin-top: 1rem;

    color: #fff;

    text-align: center;

    transform: translateY(0);
    transition: 0.5s 0.1s;
  }

  &-Icon {
    position: relative;
    display: flex;

    width: 64px;
    height: 64px;

    font-size: 2rem;
    align-items: center;
    justify-content: center;

    border-radius: 18px;
    filter: invert(0.2) brightness(1.35);
    background-color: v-bind(mainColor);

    transform: scale(0.95);
    transition: cubic-bezier(0.075, 0.82, 0.165, 1) 0.25s 0.1s;
  }
  position: relative;
  padding: 1rem;
  display: flex;

  align-items: center;
  flex-direction: column;
}

.ModeDisplay {
  &::before {
    content: "";
    position: absolute;

    top: 0;
    left: 20%;

    width: 60%;
    height: 10px;

    filter: invert(0.2) brightness(1.35);
    border-radius: 0 0 18px 18px;
    background-color: v-bind(mainColor);
  }
  &::after {
    opacity: 0.75;
    filter: blur(5px);
    border-radius: 18px;
    box-shadow: 0 0 4px 1px v-bind(mainColor);
    background-color: v-bind(mainColor);
  }
  position: relative;
  margin: auto;
  padding: 1rem;

  width: 193px;
  height: 258px;

  overflow: hidden;
  border-radius: 18px;
  background-color: v-bind(mainColor);

  .el-carousel__item & {
    opacity: 0.75;
  }

  .el-carousel__item.is-active & {
    .ModeDisplay-Main-Text {
      transform: translateY(0.5rem);
    }
    .ModeDisplay-Main-Icon {
      transform: scale(1.125);
    }
    opacity: 1;
  }
}
</style>
