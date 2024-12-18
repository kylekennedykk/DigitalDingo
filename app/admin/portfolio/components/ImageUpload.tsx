'use client'

import { useState, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  aspect?: number
}

export default function ImageUpload({ value, onChange, aspect = 16/9 }: ImageUploadProps) {
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Handle file upload logic here
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors
          ${isDragActive ? 'border-primary-ochre bg-primary-ochre/5' : 'border-neutral-300'}
          hover:border-primary-ochre hover:bg-primary-ochre/5`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
        <p className="text-sm text-neutral-600">
          Drag & drop an image here, or click to select one
        </p>
      </div>

      {value && (
        <div className="relative aspect-video">
          <img
            src={value}
            alt="Uploaded image"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full
              hover:bg-black/75 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
} 