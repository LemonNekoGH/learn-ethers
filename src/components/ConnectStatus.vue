<script lang="ts" setup>
import { storeToRefs } from 'pinia'

const user = useUserStore()
const { address, chainId } = storeToRefs(user)
</script>

<template>
  <div text-4xl>
    <div i-carbon-campsite inline-block />
  </div>
  <p>
    Learn Ethers
  </p>
  <p>
    <em text-sm opacity-75>本示例在 ETH Goerli 测试网上运行。</em>
  </p>

  <p>
    <em text-sm opacity-75>当前网络：{{ chainId }}</em>
  </p>

  <p v-if="chainId && !user.isGoerliChain">
    <em text-sm opacity-75>请切换至 Goerli 网络</em>
  </p>

  <!-- 显示已连接地址 -->
  <p v-for="acct of address" :key="acct">
    <em text-sm opacity-75>已连接：{{ acct }}</em>
  </p>
</template>
