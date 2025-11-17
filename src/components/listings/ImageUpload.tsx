'use client'

import { useState, useRef } from 'react'

interface MediaFile {
  url: string
  type: 'image' | 'video'
  publicId?: string
}

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(
    images.map(url => ({ url, type: 'image' as const }))
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Count images and videos
  const imageCount = mediaFiles.filter(m => m.type === 'image').length
  const videoCount = mediaFiles.filter(m => m.type === 'video').length

  // Compress image if needed
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Calculate new dimensions to keep file under 4MB
          const maxDimension = 2048 // Max width/height
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension
              width = maxDimension
            } else {
              width = (width / height) * maxDimension
              height = maxDimension
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          // Convert to blob with quality adjustment
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                resolve(file)
              }
            },
            'image/jpeg',
            0.85 // 85% quality
          )
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    const newMediaFiles: MediaFile[] = []

    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      const fileType = file.type.split('/')[0] as 'image' | 'video'

      // Check limits
      const currentImageCount = imageCount + newMediaFiles.filter(m => m.type === 'image').length
      const currentVideoCount = videoCount + newMediaFiles.filter(m => m.type === 'video').length

      if (fileType === 'image' && currentImageCount >= 6) {
        alert('Chỉ được tải lên tối đa 6 hình ảnh')
        continue
      }

      if (fileType === 'video' && currentVideoCount >= 2) {
        alert('Chỉ được tải lên tối đa 2 video')
        continue
      }

      // Check file size
      const maxSize = fileType === 'image' ? 50 * 1024 * 1024 : 100 * 1024 * 1024
      if (file.size > maxSize) {
        alert(`File "${file.name}" quá lớn. Tối đa ${fileType === 'image' ? '50MB' : '100MB'}`)
        continue
      }

      // Compress image if it's too large (> 4MB for Vercel limit)
      if (fileType === 'image' && file.size > 4 * 1024 * 1024) {
        setUploadProgress(`Đang nén ${file.name}...`)
        file = await compressImage(file)
      }

      setUploadProgress(`Đang tải lên ${file.name}...`)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        // Check if response is OK before parsing
        if (!response.ok) {
          let errorMessage = 'Lỗi server'
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`
          }
          alert(`Lỗi tải lên ${file.name}: ${errorMessage}`)
          continue
        }

        const data = await response.json()

        if (data.success) {
          newMediaFiles.push({
            url: data.url,
            type: data.type,
            publicId: data.publicId,
          })
        } else {
          alert(`Lỗi tải lên ${file.name}: ${data.error || 'Không rõ nguyên nhân'}`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        const errorMsg = error instanceof Error ? error.message : 'Không rõ nguyên nhân'
        alert(`Lỗi khi tải lên ${file.name}: ${errorMsg}`)
      }
    }

    const updatedMedia = [...mediaFiles, ...newMediaFiles]
    setMediaFiles(updatedMedia)
    onChange(updatedMedia.map(m => m.url))

    setUploading(false)
    setUploadProgress('')

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveMedia = (index: number) => {
    const updated = mediaFiles.filter((_, i) => i !== index)
    setMediaFiles(updated)
    onChange(updated.map(m => m.url))
  }

  const handleSetPrimary = (index: number) => {
    const updated = [...mediaFiles]
    const [primary] = updated.splice(index, 1)
    const reordered = [primary, ...updated]
    setMediaFiles(reordered)
    onChange(reordered.map(m => m.url))
  }

  const canAddImages = imageCount < 6
  const canAddVideos = videoCount < 2

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="media-upload"
        />

        <label
          htmlFor="media-upload"
          className={`
            flex items-center justify-center gap-2 px-6 py-4
            border-2 border-dashed rounded-xl cursor-pointer
            transition-all
            ${uploading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-emerald-400 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-500'
            }
          `}
        >
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium text-emerald-700">
            {uploading ? uploadProgress : 'Tải lên hình ảnh / video'}
          </span>
        </label>

        {/* Upload Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-4">
            <span className={`${imageCount >= 6 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              📷 Ảnh: {imageCount}/6
            </span>
            <span className={`${videoCount >= 2 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              🎥 Video: {videoCount}/2
            </span>
          </div>

          {!canAddImages && !canAddVideos && (
            <span className="text-red-600 font-medium">Đã đạt giới hạn</span>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaFiles.map((media, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
            >
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50" y="50" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif"%3ENo Image%3C/text%3E%3C/svg%3E'
                  }}
                />
              ) : (
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  controls={false}
                  muted
                />
              )}

              {/* Type Badge */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs font-semibold rounded">
                {media.type === 'image' ? '📷' : '🎥'}
              </div>

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded">
                  Chính
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="px-3 py-1 bg-white text-gray-800 text-sm rounded hover:bg-gray-100"
                    title="Đặt làm ảnh/video chính"
                  >
                    Đặt chính
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(index)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="font-semibold mb-2">📌 Hướng dẫn:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>File đầu tiên sẽ là ảnh/video chính hiển thị trên thẻ tin đăng</li>
          <li>Tối đa: <strong>6 hình ảnh</strong> (ảnh lớn sẽ tự động nén)</li>
          <li>Tối đa: <strong>2 video</strong> (mỗi video tối đa 100MB)</li>
          <li>Hỗ trợ: JPG, PNG, GIF, MP4, MOV, AVI</li>
          <li>✨ Ảnh lớn hơn 4MB sẽ được tự động nén để tải nhanh hơn</li>
        </ul>
      </div>
    </div>
  )
}
