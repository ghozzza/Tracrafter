export const SUPPORTED_NETWORKS = {
    ethereum: {
      id: 1,
      name: "Ethereum",
      rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/your-api-key",
      currency: "ETH",
      explorerUrl: "https://etherscan.io",
    },
    arbitrum: {
      id: 42161,
      name: "Arbitrum One",
      rpcUrl: "https://arb-mainnet.g.alchemy.com/v2/your-api-key",
      currency: "ETH",
      explorerUrl: "https://arbiscan.io",
    },
  }
  
  export type NetworkKey = keyof typeof SUPPORTED_NETWORKS
  
  export function getNetwork(chainId: number) {
    return Object.values(SUPPORTED_NETWORKS).find((network) => network.id === chainId)
  }
  
  