import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import type { UserDto } from '@/api/types.gen'
import { UserRoleBadge } from '@/components/shared/user-role-badge'
import { UserAvatarIcon } from '@/components/shared/user-avatar'
import { EditUserDialog } from './edit-user-dialog'
import { DeleteUserDialog } from './delete-user-dialog'
import { formatDateTimeWithTime } from '@/lib/utils'

interface UsersTableProps {
  users: Array<UserDto>
  currentUserId?: number
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const { t } = useTranslation()

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-neutral-800/50 data-[state=selected]:bg-neutral-800">
            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-400">
              {t('users.table.user', 'User')}
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-400">
              {t('users.table.role', 'Role')}
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-400">
              {t('users.table.createdAt', 'Created At')}
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium text-neutral-400">
              {t('users.table.actions', 'Actions')}
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isCurrentUser={user.id === currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function UserRow({
  user,
  isCurrentUser,
}: {
  user: UserDto
  isCurrentUser: boolean
}) {
  return (
    <tr className="border-b transition-colors hover:bg-neutral-800/50 data-[state=selected]:bg-neutral-800">
      <td className="p-4 align-middle">
        <Link
          to="/users/$userId"
          params={{ userId: user.id.toString() }}
          className="flex items-center gap-3 hover:underline"
        >
          <UserAvatarIcon size="sm" />
          <span className="font-medium">{user.email}</span>
        </Link>
      </td>
      <td className="p-4 align-middle">
        <UserRoleBadge role={user.role} />
      </td>
      <td className="p-4 align-middle text-neutral-400">
        {formatDateTimeWithTime(user.createdAt)}
      </td>
      <td className="p-4 align-middle">
        <div className="flex justify-end gap-2">
          <EditUserDialog user={user} />
          {!isCurrentUser && <DeleteUserDialog user={user} />}
        </div>
      </td>
    </tr>
  )
}
