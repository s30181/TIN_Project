import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Alert, AlertTitle } from '../ui/alert'
import type { LoginDto } from '@/api'
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
import { login } from '@/api/sdk.gen'
import { zLoginDto } from '@/api/zod.gen'
import { queryKeys } from '@/lib/query-keys'

interface LoginDialogProps {
  children: React.ReactElement
}

export function LoginDialog({ children }: LoginDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async (data: LoginDto) =>
      login({ body: data, throwOnError: true }).then((response) => response.data),
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
      onSubmit: zLoginDto,
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value)
    },
  })


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('auth.signInTitle', 'Sign In')}</DialogTitle>
          <DialogDescription>
            {t('auth.signInDescription', 'Enter your email and password to sign in to your account.')}
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
                      placeholder="joe@bloggs.com"
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
                  disabled={loginMutation.isPending}
                  className="w-full"
                >
                  {t('auth.signInTitle', 'Sign In')}
                </Button>
              </Field>
            </DialogFooter>
          </FieldGroup>

        </form>
      </DialogContent>
    </Dialog>
  )
}

