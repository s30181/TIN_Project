import { useTranslation } from 'react-i18next'
import type { ReservationDto } from '@/api/types.gen'
import { Badge } from '@/components/ui/badge'

type ReservationStatus = ReservationDto['status']

interface ReservationStatusBadgeProps {
  status: ReservationStatus
  className?: string
}

const statusVariants: Record<
  ReservationStatus,
  'success' | 'warning' | 'destructive'
> = {
  paid: 'success',
  reserved: 'warning',
  cancelled: 'destructive',
}

export function ReservationStatusBadge({
  status,
  className,
}: ReservationStatusBadgeProps) {
  const { t } = useTranslation()

  const statusLabels: Record<ReservationStatus, string> = {
    paid: t('user.tickets.statusPaid', 'Paid'),
    reserved: t('user.tickets.statusReserved', 'Reserved'),
    cancelled: t('user.tickets.statusCancelled', 'Cancelled'),
  }

  return (
    <Badge
      variant={statusVariants[status]}
      className={`capitalize ${className ?? ''}`}
    >
      {statusLabels[status]}
    </Badge>
  )
}
