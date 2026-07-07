import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { type LoginFormSchema, loginSchema } from '@/shared/services/auth'
import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Spinner } from '@/shared/ui/spinner'
import { useLogin } from '../hooks/useLogin'

export const LoginForm = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    defaultValues: { rememberMe: true },
    resolver: zodResolver(loginSchema),
  })

  const { onSubmit } = useLogin(setError)

  return (
    <div className="flex w-full flex-col justify-center max-w-md mx-auto gap-6">
      <div className="flex flex-col text-center">
        <h2 className="text-3xl text-foreground font-bold">Acesso Interno</h2>
        <p className="text-md text-muted-foreground">Entre com suas credenciais para continuar</p>
      </div>

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
              disabled={isSubmitting}
              id="email"
              placeholder="Digite seu email"
              type="email"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-sm text-destructive font-medium">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              aria-invalid={!!errors.password || !!errors.root}
              autoComplete="password"
              disabled={isSubmitting}
              id="password"
              placeholder="Sua senha"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-sm text-destructive font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col min-[425px]:flex-row items-center justify-between gap-4">
            <div className="flex flex-row items-center justify-center gap-2">
              <Checkbox id="remember" {...register('rememberMe')} />
              <Label className="text-muted-foreground cursor-pointer" htmlFor="remember">
                Lembrar-me
              </Label>
            </div>

            <Button
              onClick={() => navigate({ to: '/forgot-password' })}
              size="sm"
              type="button"
              variant="link"
            >
              Esqueci minha senha
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Button
            className="w-full md:flex-1"
            disabled={isSubmitting}
            onClick={() => navigate({ to: '/' })}
            size="lg"
            type="button"
            variant="outline"
          >
            Voltar
          </Button>
          <Button
            className="w-full md:flex-1"
            disabled={isSubmitting}
            size="lg"
            type="submit"
            variant="primary"
          >
            {isSubmitting && <Spinner className="shrink-0" size="sm" />}
            <span className="truncate">{isSubmitting ? 'Entrando...' : 'Entrar'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
