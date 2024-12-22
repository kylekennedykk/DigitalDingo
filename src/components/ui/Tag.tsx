interface TagProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}

export function Tag({ children, variant = 'primary', className }: TagProps) {
  const baseClasses = 'px-3 py-1 rounded-full text-sm'
  const variantClasses = {
    primary: 'bg-primary-ochre text-white',
    secondary: 'bg-neutral-100 text-neutral-600'
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
      style={{ contain: 'layout paint' }}
    >
      {children}
    </span>
  )
} 