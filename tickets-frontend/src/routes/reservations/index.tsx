import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { getReservations } from '@/api'
import { ReservationCard } from '@/components/reservation/reservation-card'
import { AppPagination } from '@/components/shared/app-pagination'
import { queryKeys } from '@/lib/query-keys'
import { useProtectedSuspenseQuery } from '@/hooks/use-protected-query'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'

export type ReservationsSearch = {
  page: number
}

export const Route = createFileRoute('/reservations/')({
  component: ReservationsPage,
  validateSearch: (search: Record<string, unknown>): ReservationsSearch => {
    return {
      page: Number(search.page ?? 1),
    }
  },
})

function ReservationsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate({ from: '/reservations' })
  const { page } = Route.useSearch()
  const limit = 20

  const { data } = useProtectedSuspenseQuery({
    queryKey: queryKeys.reservations(page, limit),
    queryFn: () => getReservations({ query: { page, limit } }),
  })

  const totalPages = data?.totalPages ?? 1
  const currentPage = page
  const reservations = data?.reservations ?? []

  const handlePageChange = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
  }

  return (
    <div className="min-h-screen bg-neutral-900 pb-20 pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('reservations.title', 'Reservations')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('reservations.description', 'View and manage your event reservations')}
          </p>
        </div>

        {reservations.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon icon="lucide:ticket" />
              </EmptyMedia>
              <EmptyTitle>{t('reservations.empty.title', 'No Reservations')}</EmptyTitle>
              <EmptyDescription>
                {t('reservations.empty.description', "You haven't made any reservations yet. Browse events to get started.")}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                />
              ))}
            </div>

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
