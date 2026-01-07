import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { getAllUsers } from '@/api'
import { AppPagination } from '@/components/shared/app-pagination'
import { PageLoader } from '@/components/shared/page-loader'
import { UsersTable } from '@/components/user/users-table'
import { queryKeys } from '@/lib/query-keys'
import { useAuth } from '@/hooks/use-auth'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { Card, CardContent } from '@/components/ui/card'

export type UsersSearch = {
  page: number
}

export const Route = createFileRoute('/users/')({
  component: UsersPage,
  validateSearch: (search: Record<string, unknown>): UsersSearch => {
    return {
      page: Number(search.page ?? 1),
    }
  },
})

function UsersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate({ from: '/users' })
  const { page } = Route.useSearch()
  const { user: currentUser, isAdmin, isLoading: isAuthLoading } = useAuth()
  const limit = 20

  useEffect(() => {
    if (!isAuthLoading && !isAdmin) {
      navigate({ to: '/' })
    }
  }, [isAuthLoading, isAdmin, navigate])

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users(page, limit),
    queryFn: () =>
      getAllUsers({
        query: { page, limit },
        throwOnError: true,
        credentials: 'include',
      }),
    enabled: isAdmin,
  })

  const totalPages = data?.data.totalPages ?? 0
  const currentPage = page
  const users = data?.data.users ?? []

  const handlePageChange = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
  }

  if (isAuthLoading) {
    return <PageLoader />
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-900 pb-20 pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('users.title', 'User Management')}
          </h1>

        </div>

        {isLoading ? (
          <PageLoader fullScreen={false} />
        ) : users.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon icon="lucide:users" />
              </EmptyMedia>
              <EmptyTitle>{t('users.empty.title', 'No Users')}</EmptyTitle>
              <EmptyDescription>
                {t('users.empty.description', 'There are no users in the system.')}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardContent>
                <UsersTable users={users} currentUserId={currentUser?.id} />
              </CardContent>
            </Card>

            {totalPages > 1 && (
              <AppPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
