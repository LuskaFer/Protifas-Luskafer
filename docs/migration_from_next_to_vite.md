# Manual de Arquitetura, Boas Práticas e Fluxo de Desenvolvimento (Portifas)
## Versão: 1.0 — Guia Definitivo de Engenharia

Este documento estabelece o padrão arquitetural oficial do **Portifas**. Ele serve como a única fonte de verdade para o desenvolvimento de novas funcionalidades, refatoração de código legado e revisão de Pull Requests. Toda e qualquer alteração no repositório deve obrigatoriamente seguir as diretrizes aqui consolidadas.

---

## 1. Filosofia de Engenharia e Objetivos da Plataforma

O Portifas está em transição de uma arquitetura legada (Next.js monolítico e desestruturado) para uma **Single Page Application (SPA)** de alta performance baseada em **React 19** e **Vite 6**.

### Nossos 3 Pilares Filosóficos:
1. **Screaming Architecture (Arquitetura que Grita):** Olhar para a pasta `src/features` deve revelar imediatamente *o que o software faz* (Ex: `auth`, `cartorio`, `dashboard`), e não as ferramentas que ele usa.
2. **Encapsulamento Estrito (Módulos Estanque):** Domínios de negócio não se misturam. Uma feature funciona como uma "caixa preta" com uma única porta de entrada e saída.
3. **Fail-Fast em Tempo de Compilação:** O código deve preferir quebrar na compilação do TypeScript ou na validação estática do Biome do que gerar um erro silencioso em produção.

---

## 2. Stack Tecnológica Oficial (Strict Versions)

Não instale pacotes que compitam com as soluções já estabelecidas abaixo:

* **Core Runtime:** React `^19.2.7` + TypeScript `^6.0.3`
* **Bundler & Dev Server:** Vite `^6.4.3` (HMR ultrarrápido)
* **Roteamento:** `@tanstack/react-router` `^1.170.16` (File-based, 100% Type-safe)
* **State Management (Server):** `@tanstack/react-query` v5 (Gerenciamento de cache e requisições)
* **State Management (Client):** `useState` (local) / Search Params da URL / `Zustand` (apenas para estados globais complexos)
* **Estilização:** Tailwind CSS v4 (`@tailwindcss/vite` nativo via diretiva `@theme` no `src/index.css`)
* **Validação de Dados:** Zod `^4.4.3` + `react-hook-form` `^7.79.0`
* **Linting & Code Formatting:** Biome `^2.5.0` (Substitui ESLint e Prettier)
* **Client HTTP:** Axios `^1.18.0` (Instância customizada com controle de concorrência)
* **Git Hooks:** Lefthook `^2.1.9` (pre-commit, commit-msg, pre-push)

---

## 3. Topologia de Diretórios (O Mapa do Repositório)

A pasta `src/` possui estritamente 4 zonas de responsabilidade. **É proibido criar pastas soltas fora dessa hierarquia.**

~~~text
src/
├── app/                  # 1. ZONA DE INICIALIZAÇÃO (Bootstrapping)
│   ├── providers/        # Envelopadores globais (Theme, AuthProvider, QueryClient)
│   ├── main.tsx          # Ponto de montagem raiz no DOM (createRoot)
│   └── router.tsx        # Configuração mestre e tipagem do TanStack Router
│
├── features/             # 2. ZONA DE DOMÍNIOS DE NEGÓCIO (O Coração)
│   ├── [feature-name]/   # Módulo estanque (Ex: auth, landing, dashboard)
│   │   ├── api/          # Endpoints Axios exclusivos deste domínio
│   │   ├── components/   # Componentes visuais atrelados a esta regra
│   │   ├── hooks/        # Custom hooks consumindo TanStack Query 
│   │   ├── interfaces/   # Contratos TS puros do domínio
│   │   ├── pages/        # Componentes que representam páginas inteiras
│   │   ├── zod/          # Schemas Zod de entrada/saída do domínio
│   │   └── [feature].ts  # BARREL FILE: A única porta de saída pública
│
├── routes/               # 3. ZONA DE ROTEAMENTO (File-based routing)
│   ├── __root.tsx        # Casca mestre do TanStack Router
│   ├── _app/             # Layout para rotas autenticadas (injeta Sidebar/Header)
│   ├── _auth/            # Layout para rotas de autenticação (Login, Esqueci Senha)
│   └── _public/          # Layout para rotas públicas (Landing page)
│
└── shared/               # 4. ZONA DE RECURSOS COMPARTILHADOS (Agnóstica)
    ├── assets/           # Imagens estáticas globais, SVGs estruturais
    ├── config/           # Configurações brutas (env.ts validados via Zod)
    ├── layouts/          # Cascas de UI de alto nível (PublicLayout, AppLayout)
    ├── lib/              # Clientes configurados (axios, queryClient, utils)
    ├── types/            # Tipos genéricos (ApiResponse<T>, Paginated<T>)
    └── ui/               # Design System puro (Shadcn UI / Primitivos puros)
~~~

---

## 4. As 5 Leis Arquiteturais Imutáveis

### Lei I: A Fronteira Fechada (Barrel Files)
Uma feature **não sabe** o que acontece dentro da pasta de outra feature. É expressamente proibido fazer "deep imports" cruzados.
* **ERRADO:** `import { UserAvatar } from '@/features/user/components/UserAvatar'`
* **CORRETO:** `import { UserAvatar } from '@/features/user/user'` *(Consumindo a interface pública)*
* *Regra de ouro:* Se o arquivo `[feature].ts` não exportou algo, o resto do sistema está proibido de usar.

### Lei II: A Rota Magra
Os arquivos dentro de `src/routes/` são meros "despachantes de trânsito". Eles servem apenas para amarrar uma URL a uma página e validar Search Params.
* **Proibido em `routes/`:** Escrever lógicas de `useEffect`, declarar subcomponentes visuais ou injetar regras de negócio.
* **Padrão correto (`src/routes/_public/artigos.tsx`):**

~~~tsx
import { createFileRoute } from '@tanstack/react-router'
import { ArticlesPage } from '@/features/landing/landing'

export const Route = createFileRoute('/_public/artigos')({
  component: ArticlesPage,
})
~~~

### Lei III: A Ditadura do TanStack Query
Dados que nascem no Back-end pertencem ao TanStack Query.
* **Proibido:** Criar um `const [data, setData] = useState()` e alimentá-lo através de um `axios.get()` dentro de um `useEffect()`. 
* **Obrigatório:** Criar um Custom Hook na feature (`hooks/useGetArticles.ts`) que retorne o `useQuery()`. A tela apenas consome as propriedades nativas `{ data, isLoading, isError }`.

### Lei IV: Variáveis de Ambiente Blindadas
Nunca leia `import.meta.env.VITE_X` diretamente em um arquivo de UI. Toda variável de ambiente deve ser declarada e validada no arquivo `src/shared/config/env.ts` através do Zod. Se a variável não estiver tipada no Zod, a aplicação é impedida de compilar.

### Lei V: Componentes de UI "Estúpidos" e Páginas Burras
As nossas **Pages e Componentes devem ser burros**. A lógica de negócio e as requisições pertencem exclusivamente aos **Hooks**.
* Os hooks devem encapsular a lógica de estado/fetch e seguir o padrão `useAcaoRecurso` (Ex: `useCreateNews`, `useGetArticles`).
* A página (Page) deve ficar **limpa e burra**, focando apenas em orquestrar a UI e importar os `use...` quando necessário.
* Os componentes visuais (em `src/shared/ui/` ou na pasta `components/` da feature) só devem ter o essencial para funcionar. O `Button.tsx` não sabe se está logando um usuário ou salvando um PDF; ele apenas recebe `onClick`, `disabled`, `variant`, `size` e `children`.

---

## 5. Engenharia de Rede: O "Mutex Pattern" de Autenticação

Para evitar que múltiplas requisições paralelas disparem dezenas de quedas para a tela de login quando um token expira, nosso `src/shared/lib/api-client.ts` implementa uma **Fila de Mutex**:

1. **Interceptação:** A primeira requisição que devolve `401 Unauthorized` congela a rede.
2. **Trava (Lock):** A flag `isRefreshing = true` é ativada. Um único `POST` é disparado silenciosamente para `/api/auth/refresh`.
3. **Enfileiramento:** Enquanto o refresh acontece, qualquer outra requisição da tela que também der 401 é colocada em uma fila de Promises em memória (`pendingRequests`).
4. **Descompressão:** * *Se o refresh der certo:* a fila inteira é reprocessada automaticamente com o novo cookie. O usuário não percebeu nada.
   * *Se o refresh der errado:* a fila é rejeitada e o comando `window.location.href = '/login'` é invocado uma única vez.

---

## 6. Fluxo de Integração Contínua Local (Lefthook)

Antes de abrir um Pull Request, seu código passará por três barreiras automáticas locais geridas pelo `lefthook.yml`:

1. **Pre-commit:** O Biome varre exclusivamente os arquivos que estão em *staged*. Ele formata o código, checa sintaxe perigosa e aplica auto-fixes instantâneos.
2. **Commit-msg:** O Commitlint avalia a sua mensagem. Ela será abortada se não seguir o padrão **Conventional Commits**:
   * `feat: adiciona modal de emissão de certidão`
   * `fix: corrige quebra de layout no carrossel do hero`
   * `refac: move logica de autenticação para custom hook`
   * Outros prefixos válidos: `docs:`, `style:`, `perf:`, `types:`, `chore:`.
3. **Pre-push:** O TypeScript roda uma checagem completa de tipos no projeto inteiro (`tsc --noEmit`). Se você mudou a tipagem de um objeto na feature A e esqueceu de arrumar a invocação dele na feature B, o push é cancelado.