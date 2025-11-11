"use client"
import { MusicPlayer } from "@/components/music-player"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-slate-50 dark:to-slate-950">
      <MusicPlayer />
    </main>
  )
}
