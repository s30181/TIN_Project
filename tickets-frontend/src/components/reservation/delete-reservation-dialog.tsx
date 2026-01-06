import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import type { ReservationDto } from '@/api'
import { deleteReservation } from '@/api/sdk.gen'
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

interface DeleteReservationDialogProps {
  reservation: ReservationDto
  trigger?: React.ReactElement
  redirectOnSuccess?: boolean
}

export function DeleteReservationDialog({
  reservation,
  trigger,
  redirectOnSuccess = true,
}: DeleteReservationDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deleteReservation({
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
      if (redirectOnSuccess) {
        navigate({ to: '/reservations', search: { page: 1 } })
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="destructive" size="sm">
              <Icon icon="lucide:trash-2" className="mr-2" />
              {t('reservations.delete.button', 'Delete')}
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('reservations.delete.title', 'Delete Reservation')}</DialogTitle>
          <DialogDescription>
            {t('reservations.delete.description', {
              event: reservation.event.title,
              defaultValue: `Are you sure you want to delete your reservation for "${reservation.event.title}"?`,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            disabled={deleteMutation.isPending}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending
              ? t('reservations.delete.deletingButton', 'Deleting...')
              : t('reservations.delete.confirmButton', 'Delete')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
