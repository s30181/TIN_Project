import { Link } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import type { EventDto } from '@/api/types.gen'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatEventDate, formatPrice } from '@/lib/utils'

interface EventCardProps {
  event: EventDto
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: event.id.toString() }}
      className="block"
    >
      <Card className="group overflow-hidden border-none gap-4 transition-all hover:shadow-md cursor-pointer py-4">
        <CardHeader className="px-4 pb-0">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          {event.location && (
            <CardDescription className="flex items-center gap-1.5 text-sm mt-1">
              <Icon icon="lucide:map-pin" className="w-4 h-4" /> {event.location}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="px-4">
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-sm text-neutral-400">
              <Icon icon="lucide:calendar-days" className="w-4 h-4 mr-1.5" />
              {formatEventDate(event.startsAt)}
            </div>
            <div className="font-bold text-lg text-primary">
              {formatPrice(event.price)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
