import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { EventCard } from '@/components/event/event-card'
import { getEvents } from '@/api'
import { AppPagination } from '@/components/shared/app-pagination'
import { EventsHeader } from '@/components/events/events-header'
import { queryKeys } from '@/lib/query-keys'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'

export type EventsSearch = {
  page: number
}

export const Route = createFileRoute('/events/')({
  component: EventsPage,
  validateSearch: (search: Record<string, unknown>): EventsSearch => {
    return {
      page: Number(search.page ?? 1),
    }
  },
})

function EventsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate({ from: '/events' })
  const { page } = Route.useSearch()
  const limit = 20

  const { data } = useSuspenseQuery({
    queryKey: queryKeys.events(page, limit),
    queryFn: () =>
      getEvents({
        query: { page, limit },
        throwOnError: true,
      }),
  })

  const totalPages = data.data.totalPages
  const currentPage = page
  const events = data.data.events

  const handlePageChange = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
  }

  return (
    <div className="min-h-screen bg-neutral-900 pb-20 pt-24">
      <div className="container mx-auto px-4">
        <EventsHeader />

        {events.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon icon="lucide:calendar" />
              </EmptyMedia>
              <EmptyTitle>{t('events.empty.title', 'No Events')}</EmptyTitle>
              <EmptyDescription>
                {t('events.empty.description', 'There are no events available at the moment. Check back later!')}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
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
