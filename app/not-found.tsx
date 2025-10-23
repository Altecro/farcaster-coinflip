'use client'; // Optionnel, mais safe pour éviter d'autres serializations

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import Link from 'next/link';

export default function NotFound() {
  useEffect(() => {
    sdk.actions.ready().catch(console.log); // Init SDK si besoin
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-6xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">Oups, cette page n'existe pas dans notre Mini App.</p>
      <Link href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-bold">
        Retour à l'accueil
      </Link>
    </div>
  );
}