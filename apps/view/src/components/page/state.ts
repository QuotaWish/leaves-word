export class GlobalPageState {
  title: string = ""
}

export const useGlobalPageState = createGlobalState(
  () => {
    const pageState = ref(new GlobalPageState())

    return pageState
  }
)
