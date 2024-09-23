import * as React from "react"

import { jwtDecode } from "jwt-decode"
import { sleep } from "./utils/utils"

export type AuthContext = {
  isAuthenticated: boolean
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
  user: User | null
}
export enum Role {
  USER = 0,
  ADMIN = 1
}

const AuthContext = React.createContext<AuthContext | null>(null)

const key = "auth.user"

function getStoredUser() {
  const user = localStorage.getItem(key)
  return user ? jwtDecode<User>(user) : null
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user)
  } else {
    localStorage.removeItem(key)
  }
}

type User = {
  exp: number
  username: string
  role: Role
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(getStoredUser())
  const isAuthenticated = !!user

  const logout = React.useCallback(async () => {
    await sleep(250)

    setStoredUser(null)
    setUser(null)
  }, [])

  const login = React.useCallback(async (token: string) => {
    await sleep(500)

    setStoredUser(token)
    setUser(jwtDecode<User>(token))
  }, [])

  React.useEffect(() => {
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
