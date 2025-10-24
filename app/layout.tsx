import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Si t'en as un

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coin Flip Game - Farcaster Mini App',
  description: 'Double or nothing on Base!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Balise obligatoire pour Farcaster Mini Apps : définit l'aperçu d'embed */}
        <meta
          name="fc:miniapp"
          content='{"version":"1","imageUrl":"https://farcaster-coinflip.vercel.app/og-image.png","button":{"title":"Flip a Coin!","action":{"type":"launch_miniapp","name":"CoinFlip","url":"https://farcaster-coinflip.vercel.app","splashImageUrl":"https://farcaster-coinflip.vercel.app/splash.png","splashBackgroundColor":"#1e3a8a"}}}' 
        />
        
        {/* Optionnel : pour compatibilité avec les anciens clients Farcaster (utilise launch_frame au lieu de launch_miniapp) */}
        <meta
          name="fc:frame"
          content='{"version":"1","imageUrl":"https://farcaster-coinflip.vercel.app/og-image.png","button":{"title":"Flip a Coin!","action":{"type":"launch_frame","name":"CoinFlip","url":"https://farcaster-coinflip.vercel.app","splashImageUrl":"https://farcaster-coinflip.vercel.app/splash.png","splashBackgroundColor":"#1e3a8a"}}}' 
        />
        
        {/* Tes autres metas Next.js sont gérées via l'export metadata, mais tu peux en ajouter ici si besoin */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}