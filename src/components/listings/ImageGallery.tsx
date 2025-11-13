'use client'

import { useState } from 'react'
import type { Image } from '@prisma/client'

interface ImageGalleryProps {
  images: Image[]
  title: string
}

// Helper function to detect if URL is a video
const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
  const lowerUrl = url.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.endsWith(ext)) || lowerUrl.includes('/videos/')
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 aspect-video flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Không có ảnh</p>
        </div>
      </div>
    )
  }

  const currentMedia = images[selectedIndex]
  const isCurrentVideo = isVideo(currentMedia.url)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Main Media Display */}
      <div className="relative aspect-video bg-gray-100">
        {isCurrentVideo ? (
          <video
            key={currentMedia.url}
            src={currentMedia.url}
            controls
            className="w-full h-full object-contain"
            preload="metadata"
          >
            <source src={currentMedia.url} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        ) : (
          <img
            src={currentMedia.url}
            alt={`${title} - ${isCurrentVideo ? 'Video' : 'Ảnh'} ${selectedIndex + 1}`}
            className="w-full h-full object-contain"
          />
        )}

        {/* Media Type Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-xs font-semibold rounded-full">
          {isCurrentVideo ? '🎥 Video' : '📷 Ảnh'}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Media Counter */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="p-4 flex gap-2 overflow-x-auto">
          {images.map((image, index) => {
            const isThumbVideo = isVideo(image.url)
            return (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? 'border-emerald-500 scale-110'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                {isThumbVideo ? (
                  <div className="relative w-full h-full bg-black">
                    <video
                      src={image.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
