import { NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { LEADERBOARD_CONTRACT, LEADERBOARD_ABI } from '@/lib/wagmi'

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org')
})

export async function GET() {
  try {
    const scores = await publicClient.readContract({
      address: LEADERBOARD_CONTRACT,
      abi: LEADERBOARD_ABI,
      functionName: 'getTopScores',
      args: [BigInt(10)]
    }) as any[]

    const formatted = scores.map(entry => ({
      name: entry.playerName,
      score: Number(entry.score),
      timestamp: Number(entry.timestamp) * 1000
    }))

    return NextResponse.json({ scores: formatted })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ scores: [] })
  }
}