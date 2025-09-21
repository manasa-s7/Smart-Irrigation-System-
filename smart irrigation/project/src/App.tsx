import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginForm from './components/Auth/LoginForm'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Dashboard from './views/Dashboard'
import Fields from './views/Fields'
import Crops from './views/Crops'
import Reports from './views/Reports'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  // Listen for navigation events from quick actions
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      setActiveView(event.detail)
    }

    window.addEventListener('navigate', handleNavigate as EventListener)
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Smart Irrigation System...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onToggleMode={() => setIsSignUp(!isSignUp)} isSignUp={isSignUp} />
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'fields':
        return <Fields />
      case 'crops':
        return <Crops />
      case 'weather':
        return <Dashboard />
      case 'analytics':
        return <Reports />
      case 'reports':
        return <Reports />
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <p className="text-gray-600">System settings and configuration options coming soon...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  const getViewTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      fields: 'Field Management',
      crops: 'Crop Management', 
      weather: 'Weather & Environment',
      analytics: 'Analytics',
      reports: 'Reports & Analytics',
      settings: 'Settings'
    }
    return titles[activeView as keyof typeof titles] || 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          isMobile={true}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 lg:ml-64">
          <Header
            title={getViewTitle()}
            onMenuToggle={() => setSidebarOpen(true)}
          />
          <main className="min-h-screen">
            {renderView()}
          </main>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App