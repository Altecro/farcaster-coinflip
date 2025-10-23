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
      <body className={inter.className}>{children}</body>
    </html>
  );
}