<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { newHelloWorldContract } from '~/utils/eth'

// 一个存用户名的合约
const contractAddress = '0x43c6a3a783882c1862fa543366fe531381ae4c60'
const username = ref('')
const usernameInput = ref('')

const user = useUserStore()
const { address } = storeToRefs(user)

// 与合约交互，设置用户名
const setUsername = async () => {
  if (usernameInput.value.length < 3) {
    Swal.fire({
      text: '用户名至少要有两个字符',
    })
    return
  }

  const p = user.getProvider()
  if (!p) {
    Swal.fire({
      text: '请先连接钱包',
    })
    return
  }
  const c = newHelloWorldContract(contractAddress, p.getSigner())
  // 是否忽略错误强制发送交易
  try {
    const tx = await c.setUsername(usernameInput.value)
    Swal.fire({
      text: '设置用户名交易发送成功',
    })
    await tx.wait(2)
    Swal.fire({
      text: '交易已被至少两个区块确认',
    })
  }
  catch (e) {
    Swal.fire({
      text: `交易发送失败 ${(e as Error).message}`,
    })
  }
}

// 与合约交互，查询用户名
const getUsername = async (address: string): Promise<string> => {
  // 使用扩展钱包与合约交互
  const c = newHelloWorldContract(contractAddress, user.getProvider()!.getSigner())
  return c.getUsername(address)
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

  getUsername(newVal).then(v => username.value = v).catch(e => console.log(e))
})

// 进入时获取用户名
onMounted(() => {
  if (address.value.length && address.value[0])
    getUsername(address.value[0]).then(v => username.value = v).catch(e => console.log(e))
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
