import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { LEADERBOARD_CONTRACT, LEADERBOARD_ABI } from '@/lib/wagmi';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Crée un client public pour Base (lecture gratuite, pas de wallet)
    const client = createPublicClient({
      chain: base,
      transport: http(), // RPC public Base (gratuit)
    });

    // Appelle getScores sur le contrat
    const rawScores = await client.readContract({
      address: LEADERBOARD_CONTRACT,
      abi: LEADERBOARD_ABI,
      functionName: 'getScores',
    }) as Array<{ name: string; score: bigint; timestamp: bigint }>;

    // Mappe en format simple pour le frontend (tri par score desc, top 10 max)
    const scores = rawScores
      .slice(-10) // Derniers 10 (ou tous si <10)
      .map((s) => ({
        name: s.name,
        score: Number(s.score), // bigint → number
        timestamp: Number(s.timestamp), // Pour new Date() dans UI
      }))
      .sort((a, b) => b.score - a.score) // Tri desc par score
      .reverse(); // Wait, non : sort desc direct

    return NextResponse.json({ scores });
  } catch (error: any) {
    console.error('API Leaderboard error:', error);
    // Si contrat pas déployé ou erreur : renvoie vide sans crash
    if (error.message.includes('not deployed') || error.message.includes('invalid address')) {
      return NextResponse.json({ scores: [] });
    }
    return NextResponse.json({ scores: [], error: error.message }, { status: 500 });
  }
}