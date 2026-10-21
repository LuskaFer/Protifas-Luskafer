import { type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Code2, ExternalLink, Lock, Users } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import { DetailModal } from '@/shared/components/DetailModal'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui/carousel'
import type { Lang } from '@/shared/locales/dictionaries'
import { OmniSignal } from './OmniSignal'
import { SectionAtmosphere } from './SectionAtmosphere'

type Localized = { pt: string; en: string }

interface ProjectCardData {
  id: string
  type: 'DEV' | 'GENERAL'
  order: number
  title: Localized
  dateMade: string | Localized
  description: Localized
  /** Texto curto do card; sem ele, o card usa o início da descrição. */
  teaser?: Localized
  highlights?: { title: Localized; description: Localized }[]
  closing?: Localized
  /** Capa própria em vez dos ícones de tecnologia. */
  visual?: 'omni'
  link?: string
  thumbnail?: string | null
  gallery: string[]
  techIcons?: string[]
  collab?: boolean
}

/** Seis cards dividem por 1, 2 e 3 colunas: toda página cheia fecha linhas completas. */
const PAGE_SIZE = 6
const OMNI_ID = 'proj-omni'
const OMNI_HASH = '#omni'

const IN_DEVELOPMENT: Localized = { pt: 'Em desenvolvimento', en: 'In development' }
const IN_PRODUCTION: Localized = { pt: 'Em produção', en: 'In production' }

const localize = (value: string | Localized, lang: Lang) => (typeof value === 'string' ? value : value[lang])

const MOCK_PROJECTS: ProjectCardData[] = [
  {
    id: 'proj-portalccs-v2',
    type: 'DEV',
    order: -3,
    title: {
      pt: 'PortalCCS v2 — Cartório Municipal de São José dos Campos',
      en: 'PortalCCS v2 — São José dos Campos Municipal Notary',
    },
    dateMade: IN_DEVELOPMENT,
    description: {
      pt: 'Co-lidero a modernização tecnológica do Cartório Municipal e atuo no núcleo que define as inovações da nova solução. O PortalCCS v2 está sendo arquitetado do zero: Java 25 com Clean Architecture + DDD no back-end e React + Vite com arquitetura por features no front-end. O ecossistema inclui automações avançadas e um chatbot com IA integrada, e otimiza diretamente milhares de processos da cidade.',
      en: 'I co-lead the technological modernization of the Municipal Notary and am part of the core team that defines the innovations of the new solution. PortalCCS v2 is being architected from scratch: Java 25 with Clean Architecture + DDD on the back end and React + Vite with a feature-based architecture on the front end. The ecosystem includes advanced automations and an AI-integrated chatbot, and directly optimizes thousands of city processes.',
    },
    gallery: [],
    techIcons: ['devicon-java-plain colored', 'devicon-spring-original colored', 'devicon-mariadb-original colored', 'devicon-react-original colored', 'devicon-vitejs-plain colored', 'devicon-typescript-plain colored'],
  },
  {
    id: OMNI_ID,
    type: 'DEV',
    order: -4,
    visual: 'omni',
    title: {
      pt: 'Omni — Plataforma Pessoal de Operações com IA',
      en: 'Omni — Personal AI Operations Platform',
    },
    dateMade: { pt: 'Projeto pessoal · em evolução contínua', en: 'Personal project · continuously evolving' },
    teaser: {
      pt: 'O projeto da minha vida. Uma plataforma pessoal que coloca uma frota de IAs para planejar, escrever, testar e entregar software nos meus projetos — dia e noite — enquanto a palavra final continua sendo minha.',
      en: 'The project of my life. A personal platform that puts a fleet of AI workers to plan, write, test and ship software across my projects — day and night — while the final word stays mine.',
    },
    description: {
      pt: 'E se o seu roadmap andasse sozinho enquanto você trabalha?\n\nO Omni é a plataforma pessoal de operações que eu construo — o projeto da minha vida. Ele roda nas minhas próprias máquinas, local-first, e coordena uma frota de agentes de IA que planejam, escrevem, testam e entregam software a qualquer hora do dia. Enquanto eu cumpro o meu expediente, ele transforma o meu roadmap em versões entregues e testadas, prontas para a minha revisão.',
      en: 'What if your roadmap kept moving while you were at work?\n\nOmni is the personal operations platform I build — the project of my life. It runs on my own machines, local-first, and coordinates a fleet of AI workers that plan, write, test and ship software at any hour. While I am at my day job, it turns my roadmap into delivered, tested releases, ready for my review.',
    },
    highlights: [
      {
        title: { pt: 'Trabalha enquanto eu trabalho', en: 'Works while I work' },
        description: {
          pt: 'Planejamento, código e testes seguem em frente o dia todo. Eu chego e encontro entregas prontas para revisar, não tarefas esperando para começar.',
          en: 'Planning, code and tests keep moving all day. I come back to deliveries ready for review, not tasks waiting to start.',
        },
      },
      {
        title: { pt: 'Me responde de qualquer lugar', en: 'Answers me from anywhere' },
        description: {
          pt: 'Pelo Telegram, do celular, converso com ele, acompanho o andamento e decido o próximo passo — esteja eu onde estiver.',
          en: 'On Telegram, from my phone, I talk to it, follow the progress and decide the next step — wherever I am.',
        },
      },
      {
        title: { pt: 'Vários projetos, um só comando', en: 'Many projects, one command center' },
        description: {
          pt: 'Jogos, mods de Minecraft e a minha automação de candidaturas avançam lado a lado, cada um no seu próprio espaço.',
          en: 'Games, Minecraft mods and my job-application automation move forward side by side, each in its own space.',
        },
      },
      {
        title: { pt: 'A palavra final é minha', en: 'The final word is mine' },
        description: {
          pt: 'Portões de aprovação humana, auditoria completa de cada passo, mudanças reversíveis e custo sempre à vista. Autonomia, sim; cheque em branco, nunca.',
          en: 'Human approval gates, a full audit of every step, reversible changes and cost always in sight. Autonomy, yes; a blank check, never.',
        },
      },
    ],
    closing: {
      pt: 'O que vem por aí: um beta privado está sendo preparado para o primeiro testador. A ambição é simples de dizer e difícil de construir — dar a uma única pessoa o alcance de um time inteiro, sem abrir mão do controle.',
      en: 'What comes next: a private beta is being prepared for its first tester. The ambition is simple to say and hard to build — give one person the reach of a whole team, without giving up control.',
    },
    gallery: [],
  },
  {
    id: 'proj-cartorio-legado',
    type: 'DEV',
    order: -2,
    title: {
      pt: 'PortalCCS v1 — Cartório Municipal de São José dos Campos',
      en: 'PortalCCS v1 — São José dos Campos Municipal Notary',
    },
    dateMade: IN_PRODUCTION,
    description: {
      pt: 'Primeira versão do PortalCCS, em PHP / Laravel e em produção. Reconstruí todo o sistema de processos administrativos e suas funções, incluindo a hierarquia de processos. Refatorei por completo o sistema de transferência de processos, com guardas, rotas, models e fluxos reforçados. Criei o sistema de favoritos/preferências: uma estrela clicável na lista de usuários, usada para o compartilhamento e sub-compartilhamento de processos. Também mantive em funcionamento diário muitas funções legadas, que meu supervisor confiou a mim. Essa estabilização veio antes do novo Portal CCS da equipe (Java 25 + React).',
      en: 'The first version of PortalCCS, in PHP / Laravel and in production. I rebuilt the whole administrative-process system and its functions, including the process hierarchy. I fully refactored the process-transfer system, with hardened guards, routes, models and flows. I built the favourites/preferences system: a clickable star in the user list, used for sharing and sub-sharing processes. I also kept many legacy functions running day to day, which my supervisor entrusted to me. This stabilization came before our new CCS Portal (Java 25 + React).',
    },
    gallery: [],
    techIcons: ['devicon-php-plain colored', 'devicon-laravel-original colored', 'devicon-mariadb-original colored', 'devicon-react-original colored', 'devicon-vitejs-plain colored', 'devicon-typescript-plain colored', 'devicon-javascript-plain colored'],
  },
  {
    id: 'proj-1234voce',
    type: 'DEV',
    order: -1,
    title: {
      pt: 'Plataforma de Gestão 1234voce.com — Instituto Você',
      en: '1234voce.com Management Platform — Instituto Você',
    },
    dateMade: IN_PRODUCTION,
    description: {
      pt: 'O Instituto Você é uma empresa de treinamentos em desenvolvimento humano (PNL), com matriz em São José dos Campos, mais de 300 mil alunos formados e unidades nas cinco regiões do Brasil. Sua plataforma de gestão é em PHP / CodeIgniter, está em produção e é usada até hoje. Assumi um sistema que estava 50% pronto, finalizei e corrigi, e coloquei a versão atual em produção por conta própria. Integrei totalmente o gateway de pagamento e-Rede (Rede): antes, a rede de mais de 40 franquias da época só recebia matrículas presencialmente, com maquininha física; depois da integração, o pagamento passou a ser online, com parcelamento e juros configuráveis por franquia. Também mantive servidores CentOS na Azure.',
      en: 'Instituto Você is a human-development training company (NLP), headquartered in São José dos Campos, with over 300,000 students trained and units across all five regions of Brazil. Its management platform is built in PHP / CodeIgniter, in production and still used today. I took over a system that was 50% done, finished and fixed it, and put the current version in production myself. I fully integrated the e-Rede (Rede) payment gateway: before that, the network of 40+ franchises at the time could only take enrollment payments in person with a physical card machine; after the integration, payment became online, with installments and interest configurable per franchise. I also maintained CentOS servers on Azure.',
    },
    gallery: [],
    techIcons: ['devicon-php-plain colored', 'devicon-codeigniter-plain colored', 'devicon-centos-plain colored', 'devicon-azure-plain colored'],
  },
  {
    id: 'proj-1',
    type: 'DEV',
    order: 9,
    title: { pt: 'Microserviço de Gestão de Clientes', en: 'Client Management Microservice' },
    dateMade: '2024',
    link: 'https://github.com/LuskaFer/mscliente---POS-TECH-FIAP',
    description: {
      pt: 'Desenvolvido em Java 21 com Spring Framework. A arquitetura segue rigorosamente os princípios de Clean Architecture, utilizando PostgreSQL e Flyway para migrações. Foco absoluto em qualidade de código com alta cobertura de testes (JUnit, Mockito, JaCoCo) e deploy padronizado via Docker.',
      en: 'Developed in Java 21 with Spring Framework. The architecture strictly follows Clean Architecture principles, using PostgreSQL and Flyway for migrations. Absolute focus on code quality with high test coverage (JUnit, Mockito, JaCoCo) and standardized Docker deployment.',
    },
    gallery: [],
    techIcons: ['devicon-java-plain colored', 'devicon-spring-original colored', 'devicon-postgresql-plain colored', 'devicon-docker-plain colored'],
    collab: true,
  },
  {
    id: 'proj-2',
    type: 'DEV',
    order: 6,
    title: { pt: 'ERP de Gestão de Projetos (Oracle)', en: 'Project Management ERP (Oracle)' },
    dateMade: '2025',
    link: 'https://github.com/LuskaFer/ORACLE----Gest-Proj',
    description: {
      pt: 'Sistema corporativo robusto construído com Java 25 LTS e Spring Boot 4.0.4. Aplica Clean Architecture estrita e Domain-Driven Design (DDD), garantindo o isolamento total das regras de negócio sem dependência de frameworks externos. Inclui H2 Database e documentação via Swagger/OpenAPI.',
      en: 'Robust corporate system built with Java 25 LTS and Spring Boot 4.0.4. Applies strict Clean Architecture and Domain-Driven Design (DDD), ensuring total isolation of business rules without dependency on external frameworks. Includes H2 Database and Swagger/OpenAPI documentation.',
    },
    gallery: [],
    techIcons: ['devicon-java-plain colored', 'devicon-spring-original colored'],
  },
  {
    id: 'proj-3',
    type: 'DEV',
    order: 5,
    title: { 
      pt: 'Incubadora de Agentes IA (RAG & Learning Loop)', 
      en: 'AI Agents Incubator (RAG & Learning Loop)' 
    },
    dateMade: '2026',
    description: {
      pt: 'Motor de Inteligência Artificial focado em aprendizado contínuo. Construído com Java 25 LTS e Spring Boot 4.0.4, o sistema aplica rigorosamente Clean Architecture e Domain-Driven Design (DDD). O backend utiliza LangChain4j, operando 100% localmente com banco H2 e armazenamento vetorial (InMemoryEmbeddingStore). Os fluxos principais incluem RAG Local e um Loop de Aprendizado, onde feedbacks positivos geram novos vetores de memória. O core business é totalmente agnóstico e isolado de frameworks externos.',
      en: 'Artificial Intelligence engine focused on continuous learning. Built with Java 25 LTS and Spring Boot 4.0.4, the system strictly applies Clean Architecture and Domain-Driven Design (DDD). The backend utilizes LangChain4j, operating 100% locally with an H2 database and vector storage (InMemoryEmbeddingStore). Main flows include Local RAG and a Learning Loop, where positive feedback automatically generates new memory vectors. The core business is completely agnostic and isolated from external frameworks.'
    },
    gallery: [],
    techIcons: [
      'devicon-java-plain colored', 
      'devicon-spring-original colored', 
      'devicon-maven-plain colored'
    ],
  },
  {
    id: 'proj-reserva-salas-postech',
    type: 'DEV',
    order: 10,
    title: { 
      pt: 'API de Gestão e Reserva de Salas', 
      en: 'Room Management & Reservation API' 
    },
    dateMade: '2024',
    link: 'https://github.com/LuskaFer/Sistema-De-Reserva-De-Salas---POS-TECH-FIAP',
    description: {
      pt: 'API RESTful construída com Java 17 e Spring Boot para gerenciar o ciclo de vida completo de alocação de espaços. O sistema orquestra fluxos de Usuários, Salas, Reservas e Feedbacks. A arquitetura segue rigorosamente o padrão de camadas (Controllers, Services, DTOs e Entities), garantindo separação de responsabilidades e tratamento global de exceções. Inclui banco de dados em memória (H2) com scripts SQL de pré-carga para automação de ambiente e coleções do Postman estruturadas para testes de integração rápidos.',
      en: 'RESTful API built with Java 17 and Spring Boot to manage the complete lifecycle of space allocation. The system orchestrates flows for Users, Rooms, Reservations, and Feedbacks. The architecture strictly follows the layered pattern (Controllers, Services, DTOs, and Entities), ensuring separation of concerns and global exception handling. It includes an in-memory database (H2) with pre-load SQL scripts for environment automation and structured Postman collections for rapid integration testing.'
    },
    gallery: [],
    techIcons: [
      'devicon-java-plain colored', 
      'devicon-spring-original colored', 
      'devicon-maven-plain colored',
      'devicon-postman-plain colored'
    ],
    collab: true,
  },
  {
    id: 'proj-5',
    type: 'DEV',
    order: 7,
    title: { 
      pt: 'API Gateway - Ecossistema Microsserviços', 
      en: 'API Gateway - Microservices Ecosystem' 
    },
    dateMade: '2025',
    link: 'https://github.com/LuskaFer/api-gateway----POS-TECH-FIAP',
    description: {
      pt: 'Gateway de API unificado construído com Spring Cloud Gateway e Java 17 para orquestração da arquitetura de microsserviços da pós-graduação (POS-TECH FIAP). Atua como ponto de entrada centralizado, realizando o roteamento HTTP inteligente para 6 serviços distintos (Clientes, Produtos, Pedidos, Pagamentos e Estoque). Desenvolvido sob princípios modulares de Clean Architecture, suporta parametrização via variáveis de ambiente e possui deploy conteinerizado via Docker.',
      en: 'Unified API Gateway built with Spring Cloud Gateway and Java 17 to orchestrate the postgraduate microservices architecture (POS-TECH FIAP). It acts as a centralized entry point, performing intelligent HTTP routing to 6 distinct services (Clients, Products, Orders, Payments, and Inventory). Developed under modular Clean Architecture principles, it supports environment variable configuration and features containerized deployment via Docker.'
    },
    gallery: [],
    techIcons: [
      'devicon-java-plain colored', 
      'devicon-spring-original colored', 
      'devicon-docker-plain colored',
      'devicon-maven-plain colored'
    ],
    collab: true,
  },
  {
    id: 'proj-6',
    type: 'DEV',
    order: 8,
    title: { 
      pt: 'Microserviço Error Tracker (Event-Driven)', 
      en: 'Error Tracker Microservice (Event-Driven)' 
    },
    dateMade: '2025',
    link: 'https://github.com/LuskaFer/ms-error-tracker----POS-TECH-FIAP',
    description: {
      pt: 'Microserviço focado em observabilidade e resiliência, desenvolvido com Spring Boot 3.5. Atua como um consumidor assíncrono conectado ao Apache Kafka, capturando eventos de falha em tempo real. O sistema valida e desserializa o payload JSON, persistindo as trilhas de auditoria em um banco MySQL via Spring Data JPA (com migrações gerenciadas pelo Flyway). Além do processamento em background, expõe uma API REST para consulta dos logs. Todo o ecossistema é orquestrado localmente via Docker Compose, com alta cobertura de testes (JUnit 5/Mockito).',
      en: 'Microservice focused on observability and resilience, developed with Spring Boot 3.5. It acts as an asynchronous consumer connected to Apache Kafka, capturing failure events in real-time. The system validates and deserializes the JSON payload, persisting audit trails in a MySQL database via Spring Data JPA (with migrations managed by Flyway). Alongside background processing, it exposes a REST API for querying logs. The entire ecosystem is orchestrated locally via Docker Compose, backed by high test coverage (JUnit 5/Mockito).'
    },
    gallery: [],
    techIcons: [
      'devicon-java-plain colored', 
      'devicon-spring-original colored', 
      'devicon-apachekafka-original colored',
      'devicon-mysql-plain colored',
      'devicon-docker-plain colored'
    ],
    collab: true,
  },
  {
    id: 'proj-aut-send-email-jobs',
    type: 'DEV',
    order: 2,
    title: {
      pt: 'Assistente de Candidaturas com IA (Aut-SendEmail-Jobs)',
      en: 'AI Job Application Assistant (Aut-SendEmail-Jobs)'
    },
    dateMade: '2026',
    link: 'https://github.com/LuskaFer/Aut-SendEmail-Jobs',
    description: {
      pt: 'Sistema que recebe a mensagem crua de um grupo de vagas do WhatsApp, extrai a vaga do texto desestruturado, mede o encaixe com o meu perfil profissional e escreve o e-mail de candidatura, anexando automaticamente a versão do currículo correspondente à área da vaga. O back-end é Java 25 com Spring Boot 4 sob Clean Architecture e DDD: o motor de IA e o envio de e-mail são portas do domínio, com adaptadores intercambiáveis para a Claude API (usando structured outputs) e para Ollama local, além de SMTP para o disparo. O histórico fica em H2 e o front-end é React 19 com Vite e TypeScript.',
      en: 'System that ingests the raw message from a WhatsApp job-posting group, extracts the vacancy from unstructured text, scores the fit against my professional profile, and drafts the application email, automatically attaching the résumé version matching the role area. The backend is Java 25 with Spring Boot 4 under Clean Architecture and DDD: the AI engine and the email sender are domain ports, with interchangeable adapters for the Claude API (using structured outputs) and local Ollama, plus SMTP for delivery. History is stored in H2 and the frontend is React 19 with Vite and TypeScript.'
    },
    gallery: [],
    techIcons: [
      'devicon-java-plain colored',
      'devicon-spring-original colored',
      'devicon-react-original colored',
      'devicon-typescript-plain colored'
    ],
  },
  {
    id: 'proj-isekai-dream-lks',
    type: 'DEV',
    order: 1,
    title: {
      pt: 'IsekaiDreamLKS - Mod Fabric de Companions',
      en: 'IsekaiDreamLKS - Fabric Companions Mod'
    },
    dateMade: '2026',
    description: {
      pt: 'Mod de Minecraft escrito em Java sobre o loader Fabric (1.26.2), cujo núcleo é um sistema de gacha — o modelo de monetização e progressão que hoje sustenta os maiores títulos do mercado de games. Toda a fundação é data-driven: tier, raridade, presets, simulador e pity persistente, alimentando a invocação de companions com progressão por fragmentos, cristais e gemas. Em volta do gacha estão um Invocador multibloco 10×10 com doze gemas lapidadas em pedestais 3D e companions que auxiliam em combate, retornam para casa e passam por um ciclo de morte e ressurreição — tudo persistido sem forçar o carregamento de chunks. Integra opcionalmente com o Runeskraft e com o motor de renderização 3D listado aqui ao lado. Baseline jogável em alpha 0.0.7, ainda sem release pública.',
      en: 'Minecraft mod written in Java on the Fabric loader (1.26.2), whose core is a gacha system — the monetization and progression model that today drives the biggest titles in the games market. The whole foundation is data-driven: tier, rarity, presets, simulator and persistent pity, powering the summoning of companions with progression through fragments, crystals and gems. Around the gacha sit a 10×10 multiblock Summoner with twelve cut gems on 3D pedestals and companions that assist in combat, return home and go through a death and resurrection cycle — all persisted without forcing chunk loading. Optionally integrates with Runeskraft and with the 3D rendering engine listed alongside. Playable baseline at alpha 0.0.7, not yet a public release.'
    },
    gallery: [],
    techIcons: [
      'icon-minecraft',
      'icon-fabricmc',
      'devicon-java-plain colored',
      'devicon-gradle-plain colored'
    ],
  },
  {
    id: 'proj-motor-render-3d',
    type: 'DEV',
    order: 3,
    title: {
      pt: 'Motor de Renderização 3D Customizável (Minecraft)',
      en: 'Customizable 3D Rendering Engine (Minecraft)'
    },
    dateMade: '2026',
    description: {
      pt: 'Motor gráfico que injeta geometria própria no pipeline de renderização de entidades do Minecraft, permitindo desenhar malhas 3D arbitrárias com física sobre o modelo do jogador — algo que o jogo não expõe nativamente. Em Java 25 sobre Fabric, usa Mixins para se acoplar ao renderizador de entidades e às camadas de equipamento, com camada própria de superfície, testes de paridade da malha e HUD de depuração para render e física. A geometria vem de um pipeline em Python que importa arquivos GLB e aplica operações geométricas genéricas — corte por reta na grade, esticamento e suavização bi-Laplaciana — exportando 24 formatos selecionáveis em tempo de execução, com fixtures verificadas por hash. Compila nas versões 26.1 e 26.2 via Stonecutter. A meta é generalizar o motor para renderizar qualquer peça customizada com física: armaduras próprias, asas e acessórios.',
      en: 'Graphics engine that injects custom geometry into Minecraft’s entity rendering pipeline, making it possible to draw arbitrary 3D meshes with physics over the player model — something the game does not expose natively. Written in Java 25 on Fabric, it uses Mixins to hook into the entity renderer and the equipment layers, with its own surface layer, mesh parity tests and a debug HUD for render and physics. Geometry comes from a Python pipeline that imports GLB files and applies generic geometric operations — cutting along a line on the grid, stretching and bi-Laplacian smoothing — exporting 24 runtime-selectable shapes with hash-verified fixtures. It builds against versions 26.1 and 26.2 through Stonecutter. The goal is to generalize the engine to render any custom part with physics: bespoke armor, wings and accessories.'
    },
    gallery: [],
    techIcons: [
      'icon-minecraft',
      'icon-fabricmc',
      'devicon-java-plain colored',
      'devicon-python-plain colored',
      'devicon-gradle-plain colored'
    ],
  },
  {
    id: 'proj-runeskraft',
    type: 'DEV',
    order: 4,
    title: {
      pt: 'Runeskraft - Mod de Magia para Minecraft (colab)',
      en: 'Runeskraft - Magic Mod for Minecraft (collab)'
    },
    dateMade: '2026',
    description: {
      pt: "Mod Fabric para Minecraft 26.2 que adiciona armas com modelos 3D reais, montados em partes separadas (pomo, cabo, guarda e lâmina) e texturas individuais por peça. Inspirado no sucesso mundial de Frieren — Jornada para Além, a série que explora a magia e as profundezas de aventuras épicas. Colaboração com Joaquim Mendes: atuei na modelagem 3D dos itens — katar, khopesh, lança, machado de ametista e foice —, na configuração dos display transforms que corrigem escala e posicionamento da arma na mão em primeira e terceira pessoa, na normalização dos limites das malhas e nos atributos de dano das armas. Também montei a automação de modelagem do projeto: o workspace MCP integrado ao Blockbench e as skills portáteis versionadas no próprio repositório, para que qualquer máquina reproduza o ambiente.",
      en: "Fabric mod for Minecraft 26.2 that adds weapons with real 3D models, assembled from separate parts (pommel, hilt, guard and blade) with individual textures per piece. Inspired by the global phenomenon Frieren — Beyond Journey, a series that explores magic and the depths of epic adventures. A collaboration with Joaquim Mendes: I worked on the 3D modeling of the items — katar, khopesh, spear, amethyst axe and scythe —, on the display transforms that fix weapon scale and placement in hand in first and third person, on normalizing mesh bounds, and on weapon attribute data. I also built the project modeling automation: the MCP workspace integrated with Blockbench and the portable skills versioned in the repository itself, so any machine can reproduce the environment."
    },
    gallery: [],
    techIcons: [
      'icon-minecraft',
      'icon-fabricmc',
      'devicon-java-plain colored',
      'devicon-blender-original colored',
      'devicon-gradle-plain colored'
    ],
    collab: true,
  },
  {
    id: 'proj-7',
    type: 'GENERAL',
    order: 4,
    title: { pt: 'Horta Autônoma Indoor (IoT)', en: 'Autonomous Indoor Garden (IoT)' },
    dateMade: '2022',

    description: {
      pt: 'Projeto de automação e sustentabilidade. Integrei controladores smart (IoT) para gerenciar umidificadores, iluminação e um sistema automático de irrigação dentro de casa. Um estudo prático sobre necessidades ambientais e autossuficiência que rendeu vegetais e frutos reais.',
      en: 'Automation and sustainability project. Integrated smart controllers (IoT) to manage humidifiers, lighting, and an automatic irrigation system indoors. A practical study on environmental needs and self-sufficiency that yielded real vegetables and fruits.',
    },
    thumbnail: '/images/horta.png',
    gallery: [],
  },
  {
    id: 'proj-8',
    type: 'GENERAL',
    order: 1,
    title: { pt: 'Restauração: GSX F 1998', en: 'Restoration: GSX F 1998' },
    dateMade: '2019',

    description: {
    pt: 'Restauração de uma moto inoperante, adquirida completamente "depenada", sem as carenagens e sem a parte frontal. Baseado puramente na leitura minuciosa de mapas elétricos originais, reconstruí a elétrica do zero e integrei um painel digital. O projeto exigiu reparos mecânicos (carburadores e freios), funilaria e design. A rabeta foi customizada sob medida sem qualquer alteração no quadro original, graças a um trabalho magistral de tapeçaria feito pelo meu pai através da sua empresa, Rockabilly (referência no ramo até hoje). O projeto culminou no funcionamento impecável e na legalização total do veículo.',
    en: 'Restoration of an inoperative motorcycle, acquired completely stripped of its front end and fairings. Relying purely on the meticulous reading of original electrical diagrams, I rebuilt the wiring harness from scratch and integrated a digital dashboard. The project required mechanical repairs (carburetors and brakes), bodywork, and custom design. The tail section was fully customized without altering the original frame, featuring masterful upholstery work by my father through his company, Rockabilly (a specialized shop still operating today). The project culminated in the flawless operation and full street legalization of the vehicle.'},
    thumbnail: '/images/GSX/1.jpeg',
    gallery: ['/images/GSX/1.jpeg', '/images/GSX/2.jpeg', '/images/GSX/3.jpeg', '/images/GSX/4.jpeg','/images/GSX/5.jpeg','/images/GSX/6.jpeg','/images/GSX/7.jpeg','/images/GSX/8.jpeg','/images/GSX/9.jpeg'],
  },
  {
    id: 'proj-9',
    type: 'GENERAL',
    order: 2,
    title: { pt: 'Restauração: Kawasaki ZX11 1995', en: 'Restoration: Kawasaki ZX11 1995' },
    dateMade: '2023',

    description: {
      pt: 'Recuperação de uma moto inoperante com a parte elétrica destruída por ácido de bateria. Refiz o chicote, restaurei a carburação e adicionei upgrades (velocímetro digital, voltímetro, USB). Um projeto de paciência e precisão mecânica.',
      en: 'Recovery of an inoperative motorcycle with battery-acid destroyed electronics. Rebuilt the wiring harness, restored the carburetors, and added upgrades (digital speedometer, voltmeter, USB). A project of patience and mechanical precision.',
    },
    thumbnail: '/images/ZX/1.jpeg',
    gallery: ['/images/ZX/1.jpeg', '/images/ZX/2.jpeg', '/images/ZX/3.jpeg', '/images/ZX/4.jpeg', '/images/ZX/5.jpeg', '/images/ZX/6.jpeg', '/images/ZX/7.jpeg', '/images/ZX/8.jpg'],
  },
  {
    id: 'proj-10',
    type: 'GENERAL',
    order: 3,
    title: { 
      pt: 'Restauração Elétrica: Suzuki Intruder 125 (2008)', 
      en: 'Electrical Restoration: Suzuki Intruder 125 (2008)' 
    },
    dateMade: '2019', 
    description: {
      pt: 'Resgate de uma moto que sofreu um colapso elétrico severo após o proprietário usar um clipe de papel para contornar um fusível queimado. O curto-circuito derreteu mais de 50% do chicote principal. Utilizando o diagrama elétrico original, refiz a fiação de ponta a ponta com extrema precisão, restaurando a segurança do sistema. Aproveitei a nova infraestrutura para dimensionar e instalar dois faróis auxiliares. Um projeto de alta complexidade técnica que culminou no funcionamento perfeito da motocicleta.',
      en: 'Rescue of a motorcycle that suffered a severe electrical collapse after the owner used a paperclip to bypass a blown fuse. The short circuit melted over 50% of the main wiring harness. Using the original electrical diagram, I completely rebuilt the wiring from end to end with extreme precision, restoring the system\'s safety. I leveraged the new infrastructure to design and install two auxiliary headlights. A project of high technical complexity that culminated in the flawless operation of the motorcycle.'
    },
    thumbnail: '/images/intruder 125/1.jpeg', // Coloque o caminho da sua imagem aqui
    gallery: ['/images/intruder 125/2.jpeg','/images/intruder 125/3.jpeg','/images/intruder 125/4.jpeg','/images/intruder 125/5.jpeg','/images/intruder 125/6.jpeg','/images/intruder 125/7.jpeg','/images/intruder 125/8.jpeg','/images/intruder 125/9.jpeg','/images/intruder 125/10.jpeg','/images/intruder 125/11.jpeg','/images/intruder 125/12.jpeg','/images/intruder 125/13.jpeg',], 
  },
]

const sortedProjects = (filter: 'DEV' | 'GENERAL') =>
  MOCK_PROJECTS.filter(p => p.type === filter).sort((a, b) => a.order - b.order)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function ProjectsSection() {
  const { t, lang } = useLanguage()
  const [projectFilter, setProjectFilter] = useState<'DEV' | 'GENERAL'>('DEV')
  const [page, setPage] = useState(0)
  const [openProjectId, setOpenProjectId] = useState<string | null>(null)
  const gridTopRef = useRef<HTMLDivElement>(null)

  const filteredProjects = sortedProjects(projectFilter)
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const pageProjects = filteredProjects.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
  // Quatro cards em três colunas deixariam um órfão; em duas colunas fecham um 2x2.
  const balancedTwoByTwo = pageProjects.length === 4
  const openProject = MOCK_PROJECTS.find(p => p.id === openProjectId) ?? null

  // Link compartilhável (e o teaser do hero): /#omni abre o card do Omni.
  useEffect(() => {
    const openOmniFromHash = () => {
      if (window.location.hash !== OMNI_HASH) return
      const omniIndex = sortedProjects('DEV').findIndex(p => p.id === OMNI_ID)
      setProjectFilter('DEV')
      setPage(Math.floor(omniIndex / PAGE_SIZE))
      setOpenProjectId(OMNI_ID)
    }
    openOmniFromHash()
    window.addEventListener('hashchange', openOmniFromHash)
    return () => window.removeEventListener('hashchange', openOmniFromHash)
  }, [])

  const closeModal = () => {
    setOpenProjectId(null)
    if (window.location.hash === OMNI_HASH) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
    }
  }

  const changeFilter = (filter: 'DEV' | 'GENERAL') => {
    setProjectFilter(filter)
    setPage(0)
  }

  const changePage = (next: number) => {
    setPage(next)
    const top = gridTopRef.current
    if (top && top.getBoundingClientRect().top < 0) {
      top.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    }
  }

  const onCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpenProjectId(id)
    }
  }

  const cardWidth = balancedTwoByTwo
    ? 'lg:w-[calc((100%_-_1.5rem)/2)]'
    : 'lg:w-[calc((100%_-_3rem)/3)]'

  return (
    <>
      <section id="projects" className="relative border-t border-border/50 bg-muted/30 px-4 py-24">
        <SectionAtmosphere variant="projects" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('projects.title')}
            </h2>
            <p className="mt-3 text-muted-foreground">{t('projects.subtitle')}</p>
          </div>

          <div ref={gridTopRef} className="mb-10 flex scroll-mt-20 justify-center">
            <div className="inline-flex rounded-lg border border-border bg-card p-1">
              {(['DEV', 'GENERAL'] as const).map(filter => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={projectFilter === filter}
                  onClick={() => changeFilter(filter)}
                  className={`rounded-md px-5 py-2 text-sm font-medium transition-all ${
                    projectFilter === filter
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter === 'DEV' ? t('projects.filterDev') : t('projects.filterGeneral')}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`projects-grid mx-auto flex flex-wrap justify-center gap-6 ${
              balancedTwoByTwo ? 'lg:max-w-[47.5rem]' : ''
            }`}
          >
            {pageProjects.map(project => {
              const title = project.title[lang]
              const isOmni = project.visual === 'omni'
              return (
                <div
                  key={project.id}
                  id={isOmni ? OMNI_HASH.slice(1) : undefined}
                  role="button"
                  tabIndex={0}
                  aria-haspopup="dialog"
                  aria-label={title}
                  onClick={() => setOpenProjectId(project.id)}
                  onKeyDown={event => onCardKeyDown(event, project.id)}
                  className={`project-card group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:w-[calc((100%_-_1.5rem)/2)] ${cardWidth} ${
                    isOmni ? 'project-card--omni scroll-mt-24' : ''
                  }`}
                >
                  <div className="relative h-48 w-full shrink-0">
                    {isOmni ? (
                      <OmniSignal lang={lang} />
                    ) : project.techIcons && project.techIcons.length > 0 ? (
                      <div className="w-full h-48 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap content-center items-center justify-center gap-4 px-4">
                        <div className="absolute inset-0 bg-slate-500/10 blur-3xl" />
                        {project.techIcons.map((iconClass, index) => (
                          <div
                            key={index}
                            className="p-3 bg-slate-800/80 border border-slate-600/50 rounded-xl shadow-md flex items-center justify-center transition-transform hover:scale-110 z-10"
                          >
                            <i className={`${iconClass} text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                          </div>
                        ))}
                      </div>
                    ) : project.thumbnail ? (
                      <div className="w-full h-48 overflow-hidden">
                        <img
                          src={project.thumbnail}
                          alt={`${title} thumbnail`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : project.gallery && project.gallery.length > 0 ? (
                      <Carousel opts={{ loop: true }} className="w-full h-48">
                        <CarouselContent className="h-full">
                          {project.gallery.map(img => (
                            <CarouselItem key={img} className="h-full">
                              <img src={img} alt={`${title} screenshot`} className="w-full h-full object-cover" />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 size-7" />
                        <CarouselNext className="right-2 size-7" />
                      </Carousel>
                    ) : (
                      <div className="flex w-full h-48 items-center justify-center bg-muted/50">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Code2 className="size-8" />
                          <span className="text-xs">{title}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <h3 className="line-clamp-2 min-h-[2lh] text-lg font-bold leading-snug text-foreground">{title}</h3>
                      <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                        {project.type === 'DEV' ? t('projects.badgeDev') : t('projects.badgeGeneral')}
                      </span>
                    </div>
                    <p className="mb-2 truncate text-sm text-muted-foreground">{localize(project.dateMade, lang)}</p>
                    <p className="mb-4 line-clamp-3 min-h-[3lh] text-sm leading-relaxed text-muted-foreground">
                      {(project.teaser ?? project.description)[lang]}
                    </p>
                    {project.type === 'DEV' && (
                      <div className="mt-auto flex min-h-6 flex-wrap items-center gap-3">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={event => event.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary-dark"
                          >
                            <Code2 className="size-3.5" />
                            {t('projects.repository')}
                            <ExternalLink className="size-3" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Lock className="size-3.5" />
                            {t('projects.private')}
                          </span>
                        )}
                        {project.collab && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-500">
                            <Users className="size-3" />
                            Collab
                          </span>
                        )}
                        {isOmni && (
                          <span className="omni-chip inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                            {t('projects.omniChip')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <ProjectsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
        </div>
      </section>

      {openProject && (
        <DetailModal
          isOpen
          onClose={closeModal}
          title={openProject.title[lang]}
          description={openProject.description[lang]}
          subtitle={localize(openProject.dateMade, lang)}
          gallery={openProject.gallery.length ? openProject.gallery : undefined}
          link={openProject.link}
          techIcons={openProject.techIcons}
          thumbnail={openProject.thumbnail}
          header={openProject.visual === 'omni' ? <OmniSignal lang={lang} size="hero" /> : undefined}
          highlights={openProject.highlights?.map(item => ({
            title: item.title[lang],
            description: item.description[lang],
          }))}
          closing={openProject.closing?.[lang]}
          accent={openProject.visual === 'omni' ? 'var(--omni-accent)' : undefined}
        />
      )}
    </>
  )
}

function ProjectsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const { t } = useLanguage()
  if (totalPages <= 1) return null

  const pad = (n: number) => String(n).padStart(2, '0')
  const status = t('projects.pageStatus')
    .replace('{current}', String(currentPage + 1))
    .replace('{total}', String(totalPages))

  return (
    <nav aria-label={t('projects.pagination')} className="projects-pagination mt-12 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="projects-pagination__step"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t('projects.previous')}</span>
          <span className="sr-only sm:hidden">{t('projects.previous')}</span>
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            type="button"
            className="projects-pagination__page"
            aria-current={index === currentPage ? 'page' : undefined}
            aria-label={`${t('projects.goToPage')} ${index + 1}`}
            onClick={() => onPageChange(index)}
          >
            {pad(index + 1)}
          </button>
        ))}
        <button
          type="button"
          className="projects-pagination__step"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="hidden sm:inline">{t('projects.next')}</span>
          <span className="sr-only sm:hidden">{t('projects.next')}</span>
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p className="projects-pagination__status" aria-live="polite">
        {status}
      </p>
    </nav>
  )
}
