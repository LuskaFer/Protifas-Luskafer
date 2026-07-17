import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Globe,
  GraduationCap,
  Loader2,
  Mail,
  Send,
} from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { DetailModal } from '@/shared/components/DetailModal'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel'
import { HeroHighlight, Highlight } from '@/shared/ui/hero-highlight'

export const Route = createFileRoute('/_public/')({
  component: LandingPage,
})

const ITEMS_PER_PAGE = 3

const MOCK_PROJECTS: ProjectCardData[] = [
  {
    id: 'proj-1',
    type: 'DEV',
    title: { pt: 'Microserviço de Gestão de Clientes', en: 'Client Management Microservice' },
    dateMade: '2024',
    link: 'https://github.com/LuskaFer/mscliente---POS-TECH-FIAP',
    description: {
      pt: 'Desenvolvido em Java 21 com Spring Framework. A arquitetura segue rigorosamente os princípios de Clean Architecture, utilizando PostgreSQL e Flyway para migrações. Foco absoluto em qualidade de código com alta cobertura de testes (JUnit, Mockito, JaCoCo) e deploy padronizado via Docker.',
      en: 'Developed in Java 21 with Spring Framework. The architecture strictly follows Clean Architecture principles, using PostgreSQL and Flyway for migrations. Absolute focus on code quality with high test coverage (JUnit, Mockito, JaCoCo) and standardized Docker deployment.',
    },
    thumbnail: '/images/code-thumb-1.svg',
    gallery: [],
  },
  {
    id: 'proj-2',
    type: 'DEV',
    title: { pt: 'Microserviço Error Tracker', en: 'Error Tracker Microservice' },
    dateMade: '2024',
    link: 'https://github.com/LuskaFer/ms-error-tracker----POS-TECH-FIAP',
    description: {
      pt: 'Sistema distribuído para rastreamento de erros. Captura eventos de falha enviados de forma assíncrona via Apache Kafka, realiza a persistência segura no MySQL e expõe os dados através de uma API REST para análise e monitoramento em tempo real.',
      en: 'Distributed system for error tracking. Captures failure events sent asynchronously via Apache Kafka, securely persists them in MySQL, and exposes the data through a REST API for real-time analysis and monitoring.',
    },
    thumbnail: '/images/code-thumb-2.svg',
    gallery: [],
  },
  {
    id: 'proj-3',
    type: 'DEV',
    title: { pt: 'ERP de Gestão de Projetos (Oracle)', en: 'Project Management ERP (Oracle)' },
    dateMade: '2025',
    link: 'https://github.com/LuskaFer/ORACLE----Gest-Proj',
    description: {
      pt: 'Sistema corporativo robusto construído com Java 25 LTS e Spring Boot 4.0.4. Aplica Clean Architecture estrita e Domain-Driven Design (DDD), garantindo o isolamento total das regras de negócio sem dependência de frameworks externos. Inclui H2 Database e documentação via Swagger/OpenAPI.',
      en: 'Robust corporate system built with Java 25 LTS and Spring Boot 4.0.4. Applies strict Clean Architecture and Domain-Driven Design (DDD), ensuring total isolation of business rules without dependency on external frameworks. Includes H2 Database and Swagger/OpenAPI documentation.',
    },
    thumbnail: '/images/code-thumb-3.svg',
    gallery: [],
  },
  {
    id: 'proj-4',
    type: 'GENERAL',
    title: { pt: 'Horta Autônoma Indoor (IoT)', en: 'Autonomous Indoor Garden (IoT)' },
    dateMade: '2022',
    link: '',
    description: {
      pt: 'Projeto de automação e sustentabilidade. Integrei controladores smart (IoT) para gerenciar umidificadores, iluminação e um sistema automático de irrigação dentro de casa. Um estudo prático sobre necessidades ambientais e autossuficiência que rendeu vegetais e frutos reais.',
      en: 'Automation and sustainability project. Integrated smart controllers (IoT) to manage humidifiers, lighting, and an automatic irrigation system indoors. A practical study on environmental needs and self-sufficiency that yielded real vegetables and fruits.',
    },
    thumbnail: '/images/horta.png',
    gallery: [],
  },
  {
    id: 'proj-5',
    type: 'GENERAL',
    title: { pt: 'Restauração: GSX F 1998', en: 'Restoration: GSX F 1998' },
    dateMade: '2021',
    link: '',
    description: {
      pt: 'Restauração completa de uma moto adquirida sucateada. Com apoio familiar e usando IA para troubleshooting, refiz a elétrica, adaptei um painel digital tecnológico, reparei a mecânica (carburadores/freios) e criei novas carenagens, culminando na legalização total do veículo.',
      en: "Complete restoration of a scrapped motorcycle. With family support and AI for troubleshooting, I rebuilt the electronics, adapted a tech digital dashboard, repaired the mechanics (carburetors/brakes), and created new fairings, culminating in the vehicle's full street legalization.",
    },
    thumbnail: '/images/moto2.jpg',
    gallery: [],
  },
  {
    id: 'proj-6',
    type: 'GENERAL',
    title: { pt: 'Restauração: Kawasaki ZX11 1995', en: 'Restoration: Kawasaki ZX11 1995' },
    dateMade: '2023',
    link: '',
    description: {
      pt: 'Recuperação de uma moto inoperante com a parte elétrica destruída por ácido de bateria. Refiz o chicote, restaurei a carburação e adicionei upgrades (velocímetro digital, voltímetro, USB). Um projeto de paciência e precisão mecânica.',
      en: 'Recovery of an inoperative motorcycle with battery-acid destroyed electronics. Rebuilt the wiring harness, restored the carburetors, and added upgrades (digital speedometer, voltmeter, USB). A project of patience and mechanical precision.',
    },
    thumbnail: '/images/moto1.jpg',
    gallery: [],
  },
]

const MOCK_EXPERIENCES: ExperienceCardData[] = [
  {
    id: 'exp-1',
    role: {
      pt: 'Arquiteto de Software & Engenheiro Full-Stack',
      en: 'Software Architect & Full-Stack Engineer',
    },
    company: 'Prefeitura de São José dos Campos',
    period: { pt: 'Abril 2025 - Presente', en: 'April 2025 - Present' },
    description: {
      pt: 'Liderando a modernização tecnológica do Cartório Municipal. Iniciei atuando no desenvolvimento Full-Stack (Node.js, React, Laravel). Atualmente, sou responsável por arquitetar do zero o novo Portal CCS: um sistema escalável utilizando Java 25 (Clean Architecture + DDD) no Back-End e React + Vite (Feature-Based Architecture) no Front-End. O ecossistema inclui automações avançadas e um Chatbot com IA integrada, impactando e otimizando diretamente milhares de processos da cidade.',
      en: 'Leading the technological modernization of the Municipal Notary. Started as a Full-Stack developer (Node.js, React, Laravel). Currently architecting from scratch the new CCS Portal: a scalable system using Java 25 (Clean Architecture + DDD) for the Backend, and React + Vite for the Frontend. The ecosystem includes advanced automations and an AI-integrated Chatbot, directly optimizing thousands of city processes.',
    },
    link: 'https://portalccs.sjc.sp.gov.br/login',
    thumbnail: '',
    gallery: [],
  },
  {
    id: 'exp-2',
    role: { pt: 'Desenvolvedor Front-End', en: 'Front-End Developer' },
    company: 'DoesWork',
    period: { pt: 'Julho 2023 - Dezembro 2023', en: 'July 2023 - December 2023' },
    description: {
      pt: 'Desenvolvimento e evolução de um CRM corporativo. Foco na construção de interfaces responsivas com JavaScript e integração contínua de APIs REST providas por um Back-End construído em Django.',
      en: 'Development and evolution of a corporate CRM. Focused on building responsive interfaces using JavaScript and seamlessly integrating REST APIs provided by a Django backend.',
    },
    link: '',
    thumbnail: '',
    gallery: [],
  },
  {
    id: 'exp-3',
    role: { pt: 'Desenvolvedor Full-Stack & DevOps', en: 'Full-Stack Developer & DevOps' },
    company: 'Instituto Você',
    period: { pt: 'Janeiro 2022 - Agosto 2022', en: 'January 2022 - August 2022' },
    description: {
      pt: 'Desenvolvimento End-to-End de um sistema de gestão empresarial (ERP) em PHP. Além do código, assumi as responsabilidades de DevOps, arquitetando, configurando e mantendo a infraestrutura de servidores CentOS rodando na nuvem do Microsoft Azure.',
      en: 'End-to-end development of an Enterprise Resource Planning (ERP) system in PHP. Beyond coding, I took on DevOps responsibilities, architecting, configuring, and maintaining CentOS servers running on the Microsoft Azure cloud.',
    },
    link: 'https://1234voce.com.br/',
    thumbnail: '',
    gallery: [],
  },
  {
    id: 'exp-4',
    role: {
      pt: 'Técnico Autônomo em Eletroeletrônica',
      en: 'Independent Electromechanical Technician',
    },
    company: 'Projetos Físicos & Engenharia Aplicada',
    period: { pt: '2020', en: '2020' },
    description: {
      pt: 'Trabalho "mão na massa" focado em hardware veicular. Realizei desde diagnósticos e reparos de componentes até a reestruturação completa de chicotes elétricos em motocicletas e instalação de acessórios complexos. Uma experiência pura de troubleshooting sistêmico aplicado ao mundo real.',
      en: 'Hands-on work focused on vehicular hardware. Executed everything from component diagnostics and repairs to the complete restructuring of electrical wiring harnesses on motorcycles and complex accessory installations. A pure experience of systemic troubleshooting applied to the real world.',
    },
    link: '',
    thumbnail: '',
    gallery: [],
  },
  {
    id: 'exp-5',
    role: {
      pt: 'Especialista Eletromecânico & Operações Tecnológicas',
      en: 'Electromechanical Specialist & Tech Operations',
    },
    company: 'KITLIVRE / Rock in Rio',
    period: { pt: 'Dezembro 2016 - Outubro 2019', en: 'December 2016 - October 2019' },
    description: {
      pt: 'Iniciei na montagem mecânica e elétrica de sistemas motorizados que transformam cadeiras de rodas em triciclos elétricos (módulos de ré, aceleração e controle). Evoluí para operações estratégicas viajando o Brasil. Destaque para minha atuação nas edições do Rock in Rio (2017 e 2019), onde gerenciei a logística e hardware dos triciclos assistivos e instalei sistemas complexos de Realidade Virtual (HTC Vive) para ações de imersão do público.',
      en: 'Started in the mechanical and electrical assembly of motorized systems that transform wheelchairs into electric tricycles (reverse modules, acceleration, and control). Evolved into strategic operations traveling across Brazil. A major highlight was my role in the Rock in Rio festivals (2017 and 2019), where I managed the logistics/hardware of assistive tricycles and installed complex Virtual Reality systems (HTC Vive) for public immersion.',
    },
    link: '',
    thumbnail: '',
    gallery: [],
  },
]

const MOCK_EDUCATION: EducationCardData[] = [
  {
    "id": "edu-2",
    "course": {
      "pt": "Graduação em Inteligência Artificial",
      "en": "Bachelor’s in Artificial Intelligence"
    },
    "institution": "Anhembi Morumbi",
    "period": { "pt": "Cursando até 2028", "en": "Studying until 2028" },
    "description": { 
      "pt": "Formação abrangente focada em algoritmos avançados, Machine Learning e Deep Learning. O currículo explora o processamento de linguagem natural (NLP), visão computacional e análise de grandes volumes de dados (Big Data). Desenvolve a capacidade de criar e integrar soluções inteligentes, como agentes autônomos e sistemas RAG, em arquiteturas de software corporativas. Prepara o profissional para liderar a inovação tecnológica unindo IA generativa com engenharia de dados.", 
      "en": "Comprehensive degree focused on advanced algorithms, Machine Learning, and Deep Learning. The curriculum explores natural language processing (NLP), computer vision, and large-scale data analysis (Big Data). It develops the ability to build and integrate intelligent solutions, such as autonomous agents and RAG systems, into corporate software architectures. Prepares professionals to lead technological innovation by bridging generative AI with data engineering." 
    }
  },
  {
    "id": "edu-1",
    "course": {
      "pt": "Pós-graduação em Arquitetura em Java",
      "en": "Postgraduate in Java Architecture"
    },
    "institution": "FIAP",
    "period": { "pt": "Formado em 2025", "en": "Graduated in 2025" },
    "description": { 
      "pt": "Especialização profunda em Engenharia de Software focada no ecossistema Java. O curso aborda intensamente a modelagem de sistemas escaláveis através de Domain-Driven Design (DDD) e Clean Architecture (CC). A grade abrange a criação de microsserviços resilientes, aplicação de Design Patterns, mensageria e cloud computing. Mantém um foco contínuo em qualidade de software, testes automatizados, boas práticas de codificação e elaboração de documentações técnicas de alto padrão.", 
      "en": "Deep specialization in Software Engineering focused on the Java ecosystem. The course heavily covers the modeling of scalable systems through Domain-Driven Design (DDD) and Clean Architecture (CC). The curriculum ranges from building resilient microservices to applying Design Patterns, messaging, and cloud computing. It maintains a continuous focus on software quality, automated testing, coding best practices, and crafting high-standard technical documentation." 
    }
  },
  {
    "id": "edu-3",
    "course": {
      "pt": "Análise e Desenvolvimento de Sistemas",
      "en": "Systems Analysis and Development"
    },
    "institution": "FIAP",
    "period": { "pt": "Formado em 2021", "en": "Graduated in 2021" },
    "description": { 
      "pt": "Curso prático focado no ciclo completo de desenvolvimento de software e metodologias ágeis. Constrói uma base sólida em lógica de programação, estruturas de dados, engenharia de requisitos e versionamento. Aborda a modelagem de bancos de dados relacionais e não-relacionais, além do desenvolvimento de APIs RESTful. Prepara para a resolução de problemas complexos de negócios através de tecnologias modernas e integração contínua de sistemas.", 
      "en": "Practical course focused on the complete software development lifecycle and agile methodologies. It builds a solid foundation in programming logic, data structures, requirements engineering, and version control. It covers relational and non-relational database modeling, as well as RESTful API development. Prepares students to solve complex business problems using modern technologies and continuous systems integration." 
    }
  },
  {
    "id": "edu-4",
    "course": {
      "pt": "Design Gráfico",
      "en": "Graphic Design"
    },
    "institution": "UNIP",
    "period": { "pt": "Formado em 2019", "en": "Graduated in 2019" },
    "description": { 
      "pt": "Formação centrada em comunicação visual, usabilidade e princípios de experiência do usuário (UX/UI). Envolve o estudo aprofundado de tipografia, teoria das cores, identidade visual e composição de layouts funcionais. Esta base criativa proporciona uma visão diferenciada no desenvolvimento de software e arquitetura de frontends. Facilita o alinhamento entre a engenharia de sistemas e a entrega de produtos digitais mais intuitivos e acessíveis.", 
      "en": "Education centered on visual communication, usability, and user experience (UX/UI) principles. It involves the in-depth study of typography, color theory, visual identity, and functional layout composition. This creative background provides a unique perspective in software development and frontend architecture. It facilitates the alignment between systems engineering and the delivery of intuitive, accessible digital products." 
    }
  },
  {
    "id": "edu-5",
    "course": {
      "pt": "Técnico em Administração",
      "en": "Technical in Administration"
    },
    "institution": "ETEC",
    "period": { "pt": "Formado em 2014", "en": "Graduated in 2014" },
    "description": { 
      "pt": "Introdução abrangente aos princípios de gestão empresarial, economia e planejamento estratégico. O curso engloba rotinas financeiras, contabilidade básica, gestão de recursos humanos e processos logísticos. Proporciona uma compreensão clara de como as organizações operam internamente e geram valor no mercado. Essa base em negócios é um diferencial para entender regras de domínio corporativas e aplicar conceitos de DDD na prática.", 
      "en": "Comprehensive introduction to the principles of business management, economics, and strategic planning. The course covers financial routines, basic accounting, human resources management, and logistical processes. It provides a clear understanding of how organizations operate internally and generate market value. This business foundation is a key differentiator for understanding corporate domain rules and practically applying DDD concepts." 
    }
  },
  {
    "id": "edu-6",
    "course": {
      "pt": "Técnico em T.I.",
      "en": "IT Technician"
    },
    "institution": "Senac",
    "period": { "pt": "Formado em 2014", "en": "Graduated in 2014" },
    "description": { 
      "pt": "Formação técnica de base que abrange os fundamentos práticos da infraestrutura de computação. O currículo inclui montagem e manutenção de hardware, configuração de redes locais (LAN/WAN) e administração de sistemas operacionais. Oferece a introdução essencial à lógica de programação e ao suporte técnico de TI corporativo. Serviu como o alicerce fundamental para a transição e aprofundamento na área de engenharia de software.", 
      "en": "Foundational technical education covering the practical fundamentals of computing infrastructure. The curriculum includes hardware assembly and maintenance, local area network (LAN/WAN) configuration, and operating systems administration. It offers the essential introduction to programming logic and corporate IT support. It served as the crucial cornerstone for the transition and deep dive into the software engineering field." 
    },
  }
]

interface ProjectCardData {
  id: string
  type: 'DEV' | 'GENERAL'
  title: { pt: string; en: string }
  dateMade: string
  description: { pt: string; en: string }
  link: string
  thumbnail: string | null
  gallery: string[]
}

interface ExperienceCardData {
  id: string
  role: { pt: string; en: string }
  company: string
  period: { pt: string; en: string }
  description: { pt: string; en: string }
  link: string
  thumbnail: string | null
  gallery: string[]
}

interface EducationCardData {
  id: string
  course: { pt: string; en: string }
  institution: string
  period: { pt: string; en: string }
  description: { pt: string; en: string }
}

function ContactForm() {
  const { t } = useLanguage()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (response.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
          {t('contact.nameLabel')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={t('contact.namePlaceholder')}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
          {t('contact.emailLabel')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t('contact.emailPlaceholder')}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          {t('contact.messageLabel')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder={t('contact.messagePlaceholder')}
          className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t('contact.sending')}
          </>
        ) : (
          <>
            <Send className="size-4" />
            {t('contact.send')}
          </>
        )}
      </button>
      {status === 'success' && (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="size-4 shrink-0" />
          {t('contact.success')}
        </div>
      )}
      {status === 'error' && <p className="text-sm text-destructive">{t('contact.error')}</p>}
    </form>
  )
}

interface ModalContent {
  type: 'project' | 'experience'
  title: string
  description: string
  subtitle?: string
  period?: string
  tags?: string[]
  gallery?: string[]
  link?: string
}

function LandingPage() {
  const { t, lang } = useLanguage()
  const [projectFilter, setProjectFilter] = useState<'DEV' | 'GENERAL'>('DEV')
  const [projectPage, setProjectPage] = useState(0)
  const [modalContent, setModalContent] = useState<ModalContent | null>(null)

  const allProjects = MOCK_PROJECTS
  const allExperiences = MOCK_EXPERIENCES

  const filteredProjects = allProjects.filter(p => p.type === projectFilter)
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE))
  const safePage = Math.min(projectPage, totalPages - 1)
  const paginatedProjects = filteredProjects.slice(
    safePage * ITEMS_PER_PAGE,
    (safePage + 1) * ITEMS_PER_PAGE,
  )

  return (
    <div className="min-h-screen bg-background pt-14">
      <HeroHighlight containerClassName="min-h-screen" className="px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {t('hero.badge')}
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {t('hero.titleLine1')}
            <br />
            <Highlight className="text-foreground">{t('hero.titleHighlight')}</Highlight>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t('hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/luskafer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98]"
            >
              <Code2 className="size-4" />
              GitHub
              <ArrowUpRight className="size-3.5 opacity-70" />
            </a>
            <a
              href="https://linkedin.com/in/lucas-fernandes22"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent active:scale-[0.98]"
            >
              <Globe className="size-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </HeroHighlight>

      {/* Latest Projects */}
      <section id="projects" className="relative border-t border-border/50 bg-muted/30 px-4 py-24">
        <div className="mx-auto max-w-4xl">
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
                onClick={() => {
                  setProjectFilter('DEV')
                  setProjectPage(0)
                }}
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
                onClick={() => {
                  setProjectFilter('GENERAL')
                  setProjectPage(0)
                }}
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

          <div className="space-y-8">
            {paginatedProjects.map(project => (
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
                  })
                }
                className="group cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md"
              >
                <div className="grid md:grid-cols-5">
                  <div className="relative md:col-span-1">
                    {project.thumbnail ? (
                      <div className="aspect-[4/3] w-full relative overflow-hidden rounded-t-2xl md:aspect-auto md:h-full md:rounded-tr-none md:rounded-bl-2xl">
                        <img
                          src={project.thumbnail}
                          alt={`${project.title[lang]} thumbnail`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : project.gallery && project.gallery.length > 0 ? (
                      <Carousel opts={{ loop: true }} className="h-full">
                        <CarouselContent className="h-full">
                          {project.gallery.map(img => (
                            <CarouselItem key={img} className="h-full">
                              <img
                                src={img}
                                alt={`${project.title[lang]} screenshot`}
                                className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full"
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 size-7" />
                        <CarouselNext className="right-2 size-7" />
                      </Carousel>
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-muted/50 md:aspect-auto md:h-full">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Code2 className="size-8" />
                          <span className="text-xs">{project.title[lang]}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between p-6 md:col-span-4">
                    <div>
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <h3 className="text-xl font-bold text-foreground">{project.title[lang]}</h3>
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
                    <div className="flex gap-3">
                      {project.link && (
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setProjectPage(p => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
                {t('projects.previous')}
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i).map(pageIndex => (
                  <button
                    key={`page-${pageIndex}`}
                    type="button"
                    onClick={() => setProjectPage(pageIndex)}
                    className={`flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      pageIndex === safePage
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setProjectPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={safePage === totalPages - 1}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('projects.next')}
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Academic Formation */}
      <section id="education" className="border-t border-border/50 px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10">
              <GraduationCap className="size-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('education.title')}
            </h2>
            <p className="mt-3 text-muted-foreground">{t('education.subtitle')}</p>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-px" />

            <div className="space-y-12">
              {MOCK_EDUCATION.map((edu, index) => (
                <div
                  key={edu.id}
                  className={`relative flex flex-col gap-6 md:flex-row ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="absolute left-4 top-1 z-10 flex size-3 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-background md:left-1/2" />

                  <div className="hidden md:block md:w-1/2" />

                  <div className="ml-10 md:ml-0 md:w-1/2">
                    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <GraduationCap className="size-3.5" />
                        {edu.period[lang] || <span className="italic">{t('education.noDate')}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{edu.course[lang]}</h3>
                      <p className="mb-3 text-sm font-medium text-primary">{edu.institution}</p>
                      {edu.description[lang] && (
                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {edu.description[lang]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section id="experience" className="border-t border-border/50 px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('experience.title')}
            </h2>
            <p className="mt-3 text-muted-foreground">{t('experience.subtitle')}</p>
          </div>

          <div className="space-y-6">
            {allExperiences.map(exp => (
              <div
                key={exp.id}
                onClick={() =>
                  setModalContent({
                    type: 'experience',
                    title: exp.role[lang],
                    description: exp.description[lang],
                    subtitle: exp.company,
                    period: exp.period[lang],
                    gallery: exp.gallery?.length ? exp.gallery : undefined,
                    link: exp.link || undefined,
                  })
                }
                className="group cursor-pointer rounded-xl border border-border/50 bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{exp.role[lang]}</h3>
                      <p className="text-sm font-medium text-primary">{exp.company}</p>
                    </div>
                    <span className="shrink-0 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                      <Calendar className="size-3" />
                      {exp.period[lang]}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {exp.description[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-border/50 bg-muted/30 px-4 py-24">
        <div className="mx-auto max-w-lg">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="size-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('contact.title')}
            </h2>
            <p className="mt-3 text-muted-foreground">{t('contact.subtitle')}</p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="border-t border-border/50 px-4 py-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Luskafer. {t('footer.builtWith')}
        </p>
      </footer>

      <DetailModal
        isOpen={modalContent !== null}
        onClose={() => setModalContent(null)}
        title={modalContent?.title ?? ''}
        description={modalContent?.description ?? ''}
        subtitle={modalContent?.subtitle}
        period={modalContent?.period}
        tags={modalContent?.tags}
        gallery={modalContent?.gallery}
        link={modalContent?.link}
      />
    </div>
  )
}
