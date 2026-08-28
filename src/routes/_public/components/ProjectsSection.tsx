import { useState } from 'react'
import { Code2, ExternalLink, Lock, Users } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import { DetailModal } from '@/shared/components/DetailModal'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui/carousel'
import { SectionAtmosphere } from './SectionAtmosphere'

interface ProjectCardData {
  id: string
  type: 'DEV' | 'GENERAL'
  order: number
  title: { pt: string; en: string }
  dateMade: string
  description: { pt: string; en: string }
  link?: string
  thumbnail?: string | null
  gallery: string[]
  techIcons?: string[]
  collab?: boolean
}

const MOCK_PROJECTS: ProjectCardData[] = [
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

export function ProjectsSection() {
  const { t, lang } = useLanguage()
  const [projectFilter, setProjectFilter] = useState<'DEV' | 'GENERAL'>('DEV')
  const [modalContent, setModalContent] = useState<{
    type: 'project'
    title: string
    description: string
    subtitle: string
    tags: string[]
    gallery?: string[]
    link?: string
    techIcons?: string[]
    thumbnail?: string | null
  } | null>(null)

  const filteredProjects = MOCK_PROJECTS.filter(p => p.type === projectFilter).sort((a, b) => a.order - b.order)
  const allProjects = filteredProjects

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

          <div className="mb-10 flex justify-center">
            <div className="inline-flex rounded-lg border border-border bg-card p-1">
              <button
                type="button"
                onClick={() => setProjectFilter('DEV')}
                className={`rounded-md px-5 py-2 text-sm font-medium transition-all ${
                  projectFilter === 'DEV'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('projects.filterDev')}
              </button>
              <button
                type="button"
                onClick={() => setProjectFilter('GENERAL')}
                className={`rounded-md px-5 py-2 text-sm font-medium transition-all ${
                  projectFilter === 'GENERAL'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('projects.filterGeneral')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allProjects.map(project => (
              <div
                key={project.id}
                onClick={() =>
                  setModalContent({
                    type: 'project',
                    title: project.title[lang],
                    description: project.description[lang],
                    subtitle: project.dateMade,
                    tags: [],
                    gallery: project.gallery?.length ? project.gallery : undefined,
                    link: project.link || undefined,
                    techIcons: project.techIcons,
                    thumbnail: project.thumbnail,
                  })
                }
                className="group cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex flex-col">
                  <div className="relative w-full">
                    {project.techIcons && project.techIcons.length > 0 ? (
                      <div className="w-full h-48 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap content-center items-center justify-center gap-4">
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
                          alt={`${project.title[lang]} thumbnail`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : project.gallery && project.gallery.length > 0 ? (
                      <Carousel opts={{ loop: true }} className="w-full h-48">
                        <CarouselContent className="h-full">
                          {project.gallery.map(img => (
                            <CarouselItem key={img} className="h-full">
                              <img
                                src={img}
                                alt={`${project.title[lang]} screenshot`}
                                className="w-full h-full object-cover"
                              />
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
                          <span className="text-xs">{project.title[lang]}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between p-5">
                    <div>
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <h3 className="text-lg font-bold text-foreground">{project.title[lang]}</h3>
                        <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                          {project.type === 'DEV'
                            ? t('projects.badgeDev')
                            : t('projects.badgeGeneral')}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{project.dateMade}</p>
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {project.description[lang]}
                      </p>
                    </div>
                    {project.type === 'DEV' && (
                      <div className="flex flex-wrap items-center gap-3">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalContent && (
        <DetailModal
          isOpen={modalContent !== null}
          onClose={() => setModalContent(null)}
          title={modalContent.title}
          description={modalContent.description}
          subtitle={modalContent.subtitle}
          period={undefined}
          gallery={modalContent.gallery}
          link={modalContent.link}
          techIcons={modalContent.techIcons}
          thumbnail={modalContent.thumbnail}
        />
      )}
    </>
  )
}
