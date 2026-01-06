import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Alert, AlertTitle } from '../ui/alert'
import type { RegisterDto } from '@/api'
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
import { register } from '@/api/sdk.gen'
import { zRegisterDto } from '@/api/zod.gen'
import { queryKeys } from '@/lib/query-keys'

interface RegisterDialogProps {
  children: React.ReactElement
}

export function RegisterDialog({ children }: RegisterDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterDto) =>
      register({ body: data, throwOnError: true }).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser })
      setOpen(false)
      navigate({ to: '/' })
    },
    onError: (error: Error) => {
      form.setErrorMap({
        onSubmit: {
          form: error.message,
          fields: {
          }
        }
      });
    }
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: zRegisterDto,
    },
    onSubmit: async ({ value }) => {
      await registerMutation.mutateAsync(value)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('auth.createAccountTitle', 'Create Account')}</DialogTitle>
          <DialogDescription>
            {t('auth.createAccountDescription', 'Enter your email and password to create a new account')}
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
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t('auth.email', 'Email')}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type='email'
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="john@doe.com"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>{t('auth.password', 'Password')}</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type='password'
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
              <Field>
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full"
                >
                  {t('auth.createAccountTitle', 'Create Account')}
                </Button>
              </Field>
            </DialogFooter>
          </FieldGroup>

        </form>
      </DialogContent>
    </Dialog>
  )
}

