# Manual de Padrões Arquiteturais — Portifas

## Versão: 2.0 — Dumb Components, Smart Hooks + Use Case Hooks

Este documento define o padrão de divisão de responsabilidades entre páginas, componentes e hooks.

---

## 1. Filosofia: Pages e Componentes "Burros"

Pages e componentes de UI **não devem conter lógica de negócio, estado de servidor ou mutações**.

A regra é simples:
- **Pages** — apenas montam o layout e renderizam componentes. Zero hooks, zero estado.
- **Componentes de UI** — recebem dados via props, renderizam tela. Podem ter estado puramente visual (ex: modal aberto/fechado).
- **Views / Containers** — componentes orquestradores que **podem** usar hooks e gerenciar estado local. São o ponto único onde lógica de negócio e UI se encontram.
- **Hooks** — encapsulam toda lógica de dados, chamadas de API, TanStack Query, formulários, etc.

### Hierarquia de arquivos

```text
src/features/[feature]/
├── components/
│   ├── dumb-ui-component.tsx      # Só props, sem lógica
│   └── FeatureView.tsx            # Container "esperto" — usa hooks, gerencia estado, orquestra sub-componentes
├── hooks/
│   ├── useGetData.ts              # useQuery
│   └── useMutations.ts            # useMutation
├── pages/
│   └── FeaturePage.tsx            # Dumb — só renderiza <FeatureView /> dentro de layout
└── [feature].ts                   # Barrel file
```

---

## 2. Regras por Camada

### Pages — Somente Layout (`pages/`)

- **Proibido:** importar `useState`, `useEffect`, `useQuery`, `useMutation`, `useForm`, `useNavigate`.
- **Proibido:** declarar funções de callback, lidar com eventos de submit, gerenciar estado.
- **Permitido:** renderizar componentes, divs, classes Tailwind, importar componentes.

```tsx
// ✅ CORRETO — page burra
export function AgendaPage() {
  return (
    <div className="bg-background w-full ...">
      <AgendaHeader />
      <aside><AgendaSidebar /></aside>
      <AgendaEventList />
    </div>
  )
}
```

### Views / Containers — Ponto Único de Lógica (`components/`)

- **Permitido:** `useState`, `useCallback`, `useMemo`, `useForm`.
- **Permitido:** gerenciar estado puramente visual (abrir/fechar modal, input controlado).
- **Deve:** importar hooks individuais (use case hooks) — um para cada operação.
- **Proibido:** importar hooks agrupados como `useNewsMutations()`.
- **Deve:** passar dados e callbacks para sub-componentes via props.

```tsx
// ✅ CORRETO — view container com hooks individuais
import { useGetAgendaEvents } from '../hooks/useGetAgendaEvents'
import { useDeleteAgendaEvent } from '../hooks/useDeleteAgendaEvent'

export function AgendaEventList() {
  const { data: events, isLoading } = useGetAgendaEvents()
  const { mutateAsync: deleteEvent, isPending: isDeleting } = useDeleteAgendaEvent()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<AgendaEvent | null>(null)

  async function handleDelete() {
    if (!eventToDelete) return
    await deleteEvent(eventToDelete.id)
    setIsDeleteOpen(false)
    setEventToDelete(null)
  }

  return (
    <>
      {events?.map(event => <AgendaEventCard key={event.id} event={event} />)}
      <AgendaDeleteModal
        event={eventToDelete}
        isOpen={isDeleteOpen}
        onConfirm={handleDelete}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  )
}
```

### Componentes de UI — Puramente Visuais (`components/`)

- **Proibido:** usar hooks de dados, TanStack Query, mutações.
- **Proibido:** importar providers, contextos de dados.
- **Permitido:** estado puramente visual (ex: `isHovered`, animações).
- **Deve:** receber tudo via props.

```tsx
// ✅ CORRETO — componente burro
function AgendaEventCard({ event, onEdit, onDelete }: Props) {
  return (
    <div>
      <h3>{event.title}</h3>
      <Button onClick={() => onEdit(event)}>Editar</Button>
      <Button onClick={() => onDelete(event)}>Excluir</Button>
    </div>
  )
}
```

### Hooks — Toda Lógica de Dados (`hooks/`)

- **Deve:** encapsular `useQuery`, `useMutation`, `useForm`.
- **Deve:** tratar erros, exibir toasts.
- **Deve:** ser nomeado com prefixo `use`.
- **Proibido:** ter arquivos JSX/TSX, renderizar UI.
- **Proibido:** agrupar múltiplas mutations em um único hook. Cada mutação deve ser seu próprio hook.

```ts
// ✅ CORRETO — hook de query
export function useGetEvents() {
  return useQuery({ queryKey: ['events'], queryFn: () => api.get('/events') })
}
```

### Use Case Hooks — Um hook por ação (`hooks/`)

Cada mutação (create, update, delete, publish, archive, etc.) **deve ser um hook separado**, seguindo o princípio de "Casos de Uso" do DDD (Domain-Driven Design) e Clean Architecture.

Cada hook é autossuficiente: contém sua própria mutation, seus próprios `onSuccess`/`onError`, seus próprios toasts e sua própria invalidação de cache. **Nenhum agrupamento**.

```ts
// ✅ CORRETO — use case hook individual
export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => agendaApi.delete(id),
    onSuccess: () => {
      toast.success('Evento removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: () => toast.error('Erro ao remover evento.'),
  })
}
```

```ts
// ❌ ERRADO — agrupamento proibido
export function useEventMutations() {
  // Não agrupar múltiplas mutations num só hook
  return { create: ..., update: ..., delete: ... }
}
```

**Nomenclatura:** o nome do hook deve refletir exatamente a ação que ele executa:

| Hook | Ação |
|------|------|
| `useDeleteArticle` | Exclui artigo |
| `usePublishArticle` | Publica artigo |
| `useArchiveArticle` | Arquiva artigo |
| `useToggleFeaturedArticle` | Alterna destaque do artigo |
| `useUpdateMemberOrder` | Atualiza ordem do membro |
| `useCreateService` | Cria serviço |

**View usando use case hooks:**

```tsx
// ✅ CORRETO — view importa hooks individuais
import { useGetEvents } from '../hooks/useGetEvents'
import { useDeleteEvent } from '../hooks/useDeleteEvent'

export function EventList() {
  const { data: events } = useGetEvents()
  const { mutateAsync: deleteEvent } = useDeleteEvent()

  async function handleDelete(id: string) {
    await deleteEvent(id)
  }
  // ...
}
```

---

## 3. Fluxo de Dados

```
Page (dumb)
  └── View / Container (esperto)
        ├── usa hooks (useGetData, useMutations)
        ├── gerencia estado visual (open/close modal)
        ├── define handlers (handleSave, handleDelete)
        └── renderiza sub-componentes via props
              ├── DumbComponent (só props)
              └── Modal (recebe onConfirm, isOpen)
```

Nenhum dado "vaza" para cima — a View é o único ponto que conecta hooks à UI.

---

## 4. Exceções e Boas Práticas

- **Modais de exclusão** podem ter seu próprio `isDeleting` state, mas a função de deletar (`onConfirm: () => Promise<void>`) vem da View/hook via prop.
- **Formulários** devem usar `react-hook-form` com `zodResolver` dentro da View. Nunca na Page.
- **Provider/Context** pode ser usado quando múltiplos componentes não-relacionados precisam do mesmo estado (ex: `AgendaProvider`). O provider também é um container "esperto" que usa hooks.
