import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Coin Flip - Farcaster Frame',
  description: 'Double or nothing coin flip game on Base',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/https://farcaster-coinflip.vercel.app/',
    'fc:frame:button:1': 'Play Game',
    'fc:frame:button:1:action': 'launch_frame',
    'fc:frame:button:1:target': '/https://farcaster-coinflip.vercel.app/',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}