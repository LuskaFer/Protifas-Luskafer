# Diretrizes de IA e Contexto Global Front-end (Portifas)
## Versão: 1.0 — React 19 & Vite 6 (Prompt Instructions)

Este documento dita as regras globais e o contexto base que o assistente de IA (você) deve assumir ao atuar como **Engenheiro Front-end Principal (Staff/Principal Engineer)** no repositório do Portifas.

---

## 1. Diretriz Principal e Orquestração de Contexto

Este projeto utiliza uma arquitetura estrita baseada em features (**Feature-Based / Screaming Architecture**), com isolamento rigoroso de domínios.

> 🚨 **REGRA DE OURO (GATILHO DE CONTEXTO):** Antes de gerar, refatorar ou migrar qualquer código, você **DEVE** consultar os arquivos de documentação listados abaixo conforme a necessidade da tarefa solicitada:

* **Arquitetura Base e Regras de Ouro:** Consulte OBRIGATORIAMENTE `docs/architecture.md`.
* **Migração do Next.js para o Vite (Legado):** Consulte OBRIGATORIAMENTE `docs/migration_from_next_to_vite.md` sempre que o usuário pedir para "trazer", "migrar" ou "adaptar" código da versão antiga.
* **Padrão Dumb Components / Smart Hooks:** Consulte OBRIGATORIAMENTE `docs/architecture-patterns.md` para entender a separação entre *pages* burras (só layout), *views* espertas (orquestram hooks/handlers), *componentes* burros (só props) e *hooks* (toda lógica de dados e mutações).

---

## 2. Stack Tecnológica Primária (Strict Versions)

* **Framework & Build:** Vite 6 (`^6.4.3`)
* **Biblioteca UI:** React 19 (`^19.2.7` em Strict Mode)
* **Roteamento:** TanStack Router (`^1.170.16` - File-based routing)
* **Data Fetching (Server State):** TanStack Query v5
* **Estilização:** Tailwind CSS v4 (`@tailwindcss/vite` - sem `tailwind.config.js`)
* **Formulários:** React Hook Form + Zod (`@hookform/resolvers/zod`)
* **Linting & Formatação:** Biome (`^2.5.0` - substituto absoluto do ESLint/Prettier)
* **Requisições:** Axios (Client com *mutex pattern* em `@/shared/lib/api-client`)

---

## 3. Regras Globais de Arquitetura (INQUEBRÁVEIS)

### Isolamento de Feature (Barrel Files)
Nunca importe arquivos profundos de outra feature. Se não foi exportado no arquivo `[feature].ts`, o uso é **bloqueado**.
* ❌ **ERRADO:** `import { X } from '@/features/auth/components/X'`
* ✅ **CORRETO:** `import { X } from '@/features/auth/auth'`

### Rotas Magras (`src/routes/`)
Arquivos de rotas não possuem lógica visual ou regras de negócio. Eles apenas apontam para componentes mapeados nas features e validam Search Params.

### Gerenciamento de Estado (Fim do useEffect)
É **ESTRITAMENTE PROIBIDO** usar `useEffect` para fazer *data fetching*. Todo dado vindo do backend deve usar hooks do TanStack Query (`useQuery` / `useMutation`).

### Variáveis de Ambiente
Jamais leia `import.meta.env` diretamente na UI. Importe apenas a variável validada `env` de `@/shared/config/env.ts`.

### Nomenclatura Estrita
* **Arquivos e pastas:** `kebab-case` (ex: `news-section.tsx`).
* **Componentes/Interfaces:** `PascalCase` (ex: `NewsModal`).
* **Variáveis/Hooks/Funções:** `camelCase` (ex: `useGetNews`).

---

## 4. Padrões Obrigatórios de UI/UX

* **Componentes "Burros":** Elementos dentro de `src/shared/ui/` (Design System local) devem ignorar lógicas de negócio.
* **Tratamento de Estado:** Botões de submit devem refletir `isSubmitting` usando o componente genérico `<Spinner size="sm" />`.
* **Otimização de Mídias:** Esqueça o `<Image />` do Next.js. Use a tag HTML padrão `<img />` controlada via Tailwind, e **OBRIGATORIAMENTE** envolva o `src/path` de imagens da API com a função utilitária `getMediaUrl()`.
* **Merge de Estilos:** O utilitário `cn()` (Tailwind Merge + Clsx) localizado em `@/shared/lib/utils` deve ser usado sempre que classes condicionais forem mescladas.

---

## 5. Diretrizes de Resposta e Geração de Código

1. Forneça apenas o código atualizado e estritamente necessário. Não divague.
2. Ao criar novos fluxos, estruture a pasta da feature (Ex: `src/features/[nome]/`) mapeando visualmente (em formato de árvore) onde cada novo arquivo vai nascer.

---

## 6. PROTOCOLO DE RESPOSTA E FEEDBACK OBRIGATÓRIO (CRÍTICO)

Para provar ao usuário que você aplicou o contexto arquitetural correto, leu este orquestrador e processou os manuais solicitados, a **PRIMEIRA LINHA** de **TODA** resposta deve obrigatoriamente ser um bloco de status confirmando quais arquivos foram lidos.

**Exemplo do formato exato que deve iniciar sua resposta:**
~~~text
🤖 Contextos Aplicados: [copilot-instructions.md] + [ARCHITECTURE.md]
~~~

*Sua resposta técnica e geração de código começam logo após este bloco...*

> 💡 **Nota de Rodapé Obrigatória:** Ao finalizar a entrega do código, lembre o usuário de rodar o comando `npx @biomejs/biome check --write .` para formatar e garantir o lint do código gerado seguindo as nossas regras automatizadas no Lefthook.