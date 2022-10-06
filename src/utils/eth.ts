// https://github.com/WalletConnect/walletconnect-monorepo/issues/341
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js'
import { ethers } from 'ethers'
import HelloWorld from '~/abi/HelloWorld.json'

export const providerNames = ['MetaMask', 'Coinbase Wallet', 'Trust Wallet', 'Binance Wallet', 'Wallet Connect'] as const
export type ProviderName = typeof providerNames[number]
export const providerMap: Record<Exclude<ProviderName, 'Binance Wallet' | 'Wallet Connect'>, string> = {
  'MetaMask': 'isMetaMask',
  'Trust Wallet': 'isTrustWallet',
  'Coinbase Wallet': 'isCoinbaseWallet',
}

/**
 * 从注入的 window.ethereum 中取出需要的提供者
 * @param property 用于检测是否是需要的那个
 */
export const getProvider = (property: ProviderName): MyProvider | WalletConnectProvider | undefined => {
  // 标准钱包连接
  if (property === 'Wallet Connect') {
    return new WalletConnectProvider({
      infuraId: '5bd2398e9fcc41c099cbac59722aef62',
    })
  }

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

// 给合约的已知函数加类型
export interface HelloWorldContract extends ethers.Contract {
  getUsername(addr: string): Promise<string>
  setUsername(name: string): Promise<ethers.providers.TransactionResponse>
}

export const newHelloWorldContract = (address: string, signerOrProvider: ethers.providers.Provider | ethers.Signer): HelloWorldContract => {
  return new ethers.Contract(address, HelloWorld, signerOrProvider) as HelloWorldContract
}
