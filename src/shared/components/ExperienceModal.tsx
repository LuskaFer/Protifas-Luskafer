import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface ExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  role: string
  company: string
  period: string
  description: string
}

export function ExperienceModal({
  isOpen,
  onClose,
  role,
  company,
  period,
  description,
}: ExperienceModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border rounded-2xl shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-30 bg-primary text-primary-foreground hover:opacity-90 p-2 rounded-full transition-all"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            <div className="p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-foreground mb-1">{role}</h2>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-1">
                <p className="text-lg font-medium text-primary">{company}</p>
                <p className="text-lg font-medium text-primary">{period}</p>
              </div>

              <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
