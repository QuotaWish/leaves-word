<script setup lang="ts">
defineProps<{
  mock: boolean
}>()
</script>

<template>
  <div :class="{ mock }" class="transition-cubic SplashStatusbar">
    <div font-bold class="SplashStatusbar-Time">
      07:16
    </div>
    <div flex items-center class="SplashStatusbar-End gap-[6px]">
      <div class="signal">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 21q-1.05 0-1.775-.725T9.5 18.5t.725-1.775T12 16t1.775.725t.725 1.775t-.725 1.775T12 21m0-11q1.875 0 3.563.6t3.062 1.65q.5.375.513.988T18.7 14.3q-.425.425-1.05.438t-1.125-.338q-.95-.65-2.1-1.025T12 13t-2.425.375t-2.1 1.025q-.5.35-1.125.325t-1.05-.45q-.425-.45-.425-1.062t.5-.988q1.375-1.05 3.063-1.638T12 10m0-6q3.125 0 5.888 1.025t4.962 2.9q.5.425.525 1.05t-.425 1.075q-.425.425-1.05.438t-1.125-.388q-1.8-1.475-4.037-2.287T12 7t-4.737.813T3.225 10.1q-.5.4-1.125.388t-1.05-.438Q.6 9.6.625 8.975t.525-1.05q2.2-1.875 4.963-2.9T12 4"
          />
        </svg>
      </div>
      <div class="wifi">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M18.5 4c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-13c0-.83.67-1.5 1.5-1.5m-12 10c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5S5 19.33 5 18.5v-3c0-.83.67-1.5 1.5-1.5m6-5c.83 0 1.5.67 1.5 1.5v8c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-8c0-.83.67-1.5 1.5-1.5"
          />
        </svg>
      </div>
      <div class="battery">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
          <g fill="currentColor">
            <path d="M2 6h10v4H2z" />
            <path
              d="M2 4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm10 1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4 3a1.5 1.5 0 0 1-1.5 1.5v-3A1.5 1.5 0 0 1 16 8"
            />
          </g>
        </svg>
      </div>
    </div>

    <div class="SplashStatusbar-DynamicIsland" />
  </div>
</template>

<style lang="scss" scoped>
.SplashStatusbar {
  &-End {
    svg {
      width: 1.5em;
      height: 1.5em;
    }
  }
  z-index: 1000;
  position: absolute;
  padding: 0.5rem 1.5rem;

  top: 0;

  width: 100%;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  opacity: 0;
  pointer-events: none;

  &.mock {
    opacity: 1;
  }
}

.SplashStatusbar-DynamicIsland {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 30%;
  height: 30px;

  border-radius: 20px;
  background-color: #000;

  transform: translate(-50%, -50%);
}
</style>
