import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface InfoFieldProps {
  icon: string
  label: string
  children: React.ReactNode
  className?: string
}

export function InfoField({
  icon,
  label,
  children,
  className,
}: InfoFieldProps) {
  return (
    <div className={cn(`flex items-center gap-4`, className)}>
      <div className="p-3 bg-primary/10 rounded-lg">
        <Icon icon={icon} className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="text-lg font-medium">{children}</div>
      </div>
    </div>
  )
}