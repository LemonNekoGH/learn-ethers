import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ProviderName } from '~/types'

export const useUserStore = defineStore('user', () => {
  const address = ref<string[]>([])
  const chainId = ref('')
  // 把 provider 保存起来备用
  const providerName = ref<ProviderName | ''>('')
  const isGoerliChain = computed(() => chainId.value === 'goerli' || parseInt(chainId.value) === 5)

  return {
    address,
    chainId,
    providerName,
    isGoerliChain,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
