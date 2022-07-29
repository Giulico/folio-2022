// Hooks
import { useParams } from 'react-router-dom'

// Components
import Container from 'components/Container'

const ProjectDetail = () => {
  const { project } = useParams()

  return (
    <>
      <Container>
        <h1>{project}</h1>
        <p>Project detail asasda</p>
      </Container>
    </>
  )
}

export default ProjectDetail
