'use client'

import { useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk' // Nouveau SDK Mini Apps
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'
import CoinFlipGame from '@/components/CoinFlipGame'

const queryClient = new QueryClient()

export default function Home() {
  useEffect(() => {
    const initMiniApp = async () => {
      try {
        await sdk.actions.ready() // Appel direct et await pour confirmation
        console.log('✅ Mini App ready')
      } catch (err) {
        console.log('Mini App init error:', err)
      }
    }
    initMiniApp()
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CoinFlipGame />
      </QueryClientProvider>
    </WagmiProvider>
  )
}