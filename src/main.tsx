import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

// i18n
import './i18n'

// Polyfills
import 'intersection-observer'

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
  <CustomRouter>
    <Provider store={store}>
      <Router />
    </Provider>
  </CustomRouter>
)
