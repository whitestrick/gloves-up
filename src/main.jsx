import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import ToastProvider from './context/ToastProvider.jsx'
import RoutineDraftProvider from './context/RoutineDraftProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          {/* NEW: every page below can now read and change the routine draft */}
          <RoutineDraftProvider>
            <App />
          </RoutineDraftProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
