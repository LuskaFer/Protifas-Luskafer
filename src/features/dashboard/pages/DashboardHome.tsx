import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const NOW = new Date()
const CURRENT_YEAR = NOW.getFullYear()
const CURRENT_MONTH = NOW.getMonth()
const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]
const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const KANBAN_DAYS = [3, 7, 12, 15, 19, 22, 26, 29]
const MEETING_DAYS = [2, 9, 16, 23]

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function getDayStatus(day: number): { label: string; busy: boolean; meeting: boolean } | null {
  const isKanban = KANBAN_DAYS.includes(day)
  const isMeeting = MEETING_DAYS.includes(day)
  if (isKanban && isMeeting) return { label: 'Tech Mtg + Tasks', busy: true, meeting: true }
  if (isKanban) return { label: 'Kanban Tasks', busy: true, meeting: false }
  if (isMeeting) return { label: 'Tech Meeting', busy: false, meeting: true }
  return null
}

const MONTHLY_CONTACTS = [
  { month: 'Jan', contacts: 2 },
  { month: 'Fev', contacts: 1 },
  { month: 'Mar', contacts: 3 },
  { month: 'Abr', contacts: 2 },
  { month: 'Mai', contacts: 2 },
  { month: 'Jun', contacts: 4 },
]

const PAGE_VIEWS = Array.from({ length: 30 }, (_, i) => {
  const base = 120 + Math.sin(i * 0.3) * 40 + i * 6
  return {
    date: `Dia ${i + 1}`,
    views: Math.round(base + Math.random() * 25),
  }
})

export function DashboardHome() {
  const daysInMonth = getDaysInMonth(CURRENT_YEAR, CURRENT_MONTH)
  const firstDay = getFirstDayOfMonth(CURRENT_YEAR, CURRENT_MONTH)
  const monthLabel = `${MONTH_NAMES[CURRENT_MONTH]} ${CURRENT_YEAR}`
  const today = NOW.getDate()

  const calendarDays: { day: number; status: ReturnType<typeof getDayStatus> }[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, status: getDayStatus(d) })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Weekly overview and portfolio analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Calendar Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">{monthLabel}</h2>

          <div className="grid grid-cols-7 gap-1">
            {DAY_NAMES.map(d => (
              <div
                key={d}
                className="py-1 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                {d}
              </div>
            ))}

            {Array.from({ length: firstDay }, (_, i) => i).map(i => (
              <div key={`empty-${i}`} />
            ))}

            {calendarDays.map(({ day, status }) => {
              const isToday = day === today
              const isKanban = status?.busy
              const isMeeting = status?.meeting

              return (
                <div
                  key={day}
                  className={`relative flex items-center justify-center rounded-lg py-2 text-sm transition-colors ${
                    isToday
                      ? 'bg-primary text-primary-foreground font-bold ring-2 ring-primary/40'
                      : isKanban
                        ? 'bg-blue-500/15 text-blue-300 font-medium'
                        : isMeeting
                          ? 'bg-amber-500/15 text-amber-300 font-medium'
                          : 'text-muted-foreground hover:bg-slate-800'
                  }`}
                >
                  {day}
                  {status && (
                    <span
                      className={`absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full ${
                        isKanban ? 'bg-blue-400' : 'bg-amber-400'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-800 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-400" />
              Kanban Tasks (In Progress)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-400" />
              Tech Meeting
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" />
              Hoje
            </div>
          </div>
        </div>

        {/* Page Views Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Portfolio Page Views</h2>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={PAGE_VIEWS}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--sidebar)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--sidebar-foreground)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  dataKey="views"
                  fill="url(#viewsGradient)"
                  stroke="#2563eb"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contacts Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Freelance / Recruiter Contacts
            </h2>
            <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={MONTHLY_CONTACTS}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--sidebar)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--sidebar-foreground)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="contacts" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Events mini-card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Upcoming Events</h2>
          <div className="space-y-3">
            {UPCOMING_EVENTS.map(event => (
              <div
                key={event.title}
                className="flex items-start gap-3 rounded-lg border border-slate-800/50 bg-slate-950/50 p-3 transition-colors hover:border-slate-700"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {event.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{event.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const UPCOMING_EVENTS = [
  {
    title: 'Tech Meeting — Sprint Review',
    description: 'Review kanban tasks and plan next sprint',
    icon: (
      <svg
        aria-label="Calendar"
        className="size-5"
        fill="none"
        role="img"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    date: 'Qua, 9',
  },
  {
    title: 'Code Review Session',
    description: 'Review open PRs for the portfolio platform',
    icon: (
      <svg
        aria-label="Code"
        className="size-5"
        fill="none"
        role="img"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    date: 'Sex, 11',
  },
  {
    title: 'Tech Meeting — Weekly Sync',
    description: 'Weekly alignment with the team',
    icon: (
      <svg
        aria-label="Calendar"
        className="size-5"
        fill="none"
        role="img"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    date: 'Qua, 16',
  },
]
