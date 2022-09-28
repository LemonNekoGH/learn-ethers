<script setup lang="ts">
import Swal from 'sweetalert2'
import { ethers } from 'ethers'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

const account = ref<string[]>([])
const currentChain = ref('')

const providerNames = ['MetaMask', 'Coinbase Wallet', 'Trust Wallet', 'Binance Wallet', 'Wallet Connect'] as const
type ProviderName = typeof providerNames[number]
const providerMap: Record<Exclude<ProviderName, 'Binance Wallet' | 'Wallet Connect'>, string> = {
  'MetaMask': 'isMetaMask',
  'Trust Wallet': 'isTrustWallet',
  'Coinbase Wallet': 'isCoinbaseWallet',
}

// 处理网络变化事件
const handleChainChanged = (e: string) => {
  currentChain.value = e
}
// 处理账号变化事件
const handleAccountChanged = (e: string[]) => {
  account.value = e
}

/**
 * 从注入的 window.ethereum 中取出需要的提供者
 * @param property 用于检测是否是需要的那个
 */
const getProvider = (property: ProviderName): MyProvider | undefined => {
  // 标准钱包连接
  if (property === 'Wallet Connect')
    return

  // 币安钱包不使用标准的 window.ethereum
  if (property === 'Binance Wallet') {
    if (window.BinanceChain)
      return window.BinanceChain

    return
  }
  // 检测标准的 window.ethereum
  if (!window.ethereum)
    return

  // 有多个钱包
  // 先检查多个钱包的情况，因为如果多个钱包都注入了 window.ethereum 变量，isMetaMask 或者其它的属性都可能为 true，但是调用起来的并不一定是 MetaMask
  if (window.ethereum.providers) {
    for (const p of window.ethereum.providers) {
      if (p[providerMap[property]])
        return p
    }
  }

  // 检测是否是需要的提供者
  if (window.ethereum[providerMap[property]])
    return window.ethereum
}

/**
 * 使用 WalletConnect 开源协议进行连接
 * https://docs.walletconnect.com/quick-start/dapps/client
 */
const connectToWalletConnect = async () => {
// Create a connector
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org', // Required
    qrcodeModal: QRCodeModal,
  })
  // 如果没有连接，尝试连接
  if (!connector.connected) {
    connector.createSession()
  }
  else {
    // 已连接，直接获取账户信息
    account.value = connector.accounts
    currentChain.value = connector.chainId.toString(16)
  }

  // 监听连接事件
  connector.on('connect', (err, payload) => {
    if (err) {
      Swal.fire({ text: `WalletConnect 连接失败 ${err.message}` })
      return
    }
    account.value = payload.params[0].accounts
    currentChain.value = payload.params[0].chainId
  })
  // 监听断开事件
  connector.on('disconnect', (err, payload) => {
    if (err) {
      Swal.fire({ text: `WalletConnect 连接失败 ${err.message}` })
      return
    }
    // 移除账户和网络信息
    account.value = []
    currentChain.value = ''
  })
  // 监听会话更新事件
  // 当切换网络或者账户时会触发
  connector.on('session_update', (err, payload) => {
    if (err) {
      Swal.fire({ text: `WalletConnect 连接失败 ${err.message}` })
      return
    }
    account.value = payload.params[0].accounts
    currentChain.value = payload.params[0].chainId
  })
}

/**
 * 连接钱包
 * @param property 用于检测是否已安装钱包
 */
const connectToWallet = async (providerName: ProviderName) => {
  if (providerName === 'Wallet Connect') {
    connectToWalletConnect()
    return
  }
  const p = getProvider(providerName)
  if (!p) {
    // 如果没有被注入变量，说明钱包扩展不存在
    Swal.fire({
      text: `你没有安装${providerName}`,
    })
    return
  }

  try {
    // 连接钱包
    const provider = new ethers.providers.Web3Provider(p)
    const acct = await provider.send('eth_requestAccounts', [])
    account.value = acct
    currentChain.value = (await provider.getNetwork()).chainId.toString(16)
    // 监听需要的事件
    // window.BinanceChain 不支持 addListener 别名
    p.on('chainChanged', handleChainChanged)
    p.on('accountsChanged', handleAccountChanged)
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
      <div v-if="!account.length">
        <button
          v-for="(name, i) in providerNames"
          :key="i" btn m-3
          text-sm
          @click="connectToWallet(name)"
        >
          连接{{ name }}
        </button>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

