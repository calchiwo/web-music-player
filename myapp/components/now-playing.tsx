"use client"
import type { Song } from "./music-player"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

interface NowPlayingProps {
  song: Song | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onProgressChange: (time: number) => void
  onVolumeChange: (volume: number) => void
}

export function NowPlaying({
  song,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onProgressChange,
  onVolumeChange,
}: NowPlayingProps) {
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex flex-col space-y-6">
      {/* Album Art */}
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900 shadow-lg">
        {song?.albumArt ? (
          <img src={song.albumArt || "/placeholder.svg"} alt={song.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-200 dark:text-blue-800">♪</div>
              <p className="mt-2 text-sm text-blue-400 dark:text-blue-600">No song selected</p>
            </div>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="space-y-2">
        <h2 className="truncate text-xl font-semibold text-foreground">{song?.title || "Select a song"}</h2>
        <p className="truncate text-sm text-muted-foreground">{song?.artist || "No artist"}</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="h-1 w-full cursor-pointer rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress Input */}
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => onProgressChange(Number.parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-500 dark:bg-slate-700"
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onPrevious}
          disabled={!song}
          className="rounded-full p-2 text-muted-foreground hover:bg-slate-100 hover:text-foreground disabled:opacity-50 dark:hover:bg-slate-800"
        >
          <SkipBack size={24} />
        </button>

        <button
          onClick={onPlayPause}
          disabled={!song}
          className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        <button
          onClick={onNext}
          disabled={!song}
          className="rounded-full p-2 text-muted-foreground hover:bg-slate-100 hover:text-foreground disabled:opacity-50 dark:hover:bg-slate-800"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Volume2 size={20} className="text-muted-foreground" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(Number.parseFloat(e.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-500 dark:bg-slate-700"
        />
        <span className="w-8 text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  )
}
