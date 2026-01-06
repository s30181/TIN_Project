import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UserDto, UpdateUserDto } from '@/api'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
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
import { updateUser } from '@/api/sdk.gen'
import { zUpdateUserDto } from '@/api/zod.gen'
import { queryKeys } from '@/lib/query-keys'

interface EditUserDialogProps {
  user: UserDto
  trigger?: React.ReactElement
}

export function EditUserDialog({ user, trigger }: EditUserDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateUserDto) => {
      const response = await updateUser({
        path: { id: user.id },
        body: data,
        throwOnError: true,
        credentials: 'include',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.allUsers })
      queryClient.invalidateQueries({ queryKey: queryKeys.user(user.id) })
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
      email: user.email,
      role: user.role,
    },
    validators: {
      onSubmit: zUpdateUserDto as any // Remoe any here,
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync({
        email: value.email,
        role: value.role,
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button variant="outline" size="sm">
              <Icon icon="lucide:pencil" className="mr-2 h-4 w-4" />
              {t('common.edit', 'Edit')}
            </Button>
          )
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('users.form.editTitle', 'Edit User')}</DialogTitle>
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
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('users.form.email', 'Email')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="user@example.com"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            <form.Field
              name="role"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t('users.form.role', 'Role')}
                    </FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as UserDto['role'])
                      }
                      items={[
                        { value: 'user', label: t('users.roles.user', 'User') },
                        { value: 'admin', label: t('users.roles.admin', 'Admin') },
                      ]}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          {t('users.roles.user', 'User')}
                        </SelectItem>
                        <SelectItem value="admin">
                          {t('users.roles.admin', 'Admin')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            {!form.state.isFormValid && (
              <Alert variant="destructive">
                {form.state.errors.filter(Boolean).map((error, index) => (
                  <AlertTitle key={index}>{String(error)}</AlertTitle>
                ))}
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
                  ? t('users.form.savingButton', 'Saving...')
                  : t('users.form.saveButton', 'Save Changes')}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
