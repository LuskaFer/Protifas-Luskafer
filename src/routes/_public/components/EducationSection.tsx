import { useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { useLanguage } from '@/shared/contexts/LanguageContext'
import { EducationModal } from '@/shared/components/EducationModal'

interface EducationCardData {
  id: string
  course: { pt: string; en: string }
  institution: string
  period: { pt: string; en: string }
  description: { pt: string; en: string }
}

const MOCK_EDUCATION: EducationCardData[] = [
  {
    id: 'edu-2',
    course: {
      pt: 'Graduação em Inteligência Artificial',
      en: 'Bachelor\u2019s in Artificial Intelligence',
    },
    institution: 'Anhembi Morumbi',
    period: { pt: 'Cursando até 2028', en: 'Studying until 2028' },
    description: {
      pt: 'Formação abrangente focada em algoritmos avançados, Machine Learning e Deep Learning. O currículo explora o processamento de linguagem natural (NLP), visão computacional e análise de grandes volumes de dados (Big Data). Desenvolve a capacidade de criar e integrar soluções inteligentes, como agentes autônomos e sistemas RAG, em arquiteturas de software corporativas. Prepara o profissional para liderar a inovação tecnológica unindo IA generativa com engenharia de dados.',
      en: 'Comprehensive degree focused on advanced algorithms, Machine Learning, and Deep Learning. The curriculum explores natural language processing (NLP), computer vision, and large-scale data analysis (Big Data). It develops the ability to build and integrate intelligent solutions, such as autonomous agents and RAG systems, into corporate software architectures. Prepares professionals to lead technological innovation by bridging generative AI with data engineering.',
    },
  },
  {
    id: 'edu-1',
    course: {
      pt: 'Pós-graduação em Arquitetura em Java',
      en: 'Postgraduate in Java Architecture',
    },
    institution: 'FIAP',
    period: { pt: 'Formado em 2025', en: 'Graduated in 2025' },
    description: {
      pt: 'Especialização profunda em Engenharia de Software focada no ecossistema Java. O curso aborda intensamente a modelagem de sistemas escaláveis através de Domain-Driven Design (DDD) e Clean Architecture (CC). A grade abrange a criação de microsserviços resilientes, aplicação de Design Patterns, mensageria e cloud computing. Mantém um foco contínuo em qualidade de software, testes automatizados, boas práticas de codificação e elaboração de documentações técnicas de alto padrão.',
      en: 'Deep specialization in Software Engineering focused on the Java ecosystem. The course heavily covers the modeling of scalable systems through Domain-Driven Design (DDD) and Clean Architecture (CC). The curriculum ranges from building resilient microservices to applying Design Patterns, messaging, and cloud computing. It maintains a continuous focus on software quality, automated testing, coding best practices, and crafting high-standard technical documentation.',
    },
  },
  {
    id: 'edu-3',
    course: {
      pt: 'Análise e Desenvolvimento de Sistemas',
      en: 'Systems Analysis and Development',
    },
    institution: 'FIAP',
    period: { pt: 'Formado em 2021', en: 'Graduated in 2021' },
    description: {
      pt: 'Curso prático focado no ciclo completo de desenvolvimento de software e metodologias ágeis. Constrói uma base sólida em lógica de programação, estruturas de dados, engenharia de requisitos e versionamento. Aborda a modelagem de bancos de dados relacionais e não-relacionais, além do desenvolvimento de APIs RESTful. Prepara para a resolução de problemas complexos de negócios através de tecnologias modernas e integração contínua de sistemas.',
      en: 'Practical course focused on the complete software development lifecycle and agile methodologies. It builds a solid foundation in programming logic, data structures, requirements engineering, and version control. It covers relational and non-relational database modeling, as well as RESTful API development. Prepares students to solve complex business problems using modern technologies and continuous systems integration.',
    },
  },
  {
    id: 'edu-4',
    course: {
      pt: 'Design Gráfico',
      en: 'Graphic Design',
    },
    institution: 'UNIP',
    period: { pt: 'Formado em 2019', en: 'Graduated in 2019' },
    description: {
      pt: 'Formação centrada em comunicação visual, usabilidade e princípios de experiência do usuário (UX/UI). Envolve o estudo aprofundado de tipografia, teoria das cores, identidade visual e composição de layouts funcionais. Esta base criativa proporciona uma visão diferenciada no desenvolvimento de software e arquitetura de frontends. Facilita o alinhamento entre a engenharia de sistemas e a entrega de produtos digitais mais intuitivos e acessíveis.',
      en: 'Education centered on visual communication, usability, and user experience (UX/UI) principles. It involves the in-depth study of typography, color theory, visual identity, and functional layout composition. This creative background provides a unique perspective in software development and frontend architecture. It facilitates the alignment between systems engineering and the delivery of intuitive, accessible digital products.',
    },
  },
  {
    id: 'edu-5',
    course: {
      pt: 'Técnico em Administração',
      en: 'Technical in Administration',
    },
    institution: 'ETEC',
    period: { pt: 'Formado em 2014', en: 'Graduated in 2014' },
    description: {
      pt: 'Introdução abrangente aos princípios de gestão empresarial, economia e planejamento estratégico. O curso engloba rotinas financeiras, contabilidade básica, gestão de recursos humanos e processos logísticos. Proporciona uma compreensão clara de como as organizações operam internamente e geram valor no mercado. Essa base em negócios é um diferencial para entender regras de domínio corporativas e aplicar conceitos de DDD na prática.',
      en: 'Comprehensive introduction to the principles of business management, economics, and strategic planning. The course covers financial routines, basic accounting, human resources management, and logistical processes. It provides a clear understanding of how organizations operate internally and generate market value. This business foundation is a key differentiator for understanding corporate domain rules and practically applying DDD concepts.',
    },
  },
  {
    id: 'edu-6',
    course: {
      pt: 'Técnico em T.I.',
      en: 'IT Technician',
    },
    institution: 'Senac',
    period: { pt: 'Formado em 2014', en: 'Graduated in 2014' },
    description: {
      pt: 'Formação técnica de base que abrange os fundamentos práticos da infraestrutura de computação. O currículo inclui montagem e manutenção de hardware, configuração de redes locais (LAN/WAN) e administração de sistemas operacionais. Oferece a introdução essencial à lógica de programação e ao suporte técnico de TI corporativo. Serviu como o alicerce fundamental para a transição e aprofundamento na área de engenharia de software.',
      en: 'Foundational technical education covering the practical fundamentals of computing infrastructure. The curriculum includes hardware assembly and maintenance, local area network (LAN/WAN) configuration, and operating systems administration. It offers the essential introduction to programming logic and corporate IT support. It served as the crucial cornerstone for the transition and deep dive into the software engineering field.',
    },
  },
]

export function EducationSection() {
  const { t, lang } = useLanguage()
  const [modalContent, setModalContent] = useState<{
    course: string
    institution: string
    period: string
    description: string
  } | null>(null)

  return (
    <>
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
                    <div
                      onClick={() =>
                        setModalContent({
                          course: edu.course[lang],
                          institution: edu.institution,
                          period: edu.period[lang],
                          description: edu.description[lang],
                        })
                      }
                      className="cursor-pointer rounded-xl border border-border/50 bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-md"
                    >
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

      {modalContent && (
        <EducationModal
          isOpen={modalContent !== null}
          onClose={() => setModalContent(null)}
          course={modalContent.course}
          institution={modalContent.institution}
          period={modalContent.period}
          description={modalContent.description}
        />
      )}
    </>
  )
}
