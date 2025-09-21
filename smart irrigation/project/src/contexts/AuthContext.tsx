import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
// import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock users for demo purposes
  const mockUsers = [
    { email: 'demo@irrigation.com', password: 'demo123', name: 'Demo User' },
    { email: 'admin@irrigation.com', password: 'admin123', name: 'Admin User' }
  ]

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('irrigation_user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setSession({ user: userData } as Session)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication
    const mockUser = mockUsers.find(u => u.email === email && u.password === password)
    if (!mockUser) {
      throw new Error('Invalid email or password')
    }
    
    const userData = {
      id: Date.now().toString(),
      email: mockUser.email,
      user_metadata: { name: mockUser.name },
      created_at: new Date().toISOString()
    } as User
    
    setUser(userData)
    setSession({ user: userData } as Session)
    localStorage.setItem('irrigation_user', JSON.stringify(userData))
  }

  const signUp = async (email: string, password: string, name: string) => {
    // Mock sign up - check if user already exists
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      throw new Error('User already exists')
    }
    
    const userData = {
      id: Date.now().toString(),
      email: email,
      user_metadata: { name: name },
      created_at: new Date().toISOString()
    } as User
    
    // Add to mock users for future logins
    mockUsers.push({ email, password, name })
    
    setUser(userData)
    setSession({ user: userData } as Session)
    localStorage.setItem('irrigation_user', JSON.stringify(userData))
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
    localStorage.removeItem('irrigation_user')
  }

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}