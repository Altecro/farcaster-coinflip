import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'Coin Flip Game',
    }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
  },
})

// ⚠️ IMPORTANT: Remplacez par l'adresse de votre contrat déployé
export const LEADERBOARD_CONTRACT = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`

export const LEADERBOARD_ABI = [
  {
    "inputs": [
      {"name": "playerName", "type": "string"},
      {"name": "score", "type": "uint256"}
    ],
    "name": "saveScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "limit", "type": "uint256"}],
    "name": "getTopScores",
    "outputs": [
      {
        "components": [
          {"name": "playerName", "type": "string"},
          {"name": "score", "type": "uint256"},
          {"name": "timestamp", "type": "uint256"}
        ],
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const