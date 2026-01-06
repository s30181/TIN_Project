import { Suspense } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { ReservationDto, UserDto } from '@/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getReservationById } from '@/api'
import { EditReservationDialog } from '@/components/reservation/edit-reservation-dialog'
import { DeleteReservationDialog } from '@/components/reservation/delete-reservation-dialog'
import { CancelReservationDialog } from '@/components/reservation/cancel-reservation-dialog'
import { ReservationStatusBadge } from '@/components/shared/reservation-status-badge'
import { InfoField } from '@/components/shared/info-field'
import { UserDisplay } from '@/components/shared/user-avatar'
import { queryKeys } from '@/lib/query-keys'
import { formatDateTime } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/reservations/$reservationId')({
  component: ReservationPageWrapper,
})

function ReservationPageWrapper() {
  return (
    <Suspense fallback={<ReservationPageLoading />}>
      <ReservationPage />
    </Suspense>
  )
}

function ReservationPageLoading() {
  // TODO: Maybe use a skeleton loader instead?

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin" />
    </div>
  )
}

function ReservationPage() {
  const { reservationId } = Route.useParams()
  const id = Number(reservationId)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate({ from: '/' })


  const { data: reservation } = useQuery({
    queryKey: queryKeys.reservation(id),
    queryFn: () => getReservationById({ path: { id }, throwOnError: true }).then((res) => res.data),
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    navigate({ to: '/' })
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl space-y-6"> {reservation && (<>
        <ReservationHeader reservation={reservation} />
        <ReservationDetailsCard reservation={reservation} />
        {reservation.user && <ReservationUserCard user={reservation.user} />}
      </>)}
      </div>
    </div>
  )
}

function ReservationHeader({
  reservation,
}: {
  reservation: ReservationDto
}) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <h1 className="text-3xl font-bold">{t('reservations.detail.title', 'Reservation Details')}</h1>
        <ReservationStatusBadge status={reservation.status} />
      </div>


      <div className="flex gap-2">
        <EditReservationDialog
          reservation={reservation}
          trigger={
            <Button variant="outline" size="sm">
              <Icon icon="lucide:pencil" className="mr-2 h-4 w-4" />
              {t('reservations.edit.button', 'Edit')}
            </Button>
          }
        />
        {reservation.status !== 'cancelled' && (
          <CancelReservationDialog
            reservation={reservation}
            trigger={
              <Button variant="outline" size="sm">
                <Icon icon="lucide:x-circle" className="mr-2 h-4 w-4" />
                {t('reservations.cancel.button', 'Cancel')}
              </Button>
            }
          />
        )}
        <DeleteReservationDialog
          reservation={reservation}
          trigger={
            <Button variant="destructive" size="sm">
              <Icon icon="lucide:trash-2" className="mr-2 h-4 w-4" />
              {t('reservations.delete.button', 'Delete')}
            </Button>
          }
        />
      </div>
    </div>
  )
}

function ReservationDetailsCard({
  reservation,
}: {
  reservation: Pick<ReservationDto, 'id' | 'status' | 'purchasedAt' | 'event'>
}) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent className="space-y-6">
        <InfoField
          icon="lucide:hash"
          label={t('reservations.detail.reservationId', 'Reservation ID')}
        >
          <span className="font-mono">{reservation.id}</span>
        </InfoField>


        <InfoField icon="lucide:ticket" label={t('reservations.detail.event', 'Event')}>
          <Link
            to="/events/$eventId"
            params={{ eventId: reservation.event.id.toString() }}
            className="hover:text-primary transition-colors"
          >
            {reservation.event.title}
          </Link>
        </InfoField>

        <InfoField
          icon="lucide:clock"
          label={t('reservations.detail.purchasedAt', 'Purchased At')}
        >
          {formatDateTime(reservation.purchasedAt)}
        </InfoField>
      </CardContent>
    </Card>
  )
}

function ReservationUserCard({
  user,
}: {
  user: UserDto
}) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('reservations.detail.user', 'User')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserDisplay user={user} linkToProfile size="lg" />
      </CardContent>
    </Card>
  )
}

