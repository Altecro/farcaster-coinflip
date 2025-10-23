'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Trophy, Coins, TrendingUp } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk'; // Nouveau SDK
import { useWriteContract, useAccount } from 'wagmi'; // Wagmi hooks
import { base } from 'wagmi/chains';
import { LEADERBOARD_CONTRACT, LEADERBOARD_ABI } from '@/lib/wagmi';
import { config } from '@/lib/wagmi'; // Ta config Wagmi

// Wrap le composant avec WagmiProvider si pas déjà fait (dans _app.tsx ou layout)
import { WagmiProvider } from 'wagmi';
function AppWithWagmi({ children }: { children: React.ReactNode }) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

export default function CoinFlipGame() {
  const [score, setScore] = useState(1);
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInFrame, setIsInFrame] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Hook Wagmi pour la transaction
  const { writeContractAsync } = useWriteContract();
  const { isConnected } = useAccount(); // Vérifie si connecté au wallet

  useEffect(() => {
    const initMiniApp = async () => {
      try {
        // Le nouveau SDK n'a pas de .context, mais on peut checker via Wagmi
        await sdk.actions.ready(); // Appel ready() direct
        setIsInFrame(true);
        console.log('✅ Mini App ready');
      } catch (err) {
        console.log('ℹ️ Not in Mini App context:', err);
        setIsInFrame(false);
      }
    };

    initMiniApp();
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data.scores || []);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
    }
  };

  const flipCoin = (userChoice: 'heads' | 'tails') => {
    if (isFlipping || gameOver) return;
    
    setChoice(userChoice);
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const coinResult: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(coinResult);
      
      if (coinResult === userChoice) {
        setScore(score * 2);
      } else {
        setGameOver(true);
        setShowNameInput(true);
      }
      
      setIsFlipping(false);
    }, 1500);
  };

  const saveToBlockchain = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!isConnected) {
      alert('⚠️ Connecte ton wallet Farcaster d\'abord (auto via Warpcast)');
      return;
    }

    setIsSaving(true);

    try {
      console.log('Envoi de la transaction...');

      // Utilise Wagmi pour writeContract (gère chainId, encoding, etc. auto)
      const txHash = await writeContractAsync({
        address: LEADERBOARD_CONTRACT,
        abi: LEADERBOARD_ABI,
        functionName: 'saveScore',
        args: [playerName.trim(), BigInt(score)],
        chainId: base.id, // Force Base
      });

      console.log('Transaction envoyée:', txHash);
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Attente pour confirmation
      
      alert(`✅ Score sauvé!\n\nTx: ${txHash.slice(0, 10)}...`);
      await loadLeaderboard();
      resetGame();
      
    } catch (err: any) {
      console.error('Erreur transaction:', err);
      
      if (err.code === 4001 || err.message?.includes('User rejected')) {
        alert('❌ Transaction annulée');
      } else if (err.code === -32000 || err.message?.includes('insufficient funds')) {
        alert('💸 ETH insuffisant sur Base\n\nAjoute de l\'ETH à ton wallet');
      } else {
        alert(`❌ Erreur: ${err.message?.slice(0, 100) || 'Erreur inconnue'}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const resetGame = () => {
    setScore(1);
    setGameOver(false);
    setShowNameInput(false);
    setPlayerName('');
    setChoice(null);
    setResult(null);
  };

  // Le reste de ton JSX reste IDENTIQUE (pas de changements UI)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Ton JSX existant ici, sans modification */}
      <div className="max-w-4xl mx-auto">
        {/* ... tout le contenu ... */}
      </div>
    </div>
  );
}