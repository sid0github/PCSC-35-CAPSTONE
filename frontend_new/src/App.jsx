import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'
import { NewsArticles } from './pages/NewsArticles'
import { SubmitNews } from './pages/SubmitNews'
import { Analytics } from './pages/Analytics'
import { Alerts } from './pages/Alerts'
import { Settings } from './pages/Settings'
import { ArticleDetail } from './pages/ArticleDetail'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <Router>
      <div className="flex h-screen bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
          />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/news" element={<NewsArticles />} />
                <Route path="/news/:id" element={<ArticleDetail />} />
                <Route path="/submit-news" element={<SubmitNews />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App

