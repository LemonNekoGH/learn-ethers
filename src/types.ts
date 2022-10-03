import { type ViteSSGContext } from 'vite-ssg'

export type UserModule = (ctx: ViteSSGContext) => void

export const providerNames = ['MetaMask', 'Coinbase Wallet', 'Trust Wallet', 'Binance Wallet', 'Wallet Connect'] as const
export type ProviderName = typeof providerNames[number]
export const providerMap: Record<Exclude<ProviderName, 'Binance Wallet' | 'Wallet Connect'>, string> = {
  'MetaMask': 'isMetaMask',
  'Trust Wallet': 'isTrustWallet',
  'Coinbase Wallet': 'isCoinbaseWallet',
}
