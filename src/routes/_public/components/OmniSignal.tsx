import { useId } from 'react'
import type { Lang } from '@/shared/locales/dictionaries'

/*
 * Capa do card do Omni, na linguagem visual CYBER-FLUX: um mapa de nós sobre
 * fundo escuro, com os estados semânticos da identidade (verde entregue,
 * ciano em execução, âmbar aguardando decisão) sempre acompanhados de texto.
 * É decorativa: o card e o modal descrevem o projeto em texto.
 * O movimento fica restrito a prefers-reduced-motion: no-preference (index.css).
 */

const LABELS: Record<Lang, { status: string; tagline: string; legend: [string, string, string] }> = {
  pt: {
    status: 'Em construção',
    tagline: 'local-first · sempre ligado',
    legend: ['entregue', 'em execução', 'aguardando você'],
  },
  en: {
    status: 'Building',
    tagline: 'local-first · always on',
    legend: ['delivered', 'running', 'awaiting you'],
  },
}

const CORE = { x: 180, y: 92 }

const NODES = [
  { x: 66, y: 84, state: 'saved' },
  { x: 104, y: 136, state: 'saved' },
  { x: 228, y: 146, state: 'saved' },
  { x: 268, y: 56, state: 'active' },
  { x: 304, y: 118, state: 'attention' },
] as const

export function OmniSignal({ lang, size = 'card' }: { lang: Lang; size?: 'card' | 'hero' }) {
  const glowId = useId()
  const labels = LABELS[lang]

  return (
    <div className={`omni-signal omni-signal--${size}`} aria-hidden="true">
      <svg className="omni-signal__map" viewBox="0 0 360 192" preserveAspectRatio={size === 'hero' ? 'xMidYMid meet' : 'xMidYMid slice'}>
        <defs>
          <radialGradient id={glowId}>
            <stop offset="0%" stopColor="#5fd5dd" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#5fd5dd" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={CORE.x} cy={CORE.y} r="70" fill={`url(#${glowId})`} />
        {NODES.map(node => (
          <path
            key={`${node.x}-${node.y}`}
            className={`omni-signal__route omni-signal__route--${node.state}`}
            d={`M${CORE.x} ${CORE.y} Q${(CORE.x + node.x) / 2} ${node.y < CORE.y ? CORE.y : node.y} ${node.x} ${node.y}`}
          />
        ))}
        {NODES.map(node => (
          <rect
            key={`node-${node.x}-${node.y}`}
            className={`omni-signal__node omni-signal__node--${node.state}`}
            x={node.x - 5}
            y={node.y - 5}
            width="10"
            height="10"
            rx="2"
          />
        ))}
        <circle className="omni-signal__core-ring" cx={CORE.x} cy={CORE.y} r="17" />
        <circle className="omni-signal__core" cx={CORE.x} cy={CORE.y} r="8" />
      </svg>

      <div className="omni-signal__head">
        <span className="omni-signal__mark">OMNI</span>
        <span className="omni-signal__tagline">{labels.tagline}</span>
      </div>
      <span className="omni-signal__status">{labels.status}</span>
      <ul className="omni-signal__legend">
        <li className="omni-signal__legend-item omni-signal__legend-item--saved">{labels.legend[0]}</li>
        <li className="omni-signal__legend-item omni-signal__legend-item--active">{labels.legend[1]}</li>
        <li className="omni-signal__legend-item omni-signal__legend-item--attention">{labels.legend[2]}</li>
      </ul>
    </div>
  )
}
