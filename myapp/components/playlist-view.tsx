"use client"
import type { Song } from "./music-player"
import { Trash2, Play } from "lucide-react"

interface PlaylistViewProps {
  songs: Song[]
  currentIndex: number | null
  onPlaySong: (index: number) => void
  onRemoveSong: (index: number) => void
}

export function PlaylistView({ songs, currentIndex, onPlaySong, onRemoveSong }: PlaylistViewProps) {
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (songs.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="mb-2 text-lg font-medium text-muted-foreground">Your playlist is empty</p>
        <p className="text-sm text-muted-foreground">Upload songs to get started</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
        <h2 className="font-semibold text-foreground">Playlist ({songs.length})</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-4 md:p-6">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={`group flex items-center justify-between rounded-lg px-4 py-3 transition-all ${
                currentIndex === index ? "bg-blue-50 dark:bg-blue-950" : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <button onClick={() => onPlaySong(index)} className="flex flex-1 items-center gap-3 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600">
                  {currentIndex === index ? (
                    <div className="text-white">
                      <Play size={16} fill="white" />
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-white">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`truncate font-medium ${
                      currentIndex === index ? "text-blue-600 dark:text-blue-400" : "text-foreground"
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
                </div>

                <span className="ml-2 text-xs text-muted-foreground">{formatTime(song.duration)}</span>
              </button>

              <button
                onClick={() => onRemoveSong(index)}
                className="ml-2 rounded p-2 text-muted-foreground opacity-0 hover:bg-red-50 hover:text-destructive dark:hover:bg-red-950 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
