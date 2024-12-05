interface PageHeaderProps {
  title: string
  subtitle: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 
        bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  )
} 