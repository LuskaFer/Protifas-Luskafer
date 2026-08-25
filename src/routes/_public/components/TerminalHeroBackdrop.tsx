import { Activity, Bot, Braces, CheckCircle2, Cpu, GitBranch, ServerCog, Sparkles } from 'lucide-react'

const logLines = [
  ['08:42:11', 'pipeline.checkout', 'healthy'],
  ['08:42:13', 'agent.review', 'running'],
  ['08:42:16', 'tests.integration', '24 passed'],
  ['08:42:19', 'deploy.production', 'ready'],
]

export function TerminalHeroBackdrop() {
  return (
    <div className="terminal-scene" aria-hidden="true">
      <div className="terminal-orbit terminal-orbit--one" />
      <div className="terminal-orbit terminal-orbit--two" />

      <div className="terminal-window terminal-window--logs">
        <div className="terminal-window__bar"><span /><span /><span /><small>automation.log</small></div>
        <div className="terminal-window__body">
          {logLines.map(([time, process, state], index) => (
            <div className="terminal-log" key={process} style={{ '--delay': `${index * 1.4}s` } as React.CSSProperties}>
              <span>{time}</span><strong>{process}</strong><em>{state}</em>
            </div>
          ))}
        </div>
      </div>

      <div className="terminal-window terminal-window--pipeline">
        <div className="terminal-window__bar"><GitBranch /><small>delivery.pipeline</small></div>
        <div className="terminal-pipeline">
          <span><Braces />build</span><i /><span><Bot />review</span><i /><span><CheckCircle2 />ship</span>
        </div>
      </div>

      <div className="terminal-window terminal-window--metrics">
        <div className="terminal-window__bar"><Activity /><small>runtime.metrics</small></div>
        <div className="terminal-metric"><span>availability</span><strong>99.98%</strong></div>
        <div className="terminal-chart"><i /><i /><i /><i /><i /><i /><i /><i /></div>
      </div>

      <div className="terminal-node terminal-node--api"><ServerCog /><span>API</span><small>12ms</small></div>
      <div className="terminal-node terminal-node--ai"><Sparkles /><span>AI agent</span><small>learning</small></div>
      <div className="terminal-node terminal-node--core"><Cpu /><span>core</span><small>online</small></div>
      <svg className="terminal-connections" viewBox="0 0 1200 720" preserveAspectRatio="none">
        <path d="M80 180 C280 180 260 360 470 360" />
        <path d="M1120 160 C920 160 940 350 730 350" />
        <path d="M90 590 C280 590 330 470 510 470" />
        <path d="M1110 580 C920 580 880 470 700 470" />
      </svg>
    </div>
  )
}
