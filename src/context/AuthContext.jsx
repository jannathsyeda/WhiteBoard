import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('collabUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('collabUser')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    const userWithId = {
      ...userData,
      id: Date.now().toString(),
      loginTime: new Date().toISOString()
    }
    setUser(userWithId)
    localStorage.setItem('collabUser', JSON.stringify(userWithId))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('collabUser')
  }

  const updateUser = (updates) => {
    if (!user) return
    
    const updatedUser = {
      ...user,
      ...updates,
      lastUpdated: new Date().toISOString()
    }
    setUser(updatedUser)
    localStorage.setItem('collabUser', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
