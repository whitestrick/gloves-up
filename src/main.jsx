import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'
 6-register-with-email-and-password
import ToastProvider from './context/ToastProvider.jsx'
=======
 main

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
 6-register-with-email-and-password
        <ToastProvider>
          <App />
        </ToastProvider>
=======
        <App />
 main
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
