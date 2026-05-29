import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import DashboardLayout from './components/DashboardLayout'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import LandingPage from './pages/LandingPage/Hero'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import FoodLog from './pages/FoodLog'
import MyFoodList from './pages/MyFoodList'
import Analytics from './pages/Analytics'
import Goals from './pages/Goals'
import Profile from './pages/Profile'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <>
      {!isLoggedIn && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/dashboard" element={
          <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
            <Dashboard />
          </DashboardLayout>
        } />
        <Route path="/food-log" element={
          <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
            <FoodLog />
          </DashboardLayout>
        } />
        <Route path="/my-food-list" element={
          <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
            <MyFoodList />
          </DashboardLayout>
        } />
        <Route path="/analytics" element={
          <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
            <Analytics />
          </DashboardLayout>
        } />
        <Route path="/goals" element={
          <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
            <Goals />
          </DashboardLayout>
        } />
        <Route path="/profile" element={
          <DashboardLayout theme={theme} toggleTheme={toggleTheme}>
            <Profile />
          </DashboardLayout>
        } />
      </Routes>
      
      {!isLoggedIn && <Footer />}
    </>
  )
}

export default App