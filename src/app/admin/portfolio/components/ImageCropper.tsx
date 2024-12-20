'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Loader2 } from 'lucide-react'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Image from 'next/image'

interface ImageCropperProps {
  image: string
  aspect?: number
  onComplete: (croppedImage: Blob) => void
  onCancel: () => void
}

export default function ImageCropper({
  image,
  aspect,
  onComplete,
  onCancel
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: aspect ? 90 / aspect : 90,
    x: 5,
    y: 5
  })
  const [loading, setLoading] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  const getCroppedImage = async () => {
    setLoading(true)
    try {
      const image = imageRef.current
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!image || !ctx) return

      // Calculate pixel values from percentages
      const scaleX = image.naturalWidth / 100
      const scaleY = image.naturalHeight / 100
      const pixelCrop = {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY
      }

      // Set canvas size
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height

      // Draw cropped image
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob as Blob),
          'image/jpeg',
          0.9 // Quality
        )
      })

      onComplete(blob)
    } catch (err) {
      console.error('Error cropping image:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 border-b">
          <h3 className="font-heading text-xl">Crop Image</h3>
        </div>

        <div className="p-6">
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            aspect={aspect}
            className="max-h-[60vh] mx-auto"
          >
            <Image
              ref={imageRef}
              src={image}
              alt="Image to crop"
              width={800}
              height={600}
              className="max-w-full h-auto"
              unoptimized
            />
          </ReactCrop>
        </div>

        <div className="flex justify-end gap-4 p-6 bg-neutral-50 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
          >
            Cancel
          </button>
          <button
            onClick={getCroppedImage}
            disabled={loading}
            className="px-4 py-2 bg-primary-ochre text-white rounded-lg
              hover:bg-primary-ochre/90 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Apply Crop</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
} 