// utility/hooks/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'

// Create the context
const AuthContext = createContext()

// Provider component to wrap the app and provide state
export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null)

  // Check user role on initial load
  useEffect(() => {
    const role = localStorage.getItem("ISLOGIN")
    setUserRole(role)
  }, [])

  // Update the role and localStorage
  const updateUserRole = (role) => {
    setUserRole(role)
    localStorage.setItem("ISLOGIN", role)
  }

  return (
    <AuthContext.Provider value={{ userRole, updateUserRole }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext)
}
