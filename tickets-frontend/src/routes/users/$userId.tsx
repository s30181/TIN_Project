import { Suspense } from 'react'
import { Icon } from '@iconify/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { EventDto, UserDto } from '@/api'
import { findUserById, getUserEvents } from '@/api'
import { EventCard } from '@/components/event/event-card'
import { UserRoleBadge } from '@/components/shared/user-role-badge'
import { queryKeys } from '@/lib/query-keys'
import { formatDateTime } from '@/lib/utils'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

export const Route = createFileRoute('/users/$userId')({
  component: UserPageWrapper,
})

function UserPageWrapper() {
  return (
    <Suspense fallback={<UserPageLoading />}>
      <UserPage />
    </Suspense>
  )
}

function UserPageLoading() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin" />
    </div>
  )
}

function UserPage() {
  const { userId } = Route.useParams()
  const id = Number(userId)

  const { data: user } = useSuspenseQuery({
    queryKey: queryKeys.user(id),
    queryFn: () =>
      findUserById({ path: { id }, throwOnError: true }).then(
        (res) => res.data
      ),
  })

  const { data: eventsData } = useSuspenseQuery({
    queryKey: queryKeys.userEvents(id),
    queryFn: () =>
      getUserEvents({ path: { id }, throwOnError: true }).then(
        (res) => res.data
      ),
  })

  const events = eventsData.events

  return (
    <div className="container mx-auto px-4 py-12">
      <UserProfileHeader user={user} />
      <UserEventsSection events={events} />
    </div>
  )
}

function UserProfileHeader({
  user,
}: {
  user: UserDto
}) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center mb-12 text-center">
      <UserAvatar email={user.email} size="xl" />

      <h1 className="text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
        {user.email}
      </h1>

      <div className="flex flex-row items-center gap-3 font-medium text-lg">
        <UserRoleBadge role={user.role} className="text-sm px-3" />
        <span className="flex items-center gap-1.5">
          <Icon icon="lucide:calendar" className="w-5 h-5 text-primary/60" />
          <span className="text-base">
            {t('user.profile.joined', 'Joined')}{' '}
            {formatDateTime(user.createdAt, { month: 'long', year: 'numeric' })}
          </span>
        </span>
      </div>

      <div className="mt-10 pt-10 border-t border-neutral-800 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-2">
          {t('user.profile.events', 'Organized Events')}
        </h2>
        <div className="h-1.5 w-12 bg-primary rounded-full mx-auto" />
      </div>
    </div>
  )
}

function UserEventsSection({
  events,
}: {
  events: Array<EventDto> | undefined
}) {
  if (!events || events.length === 0) {
    return <EmptyEventsState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

function EmptyEventsState() {

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon="lucide:calendar-off" />
        </EmptyMedia>
        <EmptyTitle>No Events Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any events yet. Get started by creating
          your first event.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
