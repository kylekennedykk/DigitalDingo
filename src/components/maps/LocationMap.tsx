'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface LocationMapProps {
  latitude: number
  longitude: number
  city?: string
  country?: string
}

export function LocationMap({ latitude, longitude, city, country }: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
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

    return () => {
      map.current?.remove()
    }
  }, [latitude, longitude, city, country])

  return (
    <div ref={mapContainer} className="w-full h-[300px] rounded-lg overflow-hidden" />
  )
} 