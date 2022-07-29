// Components
import { Routes, Route } from 'react-router-dom'
import App from 'components/App'

function Router() {
  return (
    <Routes>
      <Route path="*" element={<App />} />
    </Routes>
  )
}

export default Router
