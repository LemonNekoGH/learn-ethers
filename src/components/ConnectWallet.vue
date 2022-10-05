<script setup lang="ts">
import Swal from 'sweetalert2'
import { ethers } from 'ethers'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { storeToRefs } from 'pinia'
import type { ProviderName } from '~/utils/eth'
import { getProvider, providerNames } from '~/utils/eth'

const { address: account, chainId: currentChain, providerName } = storeToRefs(useUserStore())

// 处理网络变化事件
const handleChainChanged = (e: string) => {
  currentChain.value = e
}
// 处理账号变化事件
const handleAccountChanged = (e: string[]) => {
  account.value = e
}

// 是否显示连接弹窗
const showConnectDialog = ref(false)

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

  providerName.value = 'Wallet Connect'
  showConnectDialog.value = false
}

/**
* 连接钱包
* @param property 用于检测是否已安装钱包
*/
const connectToWallet = async (pn: ProviderName) => {
  if (pn === 'Wallet Connect') {
    connectToWalletConnect()
    return
  }
  const p = getProvider(pn)
  if (!p) {
    // 如果没有被注入变量，说明钱包扩展不存在
    Swal.fire({
      text: `你没有安装${pn}`,
    })
    return
  }

  try {
    // 连接钱包
    const provider = new ethers.providers.Web3Provider(p)
    providerName.value = pn
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
      text: `你取消了连接钱包 ${(e as Error).message}`,
    })
  }
  finally {
    showConnectDialog.value = false
  }
}
</script>

<template>
  <div>
    <button btn text-sm :disabled="!!account.length" @click="showConnectDialog = true">
      {{ account.length ? account[0] : '连接钱包' }}
    </button>

    <teleport v-if="showConnectDialog" to="#app">
      <div w-full h-full absolute top-0 left-0 flex justify="center" items-center class="bg-[rgba(0,0,0,0.5)]">
        <div class="bg-white p-5">
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
    </teleport>
  </div>
</template>
