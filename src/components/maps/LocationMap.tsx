'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Loader2 } from 'lucide-react'

interface LocationMapProps {
  latitude: number
  longitude: number
  city?: string
  country?: string
}

export function LocationMap({ latitude, longitude, city, country }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return

    async function initializeMap() {
      try {
        // Fetch token from our API
        const response = await fetch('/api/mapbox/token')
        if (!response.ok) throw new Error('Failed to load map configuration')
        
        const { token } = await response.json()
        mapboxgl.accessToken = token

        // Type guard for container
        const container = mapContainer.current
        if (!container) return

        // Initialize map
        map.current = new mapboxgl.Map({
          container,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [longitude, latitude],
          zoom: 11,
          interactive: true
        })

        // Add marker
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${city || 'Unknown Location'}</h3>
                  ${country ? `<p class="text-sm text-gray-600">${country}</p>` : ''}
                </div>
              `)
          )
          .addTo(map.current)

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

        // Handle successful load
        map.current.on('load', () => {
          setLoading(false)
        })

      } catch (err) {
        console.error('Map initialization error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
        setLoading(false)
      }
    }

    initializeMap()

    return () => {
      map.current?.remove()
    }
  }, [latitude, longitude, city, country])

  if (error) {
    return (
      <div className="w-full h-[300px] rounded-lg bg-neutral-100 flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      )}
    </div>
  )
} 