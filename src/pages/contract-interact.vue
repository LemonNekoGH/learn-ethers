<script lang="ts" setup>
import { ethers } from 'ethers'
import { storeToRefs } from 'pinia'
import HelloWorld from '~/abi/HelloWorld.json'

// 一个存用户名的合约
const contractAddress = '0x43c6a3a783882c1862fa543366fe531381ae4c60'
const username = ref('')
const usernameInput = ref('')

const user = useUserStore()
const { address } = storeToRefs(user)

// 与合约交互，设置用户名
const setUsername = () => {

}

// 与合约交互，查询用户名
const getUsername = async (address: string): Promise<string> => {
  // 使用扩展钱包与合约交互
  const c = new ethers.Contract(contractAddress, HelloWorld, user.getProvider())
  return await c.callStatic.getUsername(address)
}

// 监听已连接账户变化
watch([address], ([newAddress], [oldAddress]) => {
  const oldVal = oldAddress.length ? oldAddress[0] : ''
  const newVal = newAddress.length ? newAddress[0] : ''
  // 如果旧值与新值不同，查询合约的状态
  if (oldVal === newVal)
    return

  // 新值为空，清空用户名
  if (newVal === '') {
    username.value = ''
    return
  }
  // eslint-disable-next-line no-console
  getUsername(newVal).then(v => username.value = v).catch(e => console.log(e))
})
</script>

<template>
  <div>
    <ConnectStatus />
    <p>
      <em text-sm opacity-75>用于练习的合约：<a href="https://goerli.etherscan.io/address/0xb1e91e92c54aca98465f36aeaf408df9cfd9ae48" hover="text-red">{{ contractAddress }}</a></em>
    </p>
    <p>
      <em text-sm opacity-75>你的用户名：{{ username }}</em>
    </p>
    <input
      id="input"
      v-model="usernameInput"
      placeholder="输入新的用户名"
      aria-label="输入新的用户名"
      type="text"
      autocomplete="false"
      p="x4 y2"
      w="250px"
      text="center"
      bg="transparent"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
    >
    <label class="hidden" for="input">输入新的用户名</label>
    <br>

    <div>
      <ConnectWallet v-if="!address.length" />
      <button
        btn m-3 text-sm
        @click="setUsername"
      >
        设置用户名
      </button>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
