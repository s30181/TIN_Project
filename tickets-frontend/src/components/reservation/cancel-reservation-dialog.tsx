import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Icon } from '@iconify/react'
import type { ReservationDto } from '@/api'
import { cancelReservation } from '@/api/sdk.gen'
import { queryKeys } from '@/lib/query-keys'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface CancelReservationDialogProps {
  reservation: ReservationDto
  trigger?: React.ReactElement
}

export function CancelReservationDialog({
  reservation,
  trigger,
}: CancelReservationDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await cancelReservation({
        path: { id: reservation.id },
        throwOnError: true,
        credentials: 'include',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
      queryClient.invalidateQueries({ queryKey: queryKeys.reservation(reservation.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.myReservations })
      queryClient.invalidateQueries({ queryKey: queryKeys.eventReservations(reservation.eventId) })
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline" size="sm">
              <Icon icon="lucide:x-circle" className="mr-2" />
              {t('reservations.cancel.button', 'Cancel')}
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('reservations.cancel.title', 'Cancel Reservation')}</DialogTitle>
          <DialogDescription>
            {t('reservations.cancel.description', {
              event: reservation.event.title,
              defaultValue: `Are you sure you want to cancel your reservation for "${reservation.event.title}"?`,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            disabled={cancelMutation.isPending}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending
              ? t('reservations.cancel.cancellingButton', 'Cancelling...')
              : t('reservations.cancel.confirmButton', 'Cancel Reservation')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
