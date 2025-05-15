<script lang="ts">
interface LeafEvent {
  event: string;
  data: any;
}

// 根据不同环境设置不同的URL
const getEnvironmentUrl = (): string => {
  let baseUrl = "";
  baseUrl = "https://appx.leaf.tagzxia.com";

  // 添加query=builder参数
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}query=builder`;
};

let wv: any;
export default {
  name: 'LeafTiktokWebView',
  emits: ['ready'],
  data() {
  },
  methods: {
	  getUrl() {
		  return getEnvironmentUrl()
	  }
  }
}
</script>

<template>
	<web-view :src="getUrl()" />
</template>