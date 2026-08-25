import { Bot, Box, Check, Cloud, Code2, Database, GitBranch, GraduationCap, Inbox, Mail, MessageCircle, Network, Radio, Rocket, Send, Server, ShieldCheck, Sparkles, TerminalSquare, TestTube2, Workflow } from 'lucide-react'

type Atmosphere = 'projects' | 'education' | 'experience' | 'contact'

export function SectionAtmosphere({ variant }: { variant: Atmosphere }) {
  if (variant === 'projects') {
    return (
      <div className="section-atmosphere projects-atmosphere" aria-hidden="true">
        <div className="ambient-console ambient-console--build"><TerminalSquare /><span>$ build portfolio-services</span><b>✓ success</b></div>
        <div className="ambient-service ambient-service--api"><Server /><span>api-gateway</span><small>healthy</small></div>
        <div className="ambient-service ambient-service--cloud"><Cloud /><span>cloud</span><small>synced</small></div>
        <div className="ambient-service ambient-service--deploy"><Rocket /><span>deploy</span><small>ready</small></div>
        <div className="ambient-service ambient-service--database"><Database /><span>database</span><small>replicated</small></div>
        <div className="ambient-service ambient-service--queue"><Workflow /><span>event-queue</span><small>3 events</small></div>
        <div className="ambient-service ambient-service--tests"><TestTube2 /><span>test-suite</span><small>passing</small></div>
        <div className="service-ping service-ping--one"><Radio /><span>PING</span><i/><b>ACK 12ms</b></div>
        <div className="service-ping service-ping--two"><Radio /><span>EVENT</span><i/><b>CONSUMED</b></div>
        <svg className="ambient-routes" viewBox="0 0 1200 720" preserveAspectRatio="none"><path d="M60 120 C260 120 250 300 470 300 S760 150 1140 190"/><path d="M80 610 C330 610 310 430 560 430 S910 600 1140 520"/></svg>
        <div className="ambient-code ambient-code--left"><Code2 /><i/><i/><i/><i/></div>
        <div className="ambient-code ambient-code--right"><GitBranch /><i/><i/><i/></div>
        <div className="ambient-packet ambient-packet--one">{`{ status: 200 }`}</div>
        <div className="ambient-packet ambient-packet--two">event.created</div>
      </div>
    )
  }

  if (variant === 'education') {
    return (
      <div className="section-atmosphere education-atmosphere" aria-hidden="true">
        <div className="learning-orbit"><span><GraduationCap /></span><span><Code2 /></span><span><Network /></span></div>
        <div className="learning-track"><b>foundation</b><i/><b>architecture</b><i/><b>specialization</b><i/><b>continuous learning</b></div>
        <div className="learning-progress learning-progress--one"><span>Clean Architecture</span><i><b /></i><small>complete</small></div>
        <div className="learning-progress learning-progress--two"><span>Distributed Systems</span><i><b /></i><small>in progress</small></div>
        <div className="learning-progress learning-progress--three"><span>AI Engineering</span><i><b /></i><small>learning</small></div>
        <div className="learning-console learning-console--one"><TerminalSquare /><span>$ compile knowledge.graph</span><b>12 nodes linked</b></div>
        <div className="learning-console learning-console--two"><ShieldCheck /><span>certificate.verify()</span><b>validated</b></div>
        <div className="learning-chip learning-chip--one"><Box />design patterns</div>
        <div className="learning-chip learning-chip--two"><Database />data systems</div>
        <div className="learning-chip learning-chip--three"><Cloud />cloud native</div>
        <div className="learning-signal"><i/><i/><i/><i/><i/></div>
      </div>
    )
  }

  if (variant === 'experience') {
    return (
      <div className="section-atmosphere experience-atmosphere" aria-hidden="true">
        <div className="ops-timeline"><i/><i/><i/><i/></div>
        <div className="ops-card ops-card--one"><span>01</span><b>discover</b><small>requirements mapped</small><Check /></div>
        <div className="ops-card ops-card--two"><span>02</span><b>architect</b><small>systems connected</small><Network /></div>
        <div className="ops-card ops-card--three"><span>03</span><b>deliver</b><small>impact measured</small><Rocket /></div>
        <div className="ops-pulse"><span>systems online</span><b>08</b><i/></div>
        <div className="ops-log ops-log--one"><Radio /><span>monitoring</span><b>nominal</b></div>
        <div className="ops-log ops-log--two"><ShieldCheck /><span>quality gate</span><b>passed</b></div>
        <div className="ops-log ops-log--three"><Workflow /><span>handoff</span><b>complete</b></div>
        <div className="ops-event-stream"><i>request</i><b>→</b><i>decision</i><b>→</b><i>delivery</i><b>→</b><i>feedback</i></div>
        <div className="ops-radar"><span/><i/><b/></div>
      </div>
    )
  }

  return (
    <div className="section-atmosphere contact-atmosphere" aria-hidden="true">
      <div className="mail-flight"><Mail /><i/><Send /></div>
      <div className="mail-flight mail-flight--return"><Inbox /><i/><Check /></div>
      <div className="mail-card mail-card--compose"><small>new_message</small><span>subject: let's build something</span><i/><i/><b><Send /> queued</b></div>
      <div className="chat-card"><div><Bot /><span>assistant</span><small>online</small></div><p>How can we turn your idea into a resilient system?</p><em><i/><i/><i/></em></div>
      <div className="chat-bubble chat-bubble--one"><MessageCircle /><span>message received</span></div>
      <div className="chat-bubble chat-bubble--two"><Sparkles /><span>reply prepared</span></div>
      <div className="mail-node mail-node--sender"><Mail /><span>sender</span><small>composing</small></div>
      <div className="mail-node mail-node--gateway"><Server /><span>mail gateway</span><small>processing</small></div>
      <div className="mail-node mail-node--inbox"><Inbox /><span>inbox</span><small>delivered</small></div>
      <div className="mail-packet mail-packet--one"><Mail /></div>
      <div className="mail-packet mail-packet--two"><MessageCircle /></div>
      <div className="delivery-log"><span>encrypt</span><i/><span>route</span><i/><span>deliver</span><i/><b>✓</b></div>
      <svg className="mail-routes" viewBox="0 0 1200 700" preserveAspectRatio="none"><path d="M120 520 C330 520 330 250 600 250 S880 510 1080 510"/><path d="M1080 580 C820 580 840 360 600 360 S350 600 120 600"/></svg>
    </div>
  )
}
