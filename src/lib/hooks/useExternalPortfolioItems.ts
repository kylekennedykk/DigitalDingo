import { useQuery } from '@tanstack/react-query'
import type { ExternalPortfolioItem } from '@/types/portfolio'

async function fetchExternalPortfolioItems(limit?: number): Promise<ExternalPortfolioItem[]> {
  const response = await fetch(`/api/portfolio/external${limit ? `?limit=${limit}` : ''}`)
  if (!response.ok) {
    throw new Error('Failed to fetch portfolio items')
  }
  return response.json()
}

export function useExternalPortfolioItems(limit?: number) {
  return useQuery({
    queryKey: ['externalPortfolioItems', limit],
    queryFn: () => fetchExternalPortfolioItems(limit)
  })
}

export type { ExternalPortfolioItem } 