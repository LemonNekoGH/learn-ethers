<script setup lang="ts">
import Swal from 'sweetalert2'
import { ethers } from 'ethers'
const account = ref<string[]>([])
const currentChain = ref('')

// 处理网络变化事件
const handleChainChanged = (e: string) => {
  currentChain.value = e
}
// 处理账号变化事件
const handleAccountChanged = (e: string[]) => {
  account.value = e
}

const { provider } = (() => {
  if (!window.ethereum) {
    // 如果没有被注入变量，说明钱包扩展不存在
    return {
      provider: undefined,
    }
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  window.ethereum.addListener('chainChanged', handleChainChanged)
  window.ethereum.addListener('accountsChanged', handleAccountChanged)

  return {
    provider,
  }
})()

// 连接钱包
const connectToWallet = async () => {
  if (!provider) {
    // 如果没有被注入变量，说明钱包扩展不存在
    Swal.fire({
      text: '你没有安装任何一个兼容的 ETH 扩展钱包',
    })
    return
  }

  try {
    // 连接钱包
    const acct = await provider.send('eth_requestAccounts', [])
    account.value = acct
    currentChain.value = (await provider.getNetwork()).chainId.toString(16)
  }
  catch (e) {
    Swal.fire({
      text: '你取消了连接钱包',
    })
  }
}
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>
    <p>
      Learn Ethers
    </p>
    <p>
      <em text-sm opacity-75>本示例在 ETH Goerli 测试网上运行，你需要安装 ETH 钱包才能继续。</em>
    </p>
    <p>
      <em text-sm opacity-75>当前网络：{{ currentChain }}</em>
    </p>
    <!-- 显示已连接地址 -->
    <p v-for="acct of account" :key="acct">
      <em text-sm opacity-75>已连接：{{ acct }}</em>
    </p>

    <div>
      <button
        v-if="!account.length"
        btn m-3 text-sm
        @click="connectToWallet"
      >
        连接钱包
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

