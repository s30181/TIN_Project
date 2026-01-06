import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Icon } from '@iconify/react'
import type { UserDto } from '@/api'
import { deleteUser } from '@/api/sdk.gen'
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

interface DeleteUserDialogProps {
  user: UserDto
  trigger?: React.ReactElement
}

export function DeleteUserDialog({ user, trigger }: DeleteUserDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await deleteUser({
        path: { id: user.id },
        throwOnError: true,
        credentials: 'include',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allUsers })
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="destructive" size="sm">
              <Icon icon="lucide:trash-2" className="mr-2 h-4 w-4" />
              {t('common.delete', 'Delete')}
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('users.delete.title', 'Delete User')}</DialogTitle>
          <DialogDescription>
            {t('users.delete.description', {
              email: user.email,
              defaultValue: `Are you sure you want to delete "${user.email}"? This action cannot be undone.`,
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
              ? t('users.delete.deletingButton', 'Deleting...')
              : t('users.delete.confirmButton', 'Delete User')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
