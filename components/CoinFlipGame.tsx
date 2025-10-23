'use client'

import React, { useState, useEffect } from 'react';
import { AlertCircle, Trophy, Coins, TrendingUp } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk'; // Fixed: Use Mini Apps SDK (not frame-sdk)
import { base } from 'viem/chains';
import { encodeFunctionData } from 'viem';
import { LEADERBOARD_CONTRACT, LEADERBOARD_ABI } from '@/lib/wagmi';

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

  useEffect(() => {
    const initFrame = async () => {
      try {
        await sdk.context; // Wait for context to load
        setIsInFrame(true);
        await sdk.actions.ready(); // Signal ready to dismiss splash
      } catch (err) {
        console.log('Not in Mini App context:', err);
        setIsInFrame(false);
      }
    };
    initFrame();
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
        setScore(prev => prev * 2);
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

  setIsSaving(true);

  try {
    if (isInFrame) {
      console.log('Preparing transaction...');
      
      const data = encodeFunctionData({
        abi: LEADERBOARD_ABI,
        functionName: 'saveScore',
        args: [playerName.trim(), BigInt(score)]
      });

      console.log('Sending transaction to:', LEADERBOARD_CONTRACT);
      
      // Await and guard against undefined provider
      const provider = await sdk.wallet.getEthereumProvider();
      if (!provider) {
        throw new Error('Ethereum provider not available. Please ensure your wallet is linked in Farcaster.');
      }
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          to: LEADERBOARD_CONTRACT,
          data: data,
          value: '0x0',
        }]
      });

      console.log('Transaction sent:', txHash);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('✅ Score saved!\n\nTx: ' + txHash.slice(0, 10) + '...');
      await loadLeaderboard();
      resetGame();
      
    } else {
      alert('⚠️ Please open this app in Warpcast to save your score on Base blockchain');
    }
    
  } catch (err: any) {
    console.error('Transaction error:', err);
    
    if (err.code === 4001 || err.message?.includes('reject') || err.message?.includes('cancel')) {
      alert('❌ Transaction cancelled');
    } else if (err.code === -32000 || err.message?.includes('insufficient')) {
      alert('💸 Insufficient ETH on Base\n\nPlease add ETH to your wallet');
    } else if (err.message?.includes('provider not available')) {
      alert('🔗 Wallet not linked\n\nLink your wallet in Farcaster settings and try again');
    } else {
      alert('❌ Error: ' + (err.message?.slice(0, 100) || 'Unknown error'));
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

  // Rest of your JSX remains unchanged...
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Your existing JSX here - no changes needed */}
      <div className="max-w-4xl mx-auto">
        {/* ... (omitted for brevity; copy from your original) */}
      </div>
    </div>
  );
}