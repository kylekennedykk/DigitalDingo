'use client'

import { useState, useRef, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageUploadProps {
  currentImage?: string
  onUpload: (url: string) => void
  folder: string
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function ImageUpload({ currentImage, onUpload, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [tempImage, setTempImage] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const aspect = 16 / 9

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspect))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      // Create temporary URL for cropping
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempImage(reader.result as string)
      }
      reader.readAsDataURL(file)

    } catch (error) {
      console.error('Error handling image:', error)
      setError(error instanceof Error ? error.message : 'Failed to handle image')
    }
  }

  const handleCropComplete = async () => {
    if (!imageRef.current || !crop || !tempImage) return

    setUploading(true)
    try {
      // Create canvas for cropping
      const canvas = document.createElement('canvas')
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      ctx.drawImage(
        imageRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.95)
      })

      // Upload to Firebase
      const filename = `${Date.now()}-cropped.jpg`
      const storageRef = ref(storage, `${folder}/${filename}`)
      await uploadBytes(storageRef, blob)
      const url = await getDownloadURL(storageRef)
      
      onUpload(url)
      setTempImage(null)
      setError(null)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const currentRef = imageRef.current;

  useEffect(() => {
    return () => {
      if (currentRef) {
        // cleanup code
      }
    };
  }, [currentRef]);

  return (
    <div className="space-y-4">
      {currentImage && !tempImage && (
        <div className="relative aspect-video w-full max-w-md">
          <Image
            src={currentImage}
            alt="Current thumbnail"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {tempImage && (
        <div className="space-y-4">
          <div className="text-sm text-gray-500 mb-2">
            Drag to adjust the crop area position
          </div>
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            aspect={aspect}
            minWidth={200}
            className="max-w-md mx-auto"
          >
            <Image
              ref={imageRef}
              src={tempImage}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-w-full h-auto"
            />
          </ReactCrop>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setTempImage(null)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCropComplete}
              disabled={!crop?.width || uploading}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Cropped'}
            </button>
          </div>
        </div>
      )}
      
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {uploading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}
    </div>
  )
}
