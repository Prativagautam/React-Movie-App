import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('loggedInUser')) || null } catch { return null }
  })

  // modal control
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'

  useEffect(() => {
    if (user) localStorage.setItem('loggedInUser', JSON.stringify(user))
    else localStorage.removeItem('loggedInUser')
  }, [user])

  const login = (userObj) => setUser(userObj)
  const signup = (userObj) => setUser(userObj)
  const logout = () => setUser(null)

  const openAuth = (mode = 'login') => { setAuthMode(mode); setAuthModalOpen(true) }
  const closeAuth = () => setAuthModalOpen(false)

return (
  <AuthContext.Provider
    value={{
      user,
      login,
      signup,
      logout,
      authModalOpen,
      authMode,
      openAuth,
      closeAuth,
      setAuthMode, 
    }}
  >
    {children}
  </AuthContext.Provider>
)
}
export const useAuth = () => useContext(AuthContext)
