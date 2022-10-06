<script lang="ts" setup>
import { storeToRefs } from 'pinia'

const user = useUserStore()
const { address, chainId } = storeToRefs(user)

// // 用 WalletConnect 发起网络切换请求
// const switchByWalletConnect = async () => {
//   // Create a connector
//   const connector = new WalletConnect({
//     bridge: 'https://bridge.walletconnect.org', // Required
//     qrcodeModal: QRCodeModal,
//   })
//   // 发送请求
//   await connector.sendCustomRequest({
//     method: 'wallet_switchEthereumChain',
//     params: [{
//       chainId: '0x5',
//     }],
//   })
// }

// 用扩展钱包发起网络切换请求
const switchByExtensionWallet = async () => {
  // 请求切换
  // 参考 https://docs.metamask.io/guide/rpc-api.html#wallet-switchethereumchain
  await user.getProvider()!.send('wallet_switchEthereumChain', [{
    // 不能在前面填充 0，比如 0x05
    chainId: '0x5',
  }])
}

// 开始转账
const switchChain = async () => {
  switchByExtensionWallet()
}
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
    <em text-sm opacity-75>请切换至 Goerli 网络</em><br>
    <button btn @click="switchChain">
      切换网络
    </button>
  </p>

  <!-- 显示已连接地址 -->
  <p v-for="acct of address" :key="acct">
    <em text-sm opacity-75>已连接：{{ acct }}</em>
  </p>
</template>
