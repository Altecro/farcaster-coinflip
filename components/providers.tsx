'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import type { ReactNode } from 'react';
import type { State } from 'wagmi';
import { getConfig } from '@/lib/wagmi';

type Props = {
  children: ReactNode;
  initialState?: State; // Optionnel pour hydratation SSR (on skippe pour simplicité)
};

export function Providers({ children, initialState }: Props) {
  const [config] = useState(() => getConfig()); // Créé côté client seulement → pas de fonctions sérialisées !
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}