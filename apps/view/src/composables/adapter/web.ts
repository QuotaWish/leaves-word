export function useWebSizeAdapter() {
  const originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
  let scrollerHeight = '100%'

  tryOnMounted(() => {
    console.log(`Web Adapter initialized!`)
    const { height } = useWindowSize()

    const unwatch = watchEffect(() => {
      const _height = height.value

      //键盘弹起与隐藏都会引起窗口的高度发生变化
      const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      console.log("页面初始高度:" + originalHeight);
      console.log("软键盘弹起高度:" + resizeHeight);
      if (resizeHeight - 0 < originalHeight - 0) {
        //当软键盘弹起，在此处操作
        console.log("进入到软键盘弹起:");
        document.body.setAttribute('style', 'height:' + originalHeight + 'px;');
        scrollerHeight = `${resizeHeight}`;
      } else {
        //当软键盘收起，在此处操作
        console.log("进入到软键盘收起:");
        document.body.setAttribute('style', 'height:100%;');
        scrollerHeight = "100%";
      }
    })

    tryOnBeforeUnmount(() => {
      unwatch()
    })
  })
}