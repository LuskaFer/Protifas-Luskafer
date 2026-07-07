import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Check, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { type ForgotPasswordFormSchema, forgotPasswordSchema } from '@/shared/services/auth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Spinner } from '@/shared/ui/spinner'
import { useForgotPassword } from '../hooks/useForgotPassword'

export const ForgotPasswordForm = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const { onSubmit, submitted } = useForgotPassword(setError)

  return (
    <div className="flex w-full flex-col justify-center max-w-md mx-auto gap-6">
      <div className="flex flex-col text-center">
        <h2 className="text-3xl text-foreground font-bold">Recuperar Acesso</h2>
        <p className="text-md text-muted-foreground">
          Informe seu e-mail institucional. Enviaremos um link para você redefinir sua senha.
        </p>
      </div>

      {submitted && (
        <div className="bg-primary/15 flex items-center text-primary border border-primary/40 rounded-md p-2 gap-2">
          <Check className="size-4 shrink-0" />
          <p className="text-sm font-semibold">
            Se houver uma conta associada, você receberá instruções por email para continuar.
          </p>
        </div>
      )}

      {errors.root && (
        <div className="bg-destructive/15 flex items-center text-destructive border border-destructive/40 rounded-md p-2 gap-2">
          <X className="size-4 shrink-0" />
          <p className="text-sm font-semibold">{errors.root.message}</p>
        </div>
      )}

      <form className="flex flex-col w-full gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              aria-invalid={!!errors.email || !!errors.root}
              autoComplete="email"
              disabled={isSubmitting || submitted}
              id="email"
              placeholder="Digite seu email"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-sm text-destructive font-medium">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Button
            className="w-full md:flex-1"
            disabled={isSubmitting}
            onClick={() => navigate({ to: '/login' })}
            size="lg"
            type="button"
            variant="outline"
          >
            Voltar
          </Button>
          <Button
            className="w-full md:flex-1"
            disabled={isSubmitting || submitted}
            size="lg"
            type="submit"
            variant="primary"
          >
            {isSubmitting && <Spinner className="shrink-0" size="sm" />}
            <span className="truncate">{isSubmitting ? 'Enviando...' : 'Enviar'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
