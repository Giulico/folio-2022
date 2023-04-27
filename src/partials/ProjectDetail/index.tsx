// Hooks
import { useParams } from 'react-router-dom'

// Components
import ProjectHero from 'components/ProjectHero'
import ProjectCTA from 'components/ProjectCTA'
import TextIntro from 'components/TextIntro'
import TextTwoColumns from 'components/TextTwoColumns'
import Media from 'components/Media'
import Awards from 'components/Awards'
import Numbers from 'components/Numbers'

// Hooks
import { useTranslation } from 'react-i18next'

type ModuleData = { component: string; [key: string]: string }

type Modules = {
  [key: string]: (props: any) => JSX.Element
}

const Components: Modules = {
  Awards,
  Media,
  Numbers,
  TextIntro,
  TextTwoColumns
}

const ProjectDetail = () => {
  const { project } = useParams()

  const { t } = useTranslation(project)

  // Find the project in data
  // const modules = data.find(({ id }) => id === project)?.modules || []
  const modules = t('modules') as unknown as ModuleData[]

  // Return the modules of current project
  return (
    <>
      <ProjectHero />
      {modules.map(({ component, ...props }, index) => {
        if (!Components?.[component]) {
          console.warn('Module not found -> ' + component)
          return null
        }

        const Component = Components[component]
        return <Component key={index} {...props} />
      })}
      <ProjectCTA />
    </>
  )
}

export default ProjectDetail
