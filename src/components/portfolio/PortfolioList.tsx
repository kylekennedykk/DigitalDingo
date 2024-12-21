'use client'

import { PortfolioCard } from './PortfolioCard'

interface ExternalPortfolioItem {
  id: string;
  title?: string;  // Making these optional since they might not exist in external data
  description?: string;
  imageUrl?: string;
  tags?: string[];
  url?: string;
}

interface PortfolioCardItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  url?: string;
}

export function PortfolioList({ items }: { items: ExternalPortfolioItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => {
        // Transform external item to match PortfolioCard requirements
        const cardItem: PortfolioCardItem = {
          id: item.id,
          title: item.title || 'Untitled Project',
          description: item.description || 'No description available',
          imageUrl: item.imageUrl || '/images/placeholder.jpg',
          tags: item.tags,
          url: item.url
        }

        return (
          <PortfolioCard
            key={item.id}
            item={cardItem}
            variant="compact"
          />
        )
      })}
    </div>
  )
} 