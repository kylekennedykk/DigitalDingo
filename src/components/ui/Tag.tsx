interface TagProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function Tag({ children, variant = 'primary' }: TagProps) {
  const baseClasses = 'px-3 py-1 rounded-full text-sm'
  const variantClasses = {
    primary: 'bg-primary-ochre text-white',
    secondary: 'bg-neutral-100 text-neutral-600'
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  )
} 