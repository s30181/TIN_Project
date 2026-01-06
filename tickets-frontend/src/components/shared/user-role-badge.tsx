import type { UserDto } from '@/api/types.gen'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type UserRole = UserDto['role']

interface UserRoleBadgeProps {
  role: UserRole
  size?: 'xs' | 'sm' | 'default'
  className?: string
}

const roleVariants: Record<UserRole, 'default' | 'outline'> = {
  admin: 'default',
  user: 'outline',
}

export function UserRoleBadge({
  role,
  size = 'default',
  className,
}: UserRoleBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-[10px] uppercase' : size === 'xs' ? 'text-[8px] uppercase' : 'capitalize'

  return (
    <Badge
      variant={roleVariants[role]}
      className={cn(sizeClasses, className)}
    >
      {role}
    </Badge>
  )
}
