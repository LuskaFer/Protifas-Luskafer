import { Outlet } from '@tanstack/react-router'
import { HeroHighlight } from '@/shared/ui/hero-highlight'

export const AuthLayout = () => (
  <div className="bg-background flex items-center justify-center w-full min-h-screen">
    <div className="relative hidden lg:flex flex-col justify-center items-center w-1/2 min-h-screen h-full border-r border-border/50">
      <HeroHighlight containerClassName="absolute inset-0 min-h-screen" className="z-10 px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/20 ring-1 ring-primary/30">
            <span className="text-3xl font-extrabold text-primary">P</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Portifas</h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Engineering portfolio &amp; project management platform
          </p>
        </div>
      </HeroHighlight>
    </div>

    <div className="relative flex items-center justify-center w-full lg:w-1/2 min-h-screen h-full p-8">
      <Outlet />
    </div>
  </div>
)
