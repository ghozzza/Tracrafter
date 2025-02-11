"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { SUPPORTED_NETWORKS, type NetworkKey } from "@/config/networks"

interface Web3ContextType {
  address: string | null
  chainId: number | null
  network: NetworkKey | null
  switchNetwork: (networkKey: NetworkKey) => Promise<void>
  // ... rest of the previous context types
}

const Web3Context = createContext<Web3ContextType | null>(null)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [network, setNetwork] = useState<NetworkKey | null>(null)

  // Keep existing wallet connection logic
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("chainChanged", (newChainId: string) => {
        setChainId(Number.parseInt(newChainId))
      })

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAddress(accounts[0] || null)
      })
    }
  }, [])

  // Add network switching functionality
  const switchNetwork = async (networkKey: NetworkKey) => {
    if (!window.ethereum) return

    const network = SUPPORTED_NETWORKS[networkKey]
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${network.id.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${network.id.toString(16)}`,
              chainName: network.name,
              nativeCurrency: {
                name: network.currency,
                symbol: network.currency,
                decimals: 18,
              },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.explorerUrl],
            },
          ],
        })
      }
    }
  }


  const value = {
    address,
    chainId,
    network,
    switchNetwork,

  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (context === null) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

