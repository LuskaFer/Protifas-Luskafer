import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import { ExperienceModal } from '@/shared/components/ExperienceModal'

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
      pt: 'Co-liderando a modernização tecnológica do Cartório Municipal e atuando no núcleo que define as inovações da nova solução. Iniciei no desenvolvimento Full-Stack (Node.js, React, Laravel). Antes de viabilizarmos a construção desse software 2.0, conquistei a confiança da secretaria estabilizando o sistema legado através de manutenções e integrações críticas, assumindo tarefas de alto risco e responsabilidade. Atualmente, colaboro na arquitetura do zero do novo Portal CCS: um sistema escalável utilizando Java 25 (Clean Architecture + DDD) no Back-End e React + Vite (Feature-Based Architecture) no Front-End. O ecossistema inclui automações avançadas e um Chatbot com IA integrada, impactando e otimizando diretamente milhares de processos da cidade.',
      en: 'Co-leading the technological modernization of the Municipal Notary, acting as part of the core team defining the innovations for the new solution. Started as a Full-Stack developer (Node.js, React, Laravel). Before we could bring this 2.0 software refactoring to life, I earned the departments trust by stabilizing the legacy system through critical maintenance and integrations of high risk and responsibility. Currently collaborating to architect from scratch the new CCS Portal: a scalable system using Java 25 (Clean Architecture + DDD) for the Backend, and React + Vite (Feature-Based Architecture) for the Frontend. The ecosystem includes advanced automations and an AI-integrated Chatbot, directly optimizing thousands of city processes.',
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

export function ExperienceSection() {
  const { t, lang } = useLanguage()
  const [modalContent, setModalContent] = useState<{
    role: string
    company: string
    period: string
    description: string
  } | null>(null)

  return (
    <>
      <section id="experience" className="border-t border-border/50 px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t('experience.title')}
            </h2>
            <p className="mt-3 text-muted-foreground">{t('experience.subtitle')}</p>
          </div>

          <div className="space-y-6">
            {MOCK_EXPERIENCES.map(exp => (
              <div
                key={exp.id}
                onClick={() =>
                  setModalContent({
                    role: exp.role[lang],
                    company: exp.company,
                    period: exp.period[lang],
                    description: exp.description[lang],
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

      {modalContent && (
        <ExperienceModal
          isOpen={modalContent !== null}
          onClose={() => setModalContent(null)}
          role={modalContent.role}
          company={modalContent.company}
          period={modalContent.period}
          description={modalContent.description}
        />
      )}
    </>
  )
}
