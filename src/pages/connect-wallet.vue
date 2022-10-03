<script lang="ts" setup>
import ConnectWalletVue from '~/components/ConnectWallet.vue'
</script>

<template>
  <div>
    <div text-4xl>
      <div i-carbon-campsite inline-block />
    </div>

    <p>
      Learn Ethers
    </p>
    <ConnectStatus />
    <ConnectWalletVue />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

