import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import DashboardPage from './pages/dashboard';

/**
 * App Router (Client)
 * -------------------
 * Defines the SPA routes:
 * - /, /login -> Login screen
 * - /register -> Signup screen
 * - /dashboard -> Main authenticated dashboard
 */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
