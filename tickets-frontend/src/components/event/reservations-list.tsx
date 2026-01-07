import { useTranslation } from 'react-i18next'
import type { ReservationDto } from '@/api/types.gen'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReservationStatusBadge } from '@/components/shared/reservation-status-badge'
import { UserDisplay } from '@/components/shared/user-avatar'
import { formatDateTimeWithTime } from '@/lib/utils'

interface ReservationsListProps {
  reservations: Array<ReservationDto>
  isOrganizer: boolean
}

export function ReservationsList({
  reservations,
  isOrganizer,
}: ReservationsListProps) {
  const { t } = useTranslation()
  const title = isOrganizer
    ? t('reservations.allReservations', 'All Reservations')
    : t('reservations.myReservations', 'My Reservations')

  if (reservations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {t('reservations.noReservations', 'No reservations found.')}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ReservationsTable
          reservations={reservations}
          showUser={isOrganizer}
        />
      </CardContent>
    </Card>
  )
}

function ReservationsTable({
  reservations,
  showUser: showUser,
}: {
  reservations: Array<ReservationDto>
  showUser: boolean
}) {
  const { t } = useTranslation()

  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-neutral-800/50 data-[state=selected]:bg-neutral-800">
            {showUser && (
              <th className="h-12 px-4 align-middle font-medium text-neutral-400">
                {t('reservations.table.user', 'User')}
              </th>
            )}
            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-400">
              {t('reservations.table.status', 'Status')}
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-400">
              {t('reservations.table.purchasedAt', 'Purchased At')}
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {reservations.map((reservation) => (
            <ReservationRow
              key={reservation.id}
              reservation={reservation}
              showUser={showUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ReservationRow({
  reservation,
  showUser,
}: {
  reservation: ReservationDto
  showUser: boolean
}) {
  return (
    <tr className="border-b transition-colors hover:bg-neutral-800/50 data-[state=selected]:bg-neutral-800">
      {showUser && reservation.user && (
        <td className="p-4 align-middle">
          <UserDisplay user={reservation.user} size="sm" />
        </td>
      )}
      <td className="p-4 align-middle">
        <ReservationStatusBadge status={reservation.status} />
      </td>
      <td className="p-4 align-middle">
        {formatDateTimeWithTime(reservation.purchasedAt)}
      </td>
    </tr>
  )
}
