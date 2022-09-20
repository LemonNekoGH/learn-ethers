<script setup lang="ts">
import Swal from 'sweetalert2'
import { eth } from '../ethers'

const ethAmount = ref('')
const recipientAddress = ref('')

const go = async () => {
  try {
    // 连接钱包
    const account = await eth.send('eth_requestAccounts', [])
    console.log(account)
  }
  catch (e) {
    Swal.fire({
      toast: true,
      title: '你取消了连接钱包，无法继续操作',
    })
  }
}

const { t } = useI18n()
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>
    <p>
      <a rel="noreferrer" href="https://github.com/antfu/vitesse" target="_blank">
        Learn Ethers
      </a>
    </p>
    <p>
      <em text-sm opacity-75>本示例在 ETH Rinkeby 测试网上运行，你需要安装 MetaMask 才能继续。</em>
    </p>

    <div py-4 />

    <input
      id="input"
      v-model="ethAmount"
      placeholder="输入要发送的 ETH 数量"
      aria-label="输入要发送的 ETH 数量"
      type="number"
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
        btn m-3 text-sm
        :disabled="!ethAmount || !recipientAddress"
        @click="go"
      >
        {{ t('button.go') }}
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
