import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import type { ReservationDto, UserDto } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {

  findUserById,
  getEventById,
  getEventReservations,
  getMyReservations,
  reserveEvent
} from '@/api'
import { EditEventDialog } from '@/components/event/edit-event-dialog'
import { DeleteEventDialog } from '@/components/event/delete-event-dialog'
import { DeleteReservationDialog } from '@/components/reservation/delete-reservation-dialog'
import { CancelReservationDialog } from '@/components/reservation/cancel-reservation-dialog'
import { ReservationsList } from '@/components/event/reservations-list'
import { InfoField } from '@/components/shared/info-field'
import { formatEventDateLong, formatPrice } from '@/lib/utils'
import { ReservationStatusBadge } from '@/components/shared/reservation-status-badge'
import { UserDisplay } from '@/components/shared/user-avatar'
import { useAuth } from '@/hooks/use-auth'
import { queryKeys } from '@/lib/query-keys'

export const Route = createFileRoute('/events/$eventId')({
  component: EventPageWrapper,
})

function EventPageWrapper() {
  return (
    <Suspense fallback={<EventPageLoading />}>
      <EventPage />
    </Suspense>
  )
}

function EventPageLoading() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin" />
    </div>
  )
}

function EventPage() {
  const { t } = useTranslation()
  const { eventId } = Route.useParams()
  const id = Number(eventId)
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()

  const { data: event } = useSuspenseQuery({
    queryKey: queryKeys.event(id),
    queryFn: () =>
      getEventById({
        path: { id },
        throwOnError: true,
      }).then((data) => data.data),
  })

  const { data: organizer } = useQuery({
    queryKey: queryKeys.user(event.organizerId),
    queryFn: () =>
      findUserById({
        path: { id: event.organizerId },
        throwOnError: true,
      }).then((res) => res.data),
  })

  const { data: myReservations } = useQuery({
    queryKey: queryKeys.myReservations,
    queryFn: () =>
      getMyReservations({ throwOnError: true }).then((res) => res.data),
    enabled: !!currentUser,
  })

  const canEdit =
    currentUser &&
    (currentUser.id === event.organizerId || currentUser.role === 'admin')

  const { data: eventReservations } = useQuery({
    queryKey: queryKeys.eventReservations(id),
    queryFn: () =>
      getEventReservations({ path: { id }, throwOnError: true }).then(
        (res) => res.data
      ),
    enabled: !!canEdit,
  })

  const existingReservation = myReservations?.find((r) => r.eventId === id)

  const reserveMutation = useMutation({
    mutationFn: (status: 'paid' | 'reserved') =>
      reserveEvent({
        body: { eventId: id, status },
        throwOnError: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myReservations })
      queryClient.invalidateQueries({ queryKey: queryKeys.eventReservations(id) })
    },
  })

  return (
    <div className="min-h-screen bg-neutral-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl space-y-6">
        <EventHeader event={event} canEdit={canEdit} />

        <Card>
          <CardContent className="space-y-6">
            <InfoField icon="lucide:hash" label={t('event.id', 'Event ID')}>
              <span className="font-mono">{event.id}</span>
            </InfoField>

            <InfoField icon="lucide:calendar" label={t('event.date', 'Date')}>
              {formatEventDateLong(event.startsAt)}
            </InfoField>


            {event.location && (
              <InfoField icon="lucide:map-pin" label={t('event.location', 'Location')}>
                {event.location}
              </InfoField>
            )}

            <InfoField icon="lucide:banknote" label={t('event.price', 'Price')}>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(event.price, { freeLabel: t('events.details.free', 'Free') })}
              </span>
            </InfoField>

          </CardContent>
        </Card>

        <ReservationActions
          existingReservation={existingReservation}
          isAuthenticated={!!currentUser}
          isPending={reserveMutation.isPending}
          onReserve={(status) => reserveMutation.mutate(status)}
        />

        {organizer && <OrganizerCard organizer={organizer} />}

        {canEdit && eventReservations && eventReservations.length > 0 && (
          <ReservationsList reservations={eventReservations} isOrganizer />
        )}
      </div>
    </div>
  )
}

function EventHeader({
  event,
  canEdit,
}: {
  event: { id: number; title: string; startsAt: string; location?: string | null; price: number; organizerId: number; createdAt: Date }
  canEdit: boolean | null | undefined
}) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold">{event.title}</h1>
      {canEdit && (
        <div className="flex justify-center gap-2">
          <EditEventDialog
            event={event}
            trigger={
              <Button variant="outline" size="sm">
                <Icon icon="lucide:pencil" className="mr-2 h-4 w-4" />
                {t('common.edit', 'Edit')}
              </Button>
            }
          />
          <DeleteEventDialog
            event={event}
            trigger={
              <Button variant="destructive" size="sm">
                <Icon icon="lucide:trash-2" className="mr-2 h-4 w-4" />
                {t('common.delete', 'Delete')}
              </Button>
            }
          />
        </div>
      )}
    </div>
  )
}

function ReservationActions({
  existingReservation,
  isAuthenticated,
  isPending,
  onReserve,
}: {
  existingReservation: ReservationDto | undefined
  isAuthenticated: boolean
  isPending: boolean
  onReserve: (status: 'paid' | 'reserved') => void
}) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('event.reservation', 'Reservation')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {existingReservation ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ReservationStatusBadge
                status={existingReservation.status}
                className="text-sm px-4 py-1"
              />
              <p className="text-sm text-muted-foreground">
                {t('event.alreadyReserved', 'You already have a reservation for this event')}
              </p>
            </div>
            <div className="flex gap-2">
              {existingReservation.status !== 'cancelled' && (
                <CancelReservationDialog
                  reservation={existingReservation}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Icon icon="lucide:x-circle" className="mr-2 h-4 w-4" />
                      {t('reservations.cancel.button', 'Cancel')}
                    </Button>
                  }
                />
              )}
              <DeleteReservationDialog
                reservation={existingReservation}
                redirectOnSuccess={false}
                trigger={
                  <Button variant="destructive" size="sm">
                    <Icon icon="lucide:trash-2" className="mr-2 h-4 w-4" />
                    {t('reservations.delete.button', 'Delete')}
                  </Button>
                }
              />
            </div>
          </div>
        ) : isAuthenticated ? (
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => onReserve('paid')}
              disabled={isPending}
            >
              <Icon icon="lucide:credit-card" className="mr-2 h-4 w-4" />
              {t('event.buyNow', 'Buy Now')}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onReserve('reserved')}
              disabled={isPending}
            >
              <Icon icon="lucide:bookmark" className="mr-2 h-4 w-4" />
              {t('event.reserve', 'Reserve')}
            </Button>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            {t('event.loginToReserve', 'Please log in to make a reservation')}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function OrganizerCard({
  organizer,
}: {
  organizer: UserDto
}) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('event.organizer', 'Organizer')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserDisplay user={organizer} linkToProfile size="lg" />
      </CardContent>
    </Card>
  )
}
