
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import AuthCallback from './pages/auth-callback'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
)