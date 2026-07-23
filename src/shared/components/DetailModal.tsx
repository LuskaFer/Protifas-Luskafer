import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  subtitle?: string
  period?: string
  gallery?: string[]
  link?: string
  techIcons?: string[]
  thumbnail?: string | null
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  description,
  subtitle,
  period,
  gallery,
  link,
  techIcons,
  thumbnail,
}: DetailModalProps) {
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
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border rounded-2xl shadow-2xl flex flex-col"
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

            {techIcons && techIcons.length > 0 ? (
              <div className="w-full h-64 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap content-center items-center justify-center gap-6 p-6 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-slate-500/10 blur-3xl rounded-full" />
                {techIcons.map((iconClass, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-800/80 border border-slate-600/50 rounded-2xl shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-10"
                  >
                    <i className={`${iconClass} text-5xl drop-shadow-[0_0_10px_rgba(255, 255, 255, 0.3)]`} />
                  </div>
                ))}
              </div>
            ) : thumbnail ? (
              <div className="w-full h-64 shrink-0 relative">
                <img src={thumbnail} alt="Cover" className="w-full h-full object-cover rounded-t-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>
            ) : null}

            <div className="p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
              {period ? (
                <p className="text-sm font-medium text-primary mb-6">{period}</p>
              ) : subtitle ? (
                <p className="text-sm font-medium text-primary mb-6">{subtitle}</p>
              ) : null}

              <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {description}
              </p>

              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 font-medium rounded-lg transition-colors"
                >
                  <ExternalLink className="size-4" />
                  {link.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}
                </a>
              )}

              {/* ═══════════════════════════════════════════════════════════════
                  MINI-GALLERY SECTION
                  To add images to a project or experience, populate the
                  `gallery: string[]` array inside the respective object in:
                    - src/routes/_public/index.tsx (MOCK_PROJECTS or MOCK_EXPERIENCES)
                  Example:
                    gallery: [
                      '/images/my-photo.jpg',
                      'https://imgur.com/abc123.jpg',
                    ]
                   Supports up to 15 images, local paths or external URLs.
                  ═══════════════════════════════════════════════════════════════ */}
              {gallery && gallery.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Galeria do Projeto</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.slice(0, 15).map((imgUrl, idx) => (
                      <a
                        key={idx}
                        href={imgUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block relative h-32 sm:h-40 overflow-hidden rounded-xl border border-border group"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery image ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
