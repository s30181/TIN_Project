import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Icon } from '@iconify/react'
import type { EventDto } from '@/api'
import { deleteEvent } from '@/api/sdk.gen'
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

interface DeleteEventDialogProps {
  event: EventDto
  trigger?: React.ReactElement
}

export function DeleteEventDialog({ event, trigger }: DeleteEventDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deleteEvent({
        path: { id: event.id },
        throwOnError: true,
        credentials: 'include',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events() })
      setOpen(false)
      navigate({ to: '/events', search: { page: 1 } })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="destructive" size="sm">
              <Icon icon="lucide:trash-2" className="mr-2" />
              {t('common.delete', 'Delete')}
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('events.delete.title', 'Delete Event')}</DialogTitle>
          <DialogDescription>
            {t('events.delete.description', { title: event.title, defaultValue: `Are you sure you want to delete "${event.title}"?` })}
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
            {deleteMutation.isPending ? t('events.delete.deletingButton', 'Deleting...') : t('events.delete.confirmButton', 'Delete Event')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
