import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';

// Exports pour le contrat (inchangés)
export const LEADERBOARD_CONTRACT = '0xYourContractAddressHere' as const; // Remplace par ton adresse réelle !

export const LEADERBOARD_ABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'score', type: 'uint256' }
    ],
    name: 'saveScore',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
  // Ajoute d'autres si besoin
] as const;

// Factory pour le config (créé dynamiquement côté client)
export function getConfig() {
  return createConfig({
    chains: [base],
    ssr: true, // Clé : Active SSR sans mismatches (gère localStorage etc. côté client)
    connectors: [miniAppConnector()],
    transports: {
      [base.id]: http(),
    },
  });
}