import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Check, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { type ResetPasswordFormSchema, resetPasswordSchema } from '@/shared/services/auth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Spinner } from '@/shared/ui/spinner'
import { useResetPassword } from '../hooks/useResetPassword'

export const ResetPasswordForm = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const { onSubmit, submitted } = useResetPassword(setError)

  return (
    <div className="flex w-full flex-col justify-center max-w-md mx-auto gap-6">
      <div className="flex flex-col text-center">
        <h2 className="text-3xl text-foreground font-bold">Redefinir Senha</h2>
        <p className="text-md text-muted-foreground">Informe sua nova senha para continuar</p>
      </div>

      {submitted && (
        <div className="bg-primary/15 flex items-center text-primary border border-primary/40 rounded-md p-2 gap-2">
          <Check className="size-4 shrink-0" />
          <p className="text-sm font-semibold">Senha redefinida com sucesso!</p>
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
            <Label htmlFor="password">Nova Senha</Label>
            <Input
              aria-invalid={!!errors.password || !!errors.root}
              autoComplete="new-password"
              disabled={isSubmitting || submitted}
              id="password"
              placeholder="Digite sua nova senha"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-sm text-destructive font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password">Confirmar Senha</Label>
            <Input
              aria-invalid={!!errors.confirmPassword || !!errors.root}
              autoComplete="new-password"
              disabled={isSubmitting || submitted}
              id="confirm-password"
              placeholder="Confirme sua nova senha"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-destructive font-medium">
                {errors.confirmPassword.message}
              </span>
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
            <span className="truncate">{isSubmitting ? 'Redefinindo...' : 'Redefinir'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
