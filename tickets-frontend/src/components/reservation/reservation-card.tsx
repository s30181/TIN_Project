import { Link } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import type { ReservationDto } from '@/api'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ReservationStatusBadge } from '@/components/shared/reservation-status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { formatEventDate } from '@/lib/utils'

interface ReservationCardProps {
  reservation: ReservationDto
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const { event, user } = reservation

  return (
    <Link
      to="/reservations/$reservationId"
      params={{ reservationId: reservation.id.toString() }}
    >
      <Card className={"group overflow-hidden border-none gap-4 transition-all hover:shadow-md cursor-pointer py-4 " + (user ? "pb-0" : "pb-4")}>
        <CardHeader className="px-4 pb-0">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg">
              {event.title}
            </CardTitle>
            <ReservationStatusBadge
              status={reservation.status}
              className="shrink-0"
            />
          </div>
        </CardHeader>

        <CardContent className="px-4 space-y-2">
          <div className="flex items-center text-sm text-neutral-400 mt-2">
            <Icon icon="lucide:calendar-days" className="w-4 h-4 mr-1.5" />
            {formatEventDate(event.startsAt)}
          </div>

        </CardContent>

        {user && <CardFooter className="px-4 py-2 bg-background/80">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <UserAvatar email={user.email} size="sm" />
            <span className="truncate">{user.email}</span>
          </div>
        </CardFooter>}
      </Card>
    </Link>
  )
}
