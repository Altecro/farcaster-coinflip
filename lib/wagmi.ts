import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';

// Adresse du contrat (remplace par ton adresse déployée sur Base !)
export const LEADERBOARD_CONTRACT = '0x0959e90085745fbbA276D17C1f9835F0b3f55400' as const; // Ex. : '0x742d35Cc6634C0532925a3b8D7a5a3A6bA9d3D9f'

// ABI mis à jour pour matcher ton contrat (saveScore + getTopScores pour leaderboard trié)
export const LEADERBOARD_ABI = [
  // Write : saveScore (playerName au lieu de name)
  {
    inputs: [
      { name: 'playerName', type: 'string' },
      { name: 'score', type: 'uint256' }
    ],
    name: 'saveScore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // Read : getTopScores (trié desc par score, avec limit)
  {
    inputs: [{ name: 'limit', type: 'uint256' }],
    name: 'getTopScores',
    outputs: [
      {
        components: [
          { name: 'playerName', type: 'string' },
          { name: 'score', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' }
        ],
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
  // Tu peux ajouter getLeaderboard() si besoin, mais getTopScores est mieux pour l'UI
] as const;

// Factory pour Wagmi config (inchangée)
export function getConfig() {
  return createConfig({
    chains: [base],
    ssr: true,
    connectors: [miniAppConnector()],
    transports: {
      [base.id]: http(),
    },
  });
}