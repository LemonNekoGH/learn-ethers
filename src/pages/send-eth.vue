<script setup lang="ts">
import Swal from 'sweetalert2'
import { ethers } from 'ethers'
const ethAmount = ref('')
const recipientAddress = ref('')
const account = ref<string[]>([])
const currentChain = ref<ethers.providers.Network>()

// 连接钱包
const connectToWallet = async () => {
  if (!window.ethereum) {
    // 如果没有被注入变量，说明钱包扩展不存在
    Swal.fire({
      text: '你没有安装任何一个兼容的 ETH 扩展钱包',
    })
    return
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  try {
    // 连接钱包
    const acct = await provider.send('eth_requestAccounts', [])
    account.value = acct

    // 获取当前链名称
    currentChain.value = await provider.getNetwork()
  }
  catch (e) {
    Swal.fire({
      text: '你取消了连接钱包',
    })
  }
}

// 开始转账
const go = async () => {
  if (!window.ethereum) {
    // 如果没有被注入变量，说明钱包扩展不存在
    Swal.fire({
      text: '你没有安装任何一个兼容的 ETH 扩展钱包',
    })
    return
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  // 获取签名者
  const signer = provider.getSigner()
  try {
    // 发送交易
    const tx = await signer.sendTransaction({
      to: recipientAddress.value,
      value: ethers.utils.parseEther(ethAmount.value),
    })
    Swal.fire({
      text: `交易已发送 ${tx.hash}`,
    })
    // 等待至少两个区块确认
    await tx.wait(2)
    Swal.fire({
      text: `交易已发送 ${tx.hash}`,
    })
  }
  catch (e) {
    const error = e as Error
    if (error.message.includes('reject')) {
      // 交易被拒绝
      Swal.fire({
        text: '你拒绝了交易',
      })
    }
    else if (error.message.includes('too many decimal points')) {
      // 通证数量格式不正确
      Swal.fire({
        text: '通证数量格式不正确',
      })
    }
    else {
      // 其它错误
      Swal.fire({
        text: `交易发送失败 ${error.message}`,
      })
    }
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
      <em text-sm opacity-75>当前网络：{{ currentChain?.name }}</em>
    </p>
    <!-- 显示已连接地址 -->
    <p v-for="acct of account" :key="acct">
      <em text-sm opacity-75>已连接：{{ acct }}</em>
    </p>

    <div py-4 />

    <input
      id="input"
      v-model="ethAmount"
      placeholder="输入要发送的 ETH 数量"
      aria-label="输入要发送的 ETH 数量"
      type="text"
      autocomplete="false"
      p="x4 y2"
      w="250px"
      text="center"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
    >
    <label class="hidden" for="input">输入要发送的 ETH 数量</label>
    <br>
    <input
      id="input2"
      v-model="recipientAddress"
      placeholder="输入接收地址"
      aria-label="输入接收地址"
      type="text"
      autocomplete="false"
      p="x4 y2"
      w="250px"
      text="center"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
    >
    <label class="hidden" for="input2">输入接收地址</label>

    <div>
      <button
        v-if="!account.length"
        btn m-3 text-sm
        @click="connectToWallet"
      >
        连接钱包
      </button>
      <!-- 需要确保在 goerli 测试网，才能转账 -->
      <button
        btn m-3 text-sm
        :disabled="!account.length || !ethAmount || !recipientAddress || currentChain?.name !== 'goerli'"
        @click="go"
      >
        开始转账
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
