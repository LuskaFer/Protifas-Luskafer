import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const overlayVariants = cva('absolute inset-0', {
  variants: {
    variant: {
      default: 'bg-black/60',
      primary:
        "before:content-[''] before:absolute before:inset-0 before:bg-secondary-dark/60 after:content-[''] after:absolute after:inset-0 after:bg-black/80",
      secondary:
        "before:content-[''] before:absolute before:inset-0 before:bg-black/60 after:content-[''] after:absolute after:inset-0 after:bg-secondary-dark/20",
      hover: 'bg-black/0 hover:bg-black/30 group-hover:bg-black/30 transition-colors duration-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function Overlay({
  variant,
  className,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof overlayVariants>) {
  return <div className={cn(overlayVariants({ variant, className }))} {...props} />
}

export { Overlay }
