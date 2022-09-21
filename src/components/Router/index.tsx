// Contexts
import { ModalContext } from 'components/Modal'

// Components
import { Routes, Route } from 'react-router-dom'
import App from 'components/App'
import ProjectDetail from 'partials/ProjectDetail'

// Hooks
import { useContext } from 'react'

function Router() {
  return (
    <Routes>
      <Route path="*" element={<App />} />
    </Routes>
  )
}

export function ModalRoutes() {
  const { displayLocation } = useContext(ModalContext)

  return (
    <Routes location={displayLocation}>
      {/* <Route path=":project" element={<ProjectDetail />} /> */}
      <Route path=":project" element={<p>test</p>} />
    </Routes>
  )
}

export default Router
