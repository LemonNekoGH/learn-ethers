declare type MyProvider = import('ethers').providers.ExternalProvider & {
  on: (event: string, handler: (...arg: any[]) => any) => void,
  addListener: (event: string, handler: (...arg: any[]) => any) => void,
  providers?: MyProvider[],
  [p: string]: boolean
}

declare interface Window {
  // extend the window
  ethereum?: MyProvider
  BinanceChain?: MyProvider
}

// with vite-plugin-vue-markdown, markdown files can be treated as Vue components
declare module '*.md' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
