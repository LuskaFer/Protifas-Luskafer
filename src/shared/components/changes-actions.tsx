import { useIsMobile } from '@/shared/hooks/use-mobile'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { Spinner } from '@/shared/ui/spinner'

interface ChangesActionsProps {
  onDiscard: () => void
  onSave: () => void
  isDisabled?: boolean
  isSaving?: boolean
  hasChanges?: boolean
  size?: 'sm' | 'default' | 'lg'
  discardLabel?: string
  discardLabelMobile?: string
  saveLabel?: string
  saveLabelMobile?: string
  savingLabel?: string
  className?: string
}

export function ChangesActions({
  onDiscard,
  onSave,
  isDisabled = false,
  isSaving = false,
  hasChanges,
  size = 'sm',
  discardLabel = 'Descartar Alterações',
  discardLabelMobile,
  saveLabel = 'Salvar Alterações',
  saveLabelMobile,
  savingLabel,
  className,
}: ChangesActionsProps) {
  const isMobile = useIsMobile()
  const isBlocked = isDisabled || isSaving || (typeof hasChanges === 'boolean' && !hasChanges)
  const discardText = isMobile ? (discardLabelMobile ?? discardLabel) : discardLabel
  const saveText = isMobile ? (saveLabelMobile ?? saveLabel) : saveLabel
  const showSaving = Boolean(isSaving && savingLabel)
  const buttonClassName = cn(isMobile && 'flex-1')

  return (
    <div className={cn('flex gap-2', className)}>
      <Button
        className={buttonClassName}
        disabled={isBlocked}
        onClick={onDiscard}
        size={size}
        variant="outline"
      >
        {discardText}
      </Button>
      <Button
        className={buttonClassName}
        disabled={isBlocked}
        onClick={onSave}
        size={size}
        variant="primary"
      >
        {showSaving ? (
          <>
            <Spinner className="mr-2" size="sm" />
            {savingLabel}
          </>
        ) : (
          saveText
        )}
      </Button>
    </div>
  )
}
