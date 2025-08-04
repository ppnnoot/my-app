"use client"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VehicleGallery({ images, vehicleName }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index) => {
    setCurrentImageIndex(index)
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoPlay = () => {
    setIsPlaying(true)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
  }

  const currentImage = images[currentImageIndex]
  const isVideo = currentImage?.endsWith('.mp4')

  // Reset video state when changing images
  useEffect(() => {
    if (videoRef.current && !isVideo) {
      setIsPlaying(false)
    }
  }, [currentImageIndex, isVideo])

  return (
    <div className="relative group">
      {/* Main Image/Video Display */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentImage}
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
            loop
            muted
            controls={false}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onEnded={handleVideoPause}
          />
        ) : (
          <img
            src={currentImage}
            alt={`${vehicleName} - Image ${currentImageIndex + 1}`}
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
          />
        )}
        
        {/* Play/Pause Button for Videos */}
        {isVideo && (
          <Button
            onClick={togglePlayPause}
            size="sm"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              onClick={prevImage}
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={nextImage}
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-md overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {image.endsWith('.mp4') ? (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Play className="h-4 w-4 text-gray-500" />
                </div>
              ) : (
                <img
                  src={image}
                  alt={`${vehicleName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center text-sm text-gray-500 mt-2">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
} 