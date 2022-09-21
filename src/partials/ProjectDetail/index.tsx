// Hooks
import { useParams } from 'react-router-dom'

// Components
import ProjectHero from 'components/ProjectHero'
import TextIntro from 'components/TextIntro'
import TextTwoColumns from 'components/TextTwoColumns'
import Media from 'components/Media'

// Data
import { data } from './mock'

// Hooks
import { useTranslation } from 'react-i18next'

type ModuleData = { component: string; [key: string]: string }

type Modules = {
  [key: string]: (props: any) => JSX.Element
}

const Components: Modules = {
  TextIntro,
  TextTwoColumns,
  Media
}

const ProjectDetail = () => {
  const { project } = useParams()

  const { t } = useTranslation(project)

  // Find the project in data
  // const slices = data.find(({ id }) => id === project)?.modules || []
  const modules = t('modules') as ModuleData[]

  // Return the modules of current project
  return (
    <>
      {/* <ProjectHero /> */}
      {/* {modules.map(({ component, ...props }, index) => {
        if (!Components?.[component]) {
          console.warn('Module not found -> ' + component)
          return null
        }

        const Component = Components[component]
        return <Component key={index} {...props} />
      })} */}
    </>
  )
}

export default ProjectDetail
