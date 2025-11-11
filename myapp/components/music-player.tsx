"use client"

import { useState, useRef, useEffect } from "react"
import { UploadSection } from "./upload-section"
import { NowPlaying } from "./now-playing"
import { PlaylistView } from "./playlist-view"

export interface Song {
  id: string
  file: File
  title: string
  artist: string
  duration: number
  albumArt?: string
}

export function MusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const currentSong = currentIndex !== null ? songs[currentIndex] : null

  const handleSongsUploaded = (uploadedSongs: Song[]) => {
    setSongs([...songs, ...uploadedSongs])
  }

  const handlePlaySong = (index: number) => {
    setCurrentIndex(index)
    setIsPlaying(true)
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    if (currentIndex !== null && currentIndex < songs.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsPlaying(true)
    }
  }

  const handlePrevious = () => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsPlaying(true)
    }
  }

  const handleProgressChange = (newTime: number) => {
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handleRemoveSong = (index: number) => {
    const newSongs = songs.filter((_, i) => i !== index)
    setSongs(newSongs)
    if (currentIndex === index) {
      setCurrentIndex(null)
      setIsPlaying(false)
    } else if (currentIndex !== null && index < currentIndex) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return

    const objectUrl = URL.createObjectURL(currentSong.file)
    audio.src = objectUrl

    if (isPlaying) {
      audio.play()
    }

    return () => URL.revokeObjectURL(objectUrl)
  }, [currentSong])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => handleNext()

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentIndex, songs.length])

  return (
    <div className="flex h-screen flex-col bg-background dark:bg-slate-950">
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Header */}
      <header className="border-b border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Music Player</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload songs and enjoy your personal playlist</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Left Section: Now Playing + Upload */}
        <div className="flex flex-1 flex-col border-b border-border p-4 md:border-b-0 md:border-r md:p-6">
          <div className="mx-auto w-full max-w-md">
            <NowPlaying
              song={currentSong}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onProgressChange={handleProgressChange}
              onVolumeChange={handleVolumeChange}
            />

            {/* Upload Section */}
            <div className="mt-8">
              <UploadSection onSongsUploaded={handleSongsUploaded} />
            </div>
          </div>
        </div>

        {/* Right Section: Playlist */}
        <div className="flex-1 overflow-hidden">
          <PlaylistView
            songs={songs}
            currentIndex={currentIndex}
            onPlaySong={handlePlaySong}
            onRemoveSong={handleRemoveSong}
          />
        </div>
      </div>
    </div>
  )
}
