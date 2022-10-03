<script setup lang="ts">
import { storeToRefs } from 'pinia'
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

const user = useUserStore()
const { chainId } = storeToRefs(user)
</script>

<template>
  <!-- 如果网络不对就把整个界面盖住，直到网络切换 -->
  <div v-if="chainId && !user.isGoerliChain">
    <ConnectStatus />
  </div>
  <div v-else>
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

      <ConnectWallet />
    </div>
    <RouterView />
  </div>
</template>
