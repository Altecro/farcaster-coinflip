'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import CoinFlipGame from '@/components/CoinFlipGame';
import { Providers } from '@/components/providers'; // Nouveau import

export default function Home() {
  useEffect(() => {
    const initMiniApp = async () => {
      try {
        await sdk.actions.ready();
        console.log('✅ Mini App ready');
      } catch (err) {
        console.log('Mini App init error:', err);
      }
    };
    initMiniApp();
  }, []);

  return (
    <Providers> {/* Wrap ici : config créé client-side */}
      <CoinFlipGame />
    </Providers>
  );
}