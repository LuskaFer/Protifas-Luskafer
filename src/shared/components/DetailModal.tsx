import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  subtitle?: string
  period?: string
  tags?: string[]
  gallery?: string[]
  link?: string
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  description,
  subtitle,
  period,
  tags,
  gallery,
  link,
}: DetailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
                {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
                {period && <p className="mt-0.5 text-xs text-slate-500">{period}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
              {description}
            </p>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-6">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
              >
                <ExternalLink className="size-4" />
                {link.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}
              </a>
            )}

            {gallery && gallery.length > 0 && (
              <div
                className={`mt-6 grid gap-3 ${
                  gallery.length === 1
                    ? 'grid-cols-1'
                    : gallery.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                }`}
              >
                {gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${title} image ${i + 1}`}
                    className="rounded-lg object-cover w-full h-32 sm:h-40"
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
