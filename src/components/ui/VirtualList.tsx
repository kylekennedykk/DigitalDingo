'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useState, useEffect } from 'react'
import { createScrollHandler } from '@/lib/utils/performance'

interface VirtualListProps<T> {
  items: T[]
  height: number
  itemHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  onEndReached?: () => void
  endReachedThreshold?: number
  className?: string
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  onEndReached,
  endReachedThreshold = 0.8,
  className
}: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [isNearEnd, setIsNearEnd] = useState(false)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5
  })

  // Handle scroll with performance optimization
  useEffect(() => {
    if (!parentRef.current || !onEndReached) return

    const handleScroll = createScrollHandler(() => {
      const { scrollTop, scrollHeight, clientHeight } = parentRef.current!
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight
      
      if (scrollPercentage > endReachedThreshold && !isNearEnd) {
        setIsNearEnd(true)
        onEndReached()
      } else if (scrollPercentage <= endReachedThreshold && isNearEnd) {
        setIsNearEnd(false)
      }
    })

    const element = parentRef.current
    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => element.removeEventListener('scroll', handleScroll)
  }, [onEndReached, endReachedThreshold, isNearEnd])

  return (
    <div
      ref={parentRef}
      className={className}
      style={{
        height,
        overflow: 'auto',
        contain: 'strict'
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  )
} 