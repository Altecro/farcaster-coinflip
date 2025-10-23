import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { LEADERBOARD_CONTRACT, LEADERBOARD_ABI } from '@/lib/wagmi';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = createPublicClient({
      chain: base,
      transport: http(),
    });

    // Appelle getTopScores(10) pour top 10 triés par score desc
    const rawScores = await client.readContract({
      address: LEADERBOARD_CONTRACT,
      abi: LEADERBOARD_ABI,
      functionName: 'getTopScores',
      args: [BigInt(10)],
    }) as Array<{ playerName: string; score: bigint; timestamp: bigint }>;

    // Mappe en format UI (playerName → name, bigint → number)
    const scores = rawScores.map((s) => ({
      name: s.playerName, // Renomme pour matcher entry.name dans UI
      score: Number(s.score),
      timestamp: Number(s.timestamp),
    }));

    console.log('API: Fetched scores:', scores); // Log pour debug (check console serveur)

    return NextResponse.json({ scores });
  } catch (error: any) {
    console.error('API Leaderboard error:', error);
    if (error.message.includes('not deployed') || error.message.includes('invalid address') || error.message.includes('execution reverted')) {
      return NextResponse.json({ scores: [] });
    }
    return NextResponse.json({ scores: [], error: error.message }, { status: 500 });
  }
}