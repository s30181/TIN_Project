import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ReserveEventDto } from '@/api'
import { getEvents, getMyReservations, reserveEvent } from '@/api/sdk.gen'
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

interface CreateReservationDialogProps {
  children?: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateReservationDialog({
  children,
  open,
  onOpenChange,
}: CreateReservationDialogProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { data: eventsData } = useQuery({
    queryKey: queryKeys.events(1, 100),
    queryFn: () =>
      getEvents({ query: { page: 1, limit: 100 }, throwOnError: true }),
    enabled: open,
  })

  const { data: myReservations } = useQuery({
    queryKey: queryKeys.myReservations,
    queryFn: () => getMyReservations({ throwOnError: true }).then((res) => res.data),
    enabled: open,
  })

  const availableEvents = useMemo(() => {
    return eventsData?.data.events.filter((event) => {
      const hasReservation = myReservations?.some((r) => r.eventId === event.id)
      return !hasReservation
    }) ?? []
  }, [eventsData?.data.events, myReservations])

  const createMutation = useMutation({
    mutationFn: async (data: ReserveEventDto) => {
      const response = await reserveEvent({
        body: data,
        throwOnError: true,
        credentials: 'include',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations() })
      queryClient.invalidateQueries({ queryKey: queryKeys.myReservations })
      onOpenChange?.(false)
      form.reset()
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
      eventId: undefined as number | undefined,
      status: 'reserved' as 'paid' | 'reserved',
    },
    onSubmit: async ({ value }) => {
      if (!value.eventId) return
      await createMutation.mutateAsync({
        eventId: value.eventId,
        status: value.status,
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger render={children} />}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('reservations.create.title', 'Create Reservation')}</DialogTitle>
          <DialogDescription>
            {t('reservations.create.description', 'Select an event to reserve')}
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
                      <SelectValue
                        placeholder={t('reservations.form.selectEvent', 'Select an event')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEvents.length === 0 ? (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                          {t('reservations.form.noAvailableEvents', 'No available events')}
                        </div>
                      ) : (
                        availableEvents.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

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
                      <SelectValue
                        placeholder={t('reservations.form.selectStatus', 'Select status')}
                      />
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

            {!form.state.isFormValid && (
              <Alert variant="destructive">
                <AlertTitle>{form.state.errors.join(', ')}</AlertTitle>
              </Alert>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange?.(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending
                  ? t('reservations.create.creatingButton', 'Creating...')
                  : t('reservations.create.createButton', 'Create Reservation')}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
