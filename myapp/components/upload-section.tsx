"use client"

import React, { useRef } from "react"
import { Upload } from "lucide-react"
import type { Song } from "./music-player"

interface UploadSectionProps {
  onSongsUploaded: (songs: Song[]) => void
}

export function UploadSection({ onSongsUploaded }: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const extractMetadata = async (file: File): Promise<Partial<Song>> => {
    const audio = new Audio()
    const objectUrl = URL.createObjectURL(file)
    audio.src = objectUrl

    return new Promise((resolve) => {
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl)
        resolve({
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          duration: audio.duration,
        })
      }

      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        resolve({
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: "Unknown Artist",
          duration: 0,
        })
      }
    })
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files) return

    const audioFiles = Array.from(files).filter((file) => file.type.startsWith("audio/"))

    if (audioFiles.length === 0) {
      alert("Please select audio files")
      return
    }

    const newSongs: Song[] = []

    for (const file of audioFiles) {
      const metadata = await extractMetadata(file)
      newSongs.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        title: metadata.title || "Unknown",
        artist: metadata.artist || "Unknown Artist",
        duration: metadata.duration || 0,
      })
    }

    onSongsUploaded(newSongs)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
          : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500 dark:hover:bg-blue-950"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <Upload className="mx-auto mb-2 size-6 text-blue-500 dark:text-blue-400" />
      <p className="font-medium text-foreground">Upload Songs</p>
      <p className="text-xs text-muted-foreground">Drag and drop or click to browse</p>
    </div>
  )
}
