import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { Icon } from '@iconify/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReservationDto, UpdateReservationDto } from '@/api'
import { getEvents, getUserTickets, updateReservation } from '@/api/sdk.gen'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { queryKeys } from '@/lib/query-keys'

interface EditReservationDialogProps {
  reservation: ReservationDto
  trigger?: React.ReactElement
}

export function EditReservationDialog({
  reservation,
  trigger,
}: EditReservationDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: eventsData } = useQuery({
    queryKey: queryKeys.events(1, 100),
    queryFn: () => getEvents({ query: { page: 1, limit: 100 }, throwOnError: true }),
    enabled: open,
  })

  const { data: ownerReservations } = useQuery({
    queryKey: queryKeys.userReservations(reservation.userId),
    queryFn: () =>
      getUserTickets({ path: { id: reservation.userId }, throwOnError: true }).then(
        (res) => res.data
      ),
    enabled: open,
  })

  const availableEvents = useMemo(() => {
    return eventsData?.data.events.filter((event) => {
      if (event.id === reservation.eventId) return true

      const hasReservation = ownerReservations?.some(
        (r) => r.eventId === event.id && r.id !== reservation.id
      )
      return !hasReservation
    }) ?? []
  }, [eventsData?.data.events, ownerReservations, reservation.eventId, reservation.id])

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateReservationDto) => {
      const response = await updateReservation({
        path: { id: reservation.id },
        body: data,
        throwOnError: true,
        credentials: 'include',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservation(reservation.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
      queryClient.invalidateQueries({ queryKey: queryKeys.myReservations })
      queryClient.invalidateQueries({ queryKey: queryKeys.userReservations(reservation.userId) })
      setOpen(false)
    },
    onError: (error: Error) => {
      form.setErrorMap({
        onSubmit: {
          form: error.message,
          fields: {},
        },
      })
    },
  })

  const form = useForm({
    defaultValues: {
      eventId: reservation.eventId,
      status: reservation.status as 'paid' | 'reserved',
    },
    onSubmit: async ({ value }) => {
      const updateData: UpdateReservationDto = {}

      if (value.eventId !== reservation.eventId) {
        updateData.eventId = value.eventId
      }

      if (value.status !== reservation.status) {
        updateData.status = value.status
      }

      if (Object.keys(updateData).length > 0) {
        await updateMutation.mutateAsync(updateData)
      } else {
        setOpen(false)
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline" size="sm">
              <Icon icon="lucide:pencil" className="mr-2" />
              {t('reservations.edit.button', 'Edit')}
            </Button>
          )
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('reservations.edit.title', 'Edit Reservation')}</DialogTitle>
          <DialogDescription>
            {t('reservations.edit.description', 'Update your reservation details')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <form.Field
              name="eventId"
              children={(field) => (
                <Field>
                  <FieldLabel>{t('reservations.form.event', 'Event')}</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as number)}
                    items={availableEvents.map((e) => ({ value: e.id, label: e.title }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('reservations.form.selectEvent', 'Select an event')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {reservation.status !== 'cancelled' && (
              <form.Field
                name="status"
                children={(field) => (
                  <Field>
                    <FieldLabel>{t('reservations.form.status', 'Status')}</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(val as 'paid' | 'reserved')
                      }
                      items={[
                        { value: 'reserved', label: t('user.tickets.statusReserved', 'Reserved') },
                        { value: 'paid', label: t('user.tickets.statusPaid', 'Paid') },
                      ]}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('reservations.form.selectStatus', 'Select status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reserved">
                          {t('user.tickets.statusReserved', 'Reserved')}
                        </SelectItem>
                        <SelectItem value="paid">
                          {t('user.tickets.statusPaid', 'Paid')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            )}

            {!form.state.isFormValid && (
              <Alert variant="destructive">
                <AlertTitle>{form.state.errors.join(', ')}</AlertTitle>
              </Alert>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending
                  ? t('reservations.edit.savingButton', 'Saving...')
                  : t('reservations.edit.saveButton', 'Save Changes')}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
