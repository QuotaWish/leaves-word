import { useDeviceOrientation } from "@vueuse/core"

const { alpha, beta, gamma } = useDeviceOrientation()

export const angle = ref(0)

watchEffect(() => {
  $ignored: [alpha, beta, gamma]

  if (!alpha.value || !beta.value || !gamma.value) return angle.value = 0

  // y轴
  if (alpha.value >= 85) {
    angle.value = (beta.value > 0 ? 0 : 180)
  }

  // x轴
  if (beta.value >= 0 && beta.value <= 15) {
    angle.value = (gamma.value > 0 ? -1 : 1) * 90
  }
})

