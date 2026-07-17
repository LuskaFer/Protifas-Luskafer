import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export interface HeroHighlightProps {
  children: ReactNode
  className?: string
  containerClassName?: string
}

export function HeroHighlight({ children, className, containerClassName }: HeroHighlightProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={cn(
        'group relative flex w-full items-center justify-center bg-background',
        containerClassName,
      )}
      onMouseMove={handleMouseMove}
      role="none"
    >
      <div className="pointer-events-none absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800" />
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              500px circle at ${mouseX}px ${mouseY}px,
              hsl(215 10% 60% / 0.15) 0%,
              hsl(215 10% 60% / 0.05) 40%,
              transparent 70%
            )
          `,
        }}
      />
      <div className={cn('relative z-20', className)}>{children}</div>
    </div>
  )
}

export interface HighlightProps {
  children: ReactNode
  className?: string
}

export function Highlight({ children, className }: HighlightProps) {
  return (
    <motion.span
      className={cn(
        'relative inline-block',
        'after:absolute after:inset-0 after:block after:bg-primary/20 after:-z-10',
        'after:scale-x-0 after:origin-left after:rounded-md after:px-1 after:-mx-1',
        className,
      )}
      initial={{ backgroundSize: '0% 100%' }}
      whileInView={{ backgroundSize: '100% 100%' }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      viewport={{ once: true }}
      style={{
        backgroundImage:
          'linear-gradient(90deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--primary) / 0.08) 50%, hsl(var(--primary) / 0.15) 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left bottom',
      }}
    >
      {children}
    </motion.span>
  )
}
