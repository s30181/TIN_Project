import { Icon } from '@iconify/react'
import { Link } from '@tanstack/react-router'
import { UserRoleBadge } from './user-role-badge'
import type { UserDto } from '@/api/types.gen'
import { cn, getUserInitials } from '@/lib/utils'

interface UserAvatarProps {
  email: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-xl',
  xl: 'w-14 h-14 text-2xl',
}

export function UserAvatar({ email, size = 'md', className }: UserAvatarProps) {
  return (
    <div
      className={cn(`rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary`, sizeClasses[size], className)}
    >
      {getUserInitials(email)}
    </div>
  )
}

interface UserAvatarIconProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export function UserAvatarIcon({ size = 'md', className }: UserAvatarIconProps) {
  return (
    <div
      className={cn(`bg-primary/10  rounded-full text-primary`, iconSizeClasses[size], className)}
    >
      <Icon icon="lucide:user" className={iconSizeClasses[size]} />
    </div>
  )
}

interface UserDisplayProps {
  user: Pick<UserDto, 'id' | 'email' | 'role'>
  showRole?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserDisplay({
  user,
  showRole = true,
  size = 'md',
  className,
}: UserDisplayProps) {

  return (
    <Link
      to="/users/$userId"
      params={{ userId: user.id.toString() }}
      className="hover:opacity-80 transition-opacity"
    >
      <div className={cn(`flex items-center gap-3`, className)}>
        <UserAvatar email={user.email} size={size} />
        <div className="flex flex-col gap-1">
          <p className="font-medium">{user.email}</p>
          {showRole && <UserRoleBadge role={user.role} className="w-fit" />}
        </div>
      </div>
    </Link>
  )
}
