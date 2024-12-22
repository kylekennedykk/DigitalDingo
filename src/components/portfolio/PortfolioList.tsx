'use client'

import { VirtualList } from '@/components/ui/VirtualList'
import { PortfolioCard } from '@/components/portfolio/PortfolioCard'
import type { ExternalPortfolioItem } from '@/types/portfolio'

interface PortfolioListProps {
  items: ExternalPortfolioItem[]
  onLoadMore?: () => void
}

export function PortfolioList({ items, onLoadMore }: PortfolioListProps) {
  return (
    <VirtualList
      items={items}
      height={600}
      itemHeight={300}
      className="w-full"
      onEndReached={onLoadMore}
      renderItem={(item) => (
        <PortfolioCard
          key={item.id}
          item={item}
          variant="compact"
        />
      )}
    />
  )
} 