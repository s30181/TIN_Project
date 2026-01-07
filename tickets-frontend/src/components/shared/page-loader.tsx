import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface PageLoaderProps {
  fullScreen?: boolean
  className?: string
}

export function PageLoader({ fullScreen = true, className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullScreen ? 'min-h-screen bg-neutral-900' : 'py-20',
        className
      )}
    >
      <Icon icon="lucide:loader-2" className="h-8 w-8 animate-spin text-neutral-400" />
    </div>
  )
}
