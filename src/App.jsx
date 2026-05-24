import { useState } from 'react'
import { Routes, Route } from 'react-router'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import FoodLog from './pages/FoodLog'
import MyFoodList from './pages/MyFoodList'
import Analytics from './pages/Analytics'
import Goals from './pages/Goals'
import Profile from './pages/Profile'
import LandingPage from './pages/LandingPage/Hero'

function App() {
  const [theme, setTheme] = useState(() => {
    // Read from localStorage on first load
    const saved = localStorage.getItem('theme') || 'light'
    // Apply immediately so the class is set before first render
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return saved
  })

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    // ⚠️ No bg color here — let body/index.css handle it via CSS vars
    <div className="min-h-screen">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/food-log" element={<FoodLog />} />
        <Route path="/my-food-list" element={<MyFoodList />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App