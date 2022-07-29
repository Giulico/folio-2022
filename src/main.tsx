import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

// Global styles
import 'styles/index.css'

// Store
import store from 'store'

// Components
import CustomRouter from 'components/CustomRouter'
import Router from 'components/Router'

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement)
root.render(
  // <React.StrictMode>
  <CustomRouter>
    <Provider store={store}>
      <Router />
    </Provider>
  </CustomRouter>
  // </React.StrictMode>
)
