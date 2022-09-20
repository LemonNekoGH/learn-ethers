import { ethers } from 'ethers'

// 导出 eth 网络提供者实例
export const eth = new ethers.providers.Web3Provider(window.ethereum)
