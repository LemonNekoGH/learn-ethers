<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})

const route = useRoute()

const routes = ref<{
  name: string
  to: string
}[]>([
  { name: '首页', to: '/' },
  { name: '连接钱包', to: '/connect-wallet' },
  { name: '发送 ETH', to: '/send-eth' },
  { name: '发送其它代币', to: '/send-token' },
])
</script>

<template>
  <div flex gap-x-10px p-10px b-black border-b-2px>
    <!-- 页面切换 -->
    <RouterLink v-for="r of routes" :key="r.name" :to="r.to">
      <button
        b-black b-2px px-10px :class="{
          'bg-black text-white': r.to === route.path,
        }"
      >
        {{ r.name }}
      </button>
    </RouterLink>
  </div>
  <RouterView />
</template>
