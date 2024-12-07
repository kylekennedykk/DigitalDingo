import { ImageWithFallback } from '@/components/ImageWithFallback'

export function PortfolioCard({ project }: { project: PortfolioItem }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl">
      <ImageWithFallback
        src={project.imageUrl}
        alt={project.title}
        width={600}
        height={400}
        className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* ... rest of the card content ... */}
    </div>
  )
} 