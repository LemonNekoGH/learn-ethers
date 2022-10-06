import type { ethers } from 'ethers'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const address = ref<string[]>([])
  const chainId = ref('')
  // 把 provider 保存起来备用，如果要直接存 provider 对象，没有必要用 ref 包裹起来
  // 在 pinia store 中直接返回也会被包上一层 proxy
  let provider: ethers.providers.Web3Provider | undefined
  const setProvider = (p: ethers.providers.Web3Provider | undefined) => provider = p
  const getProvider = () => provider

  const isGoerliChain = computed(() => chainId.value === 'goerli' || parseInt(chainId.value) === 5)

  return {
    address,
    chainId,
    setProvider,
    getProvider,
    isGoerliChain,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
