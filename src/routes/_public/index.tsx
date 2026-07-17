import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from './components/HeroSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ExperienceSection } from './components/ExperienceSection'
import { EducationSection } from './components/EducationSection'
import { ContactSection } from './components/ContactSection'

export const Route = createFileRoute('/_public/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-background pt-14">
      <HeroSection />
      <ProjectsSection />
      <EducationSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  )
}
