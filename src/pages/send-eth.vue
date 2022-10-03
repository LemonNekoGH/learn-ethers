<script setup lang="ts">
import Swal from 'sweetalert2'
import { ethers } from 'ethers'
import { storeToRefs } from 'pinia'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { getProvider } from '~/utils/eth'

const ethAmount = ref('')
const recipientAddress = ref('')

const user = useUserStore()
const { address, providerName } = storeToRefs(user)

// 用 WalletConnect 发起转账请求
const transferByWalletConnect = async () => {
  // Create a connector
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org', // Required
    qrcodeModal: QRCodeModal,
  })
  // 发送交易
  try {
    const tx = await connector.sendTransaction({
      from: address.value[0],
      to: recipientAddress.value,
      // 需要转换成 hex string
      value: ethers.utils.parseEther(ethAmount.value).toHexString(),
    })
    Swal.fire({
      text: `发送交易成功 ${JSON.stringify(tx)}`,
    })
  }
  catch (e) {
    Swal.fire({
      text: `发送交易出错 ${(e as Error).message}`,
    })
  }
}
// 用扩展钱包发起转账请求
const transferByExtensionWallet = async () => {
  const p = getProvider(providerName.value!)
  if (!p) {
    // 如果没有被注入变量，说明钱包扩展不存在
    Swal.fire({
      text: `你没有安装 ${providerName.value}`,
    })
    return
  }
  const provider = new ethers.providers.Web3Provider(p)
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
      text: `交易已确认 ${tx.hash}`,
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

// 开始转账
const transfer = async () => {
  // 如果已经通过 Wallet Connect 连接了，就使用 Wallet Connect 的转账方式
  if (providerName.value && providerName.value === 'Wallet Connect')
    transferByWalletConnect()

  else transferByExtensionWallet()
}
</script>

<template>
  <div>
    <ConnectStatus />

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
      <ConnectWallet v-if="!address.length" />
      <button
        btn m-3 text-sm
        @click="transfer"
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
