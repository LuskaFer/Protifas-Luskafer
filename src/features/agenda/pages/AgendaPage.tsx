import { AgendaEventList } from '@/features/agenda/components/agenda-event-list'
import { AgendaHeader } from '@/features/agenda/components/agenda-header'
import { AgendaSidebar } from '@/features/agenda/components/agenda-sidebar'

export function AgendaPage() {
  return (
    <div className="bg-background w-full max-w-full overflow-x-hidden h-[calc(100vh-64px)] lg:h-[calc(100vh-65px)] flex flex-col min-w-0">
      <AgendaHeader />

      <div className="flex-1 flex overflow-hidden min-w-0">
        <aside className="w-[380px] shrink-0 border-r border-border hidden lg:flex flex-col bg-card">
          <AgendaSidebar />
        </aside>

        <div className="flex-1 overflow-hidden bg-muted/10 flex flex-col min-w-0">
          <div className="p-4 md:p-8 flex-1 overflow-y-auto flex flex-col min-w-0">
            <AgendaEventList />
          </div>
        </div>
      </div>
    </div>
  )
}
