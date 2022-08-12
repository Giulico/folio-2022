// Hooks
import { useParams } from 'react-router-dom'

// Components
import ProjectHero from 'components/ProjectHero'
import TextIntro from 'components/TextIntro'
import TextTwoColumns from 'components/TextTwoColumns'
import Media from 'components/Media'

// Data
import { data } from './mock'

type Modules = {
  [key: string]: (props: any) => JSX.Element
}

const modules: Modules = {
  ProjectHero,
  TextIntro,
  TextTwoColumns,
  Media
}

const ProjectDetail = () => {
  const { project } = useParams()

  // Find the project in data
  const slices = data.find(({ id }) => id === project)?.modules || []

  // Return the modules of current project
  return (
    <>
      {slices.map(({ component, ...props }, index) => {
        if (!modules?.[component]) {
          console.warn('Module not found -> ' + component)
          return null
        }

        const Component = modules[component]
        return <Component key={index} {...props} />
      })}
    </>
  )
}

export default ProjectDetail
