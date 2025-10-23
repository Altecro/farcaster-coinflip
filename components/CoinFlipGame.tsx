'use client'

import React, { useState, useEffect } from 'react';
import { AlertCircle, Trophy, Coins, TrendingUp, Wallet } from 'lucide-react';
import { useWriteContract, useReadContract, useAccount, useConnect } from 'wagmi';
import { LEADERBOARD_CONTRACT, LEADERBOARD_ABI } from '@/lib/wagmi';
import sdk from '@farcaster/frame-sdk';

export default function CoinFlipGame() {
  const [score, setScore] = useState(1);
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isInFrame, setIsInFrame] = useState(false);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Détecter si on est dans une Frame
  useEffect(() => {
    const checkFrame = async () => {
      try {
        const context = await sdk.context;
        setIsInFrame(true);
      } catch {
        setIsInFrame(false);
      }
    };
    checkFrame();
  }, []);

  const { data: leaderboardData, refetch } = useReadContract({
    address: LEADERBOARD_CONTRACT,
    abi: LEADERBOARD_ABI,
    functionName: 'getTopScores',
    args: [BigInt(10)]
  });

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (leaderboardData) {
      const formatted = (leaderboardData as any[]).map(entry => ({
        name: entry.playerName,
        score: Number(entry.score),
        timestamp: Number(entry.timestamp) * 1000
      }));
      setLeaderboard(formatted);
    }
  }, [leaderboardData]);

  // Recharger le leaderboard après succès
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        refetch();
        resetGame();
      }, 3000);
    }
  }, [isSuccess, refetch]);

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

  const connectWallet = async () => {
    try {
      if (isInFrame) {
        // Dans une Frame, demander au SDK de se connecter
        await sdk.actions.openUrl('https://warpcast.com/~/settings/connected-apps');
      } else {
        // Hors Frame, connexion classique
        const connector = connectors[0];
        if (connector) {
          connect({ connector });
        }
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      alert('Please connect your wallet first');
    }
  };

  const saveToBlockchain = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      await connectWallet();
      return;
    }

    if (isPending) return;

    try {
      console.log('Saving score...', { playerName, score, address });
      
      await writeContract({
        address: LEADERBOARD_CONTRACT,
        abi: LEADERBOARD_ABI,
        functionName: 'saveScore',
        args: [playerName.trim(), BigInt(score)]
      });
      
    } catch (err: any) {
      console.error('Transaction error:', err);
      
      if (err.message?.includes('User rejected')) {
        alert('Transaction cancelled');
      } else if (err.message?.includes('insufficient funds')) {
        alert('Insufficient ETH on Base. Please add funds.');
      } else {
        alert('Error saving score. Check console for details.');
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Coins className="w-10 h-10 text-yellow-400" />
            Coin Flip
          </h1>
          <p className="text-purple-200">Double or Nothing - Farcaster Frame</p>
          
          {/* Wallet Status */}
          <div className="mt-4">
            {isConnected ? (
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400 rounded-full px-4 py-2">
                <Wallet className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400 rounded-full px-4 py-2 hover:bg-yellow-500/30 transition-colors"
              >
                <Wallet className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-sm">Connect Wallet</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Game Area */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-6 py-3 mb-4">
                <div className="text-white text-sm font-semibold">Current Score</div>
                <div className="text-white text-3xl font-bold">{score} pts</div>
              </div>
            </div>

            {!gameOver ? (
              <>
                <div className="flex justify-center mb-8">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-2xl flex items-center justify-center text-4xl font-bold text-white ${isFlipping ? 'animate-spin' : ''}`}>
                    {isFlipping ? '?' : result === 'heads' ? 'H' : result === 'tails' ? 'T' : '¢'}
                  </div>
                </div>

                {result && !isFlipping && (
                  <div className={`text-center mb-6 p-4 rounded-lg ${result === choice ? 'bg-green-500/20 border border-green-400' : 'bg-red-500/20 border border-red-400'}`}>
                    <p className={`text-xl font-bold ${result === choice ? 'text-green-300' : 'text-red-300'}`}>
                      {result === choice ? '🎉 You Won! +' + (score/2) + ' pts' : '💔 You Lost! Everything is gone...'}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => flipCoin('heads')}
                    disabled={isFlipping}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100"
                  >
                    HEADS
                  </button>
                  <button
                    onClick={() => flipCoin('tails')}
                    disabled={isFlipping}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100"
                  >
                    TAILS
                  </button>
                </div>
              </>
            ) : (
              <>
                {!showNameInput ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h3 className="text-2xl font-bold text-white mb-4">Game Over!</h3>
                    <p className="text-purple-200 mb-6">Final score: {score} points</p>
                    <button
                      onClick={() => setShowNameInput(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl mb-3 w-full"
                    >
                      💾 Save on Base
                    </button>
                    <button
                      onClick={resetGame}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl w-full"
                    >
                      🔄 Play Again
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-center mb-4">
                      <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-white mb-2">Save Your Score</h3>
                      <p className="text-purple-200 text-sm">Transaction on Base (no extra fees)</p>
                      
                      {!isConnected && (
                        <p className="text-orange-300 text-xs mt-2">⚠️ Connect your wallet first</p>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Your name..."
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      maxLength={20}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-purple-300 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                      onClick={saveToBlockchain}
                      disabled={!playerName.trim() || isPending}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl w-full mb-3 disabled:cursor-not-allowed"
                    >
                      {isPending ? '⏳ Transaction pending...' : 
                       isSuccess ? '✅ Saved!' :
                       !isConnected ? '🔌 Connect & Save' :
                       '🚀 Save Score'}
                    </button>
                    
                    {error && (
                      <p className="text-red-300 text-xs text-center mb-2">
                        Error: {error.message?.slice(0, 50)}...
                      </p>
                    )}
                    
                    <button
                      onClick={resetGame}
                      className="text-purple-300 hover:text-white text-sm w-full"
                    >
                      Cancel and restart
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Leaderboard - reste identique */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {leaderboard.length === 0 ? (
                <p className="text-purple-300 text-center py-8">No scores yet</p>
              ) : (
                leaderboard.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      idx === 0 ? 'bg-yellow-500/30 border border-yellow-400' :
                      idx === 1 ? 'bg-gray-400/30 border border-gray-300' :
                      idx === 2 ? 'bg-orange-600/30 border border-orange-400' :
                      'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className="text-2xl font-bold text-white w-8">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{entry.name}</div>
                      <div className="text-purple-300 text-xs">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-yellow-400">
                      {entry.score}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Game Rules
          </h3>
          <ul className="text-purple-200 text-sm space-y-1">
            <li>• Start with 1 point</li>
            <li>• Choose Heads or Tails</li>
            <li>• Win: double your points</li>
            <li>• Lose: lose everything</li>
            <li>• Connect wallet to save your score on Base blockchain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}