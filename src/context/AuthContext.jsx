import { createContext, useCallback, useContext, useState } from 'react'
import { load, save } from '../lib/storage.js'

const USERS_KEY = 'sp_users'
const SESSION_KEY = 'sp_session'

const AuthContext = createContext(null)

// Lightweight hash for this local-only demo (not cryptographically secure).
const hashPassword = (pw) => {
  let h = 5381
  const s = `melodify:${pw}`
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => load(SESSION_KEY, null))
  const [authModal, setAuthModal] = useState(null) // null | 'signup' | 'login'

  const signup = useCallback(({ name, email, password }) => {
    const users = load(USERS_KEY, [])
    const cleanEmail = email.trim().toLowerCase()
    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error('An account with this email already exists. Try logging in.')
    }
    const newUser = {
      id: `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      email: cleanEmail,
      pass: hashPassword(password),
    }
    save(USERS_KEY, [...users, newUser])
    const session = { id: newUser.id, name: newUser.name, email: newUser.email }
    save(SESSION_KEY, session)
    setUser(session)
    setAuthModal(null)
  }, [])

  const login = useCallback(({ email, password }) => {
    const users = load(USERS_KEY, [])
    const found = users.find((u) => u.email === email.trim().toLowerCase())
    if (!found || found.pass !== hashPassword(password)) {
      throw new Error('Incorrect email or password.')
    }
    const session = { id: found.id, name: found.name, email: found.email }
    save(SESSION_KEY, session)
    setUser(session)
    setAuthModal(null)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  const openAuth = useCallback((mode = 'signup') => setAuthModal(mode), [])
  const closeAuth = useCallback(() => setAuthModal(null), [])

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, authModal, openAuth, closeAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
