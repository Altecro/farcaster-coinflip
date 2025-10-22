'use client'

import { useEffect } from 'react'
import sdk from '@farcaster/frame-sdk'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi'
import CoinFlipGame from '@/components/CoinFlipGame'

const queryClient = new QueryClient()

export default function Home() {
  useEffect(() => {
    const initFrame = async () => {
      try {
        await sdk.context
        sdk.actions.ready()
      } catch (err) {
        console.log('Frame SDK init:', err)
      }
    }
    initFrame()
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CoinFlipGame />
      </QueryClientProvider>
    </WagmiProvider>
  )
}