import { NextResponse } from 'next/server'

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhFNkM0MjAyN0UzMjEwOTIyNkIyMzg1NDc1RTkxRTcwNEI3RTRDMTE3In0",
      payload: "eyJkb21haW4iOiJmYXJjYXN0ZXItY29pbmZsaXAudmVyY2VsLmFwcCJ9",
      signature: "MHhhMWIyYzNkNGU1ZjZnN2g4aTlqMGsxbDJtM240bzVwNnE3cjhzOXQwdTF2MnczeDR5NXo2"
    },
    frame: {
      version: "next",
      name: "Coin Flip",
      iconUrl: "https://farcaster-coinflip.vercel.app/icon.png",
      splashImageUrl: "https://farcaster-coinflip.vercel.app/splash.png",
      splashBackgroundColor: "#1e1b4b",
      homeUrl: "https://farcaster-coinflip.vercel.app"
    }
  }

  return NextResponse.json(manifest)
}