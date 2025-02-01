import { http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { createConfig } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

export const config = getDefaultConfig({
  appName: 'MyDApp',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
})