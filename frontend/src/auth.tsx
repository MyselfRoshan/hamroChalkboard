import { jwtDecode } from 'jwt-decode'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
export enum Role {
    USER = 0,
    ADMIN = 1
}
export type User = {
    exp: number
    username: string
    email: string
    role: Role
}
export type AuthContext = {
    isAuthenticated: boolean
    login: (token: string) => Promise<void>
    logout: () => Promise<void>
    user: User | null,
    authFetch: Fetch
}
export type Fetch = (endPoint: RequestInfo | URL, config: RequestInit) => Promise<Response>
const AuthContext = createContext<AuthContext | null>(null)
const key = "auth.user"

function getStoredUser() {
    const user = localStorage.getItem(key)
    return user ? jwtDecode<User>(user) : null
}

function setStoredToken(user: string | null) {
    if (user) {
        localStorage.setItem(key, user)
    } else {
        localStorage.removeItem(key)
    }
}
const getStoredToken = () => localStorage.getItem(key)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(getStoredUser())
    const isAuthenticated = !!user

    const login = useCallback(async (token: string) => {
        setStoredToken(token)
        setUser(jwtDecode<User>(token))
    }, [])

    const logout = useCallback(async () => {
        setStoredToken(null)
        setUser(null)
    }, [])

    // https://www.youtube.com/watch?v=AcYF18oGn6Y
    const fetchAPIRequestInterceptor: Fetch = async (endPoint, config) => {
        const headers = new Headers(config.headers || {})
        headers.set('Authorization', `Bearer ${getStoredToken()}`)
        config.headers = headers

        try {
            const response = await window.fetch(endPoint, config)

            if (response.status === 401) {
                // Refresh token
                const refreshTokenResponse = await window.fetch(`http://localhost:3333/access-token?username=${getStoredUser()!.username}`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${getStoredToken()}`,
                    },
                })

                if (refreshTokenResponse.ok) {
                    const { access_token } = await refreshTokenResponse.json()
                    await login(access_token) // Log in with new token

                    // Retry original request with new token
                    return window.fetch(endPoint, {
                        ...config,
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${access_token}`,
                        },
                    })
                } else {
                    logout()
                    throw new Error('Failed to refresh token')
                }
            }

            return response
        } catch (error) {
            logout()
            // console.error('Error fetching data:', error)
            throw error
        }
    }

    const authFetch: Fetch = async (endPoint, config) => {
        return fetchAPIRequestInterceptor(endPoint, config)
    }

    useEffect(
        () => {
            const storedUser = getStoredUser()
            if (storedUser) {
                setUser(storedUser)

                const tokenValid = async () => {
                    try {
                        const response = await window.fetch(`http://localhost:3333/access-token?username=${storedUser.username}`, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${getStoredToken()}`,
                            },
                        })
                        console.log(response)
                        if (response.status === 401) {
                            const { error } = await response.json()
                            toast.error(error)
                            logout()
                            return
                        }

                        if (response.status === 201) {
                            const { access_token } = await response.json()
                            console.log(access_token)

                            await login(access_token)
                        }

                    } catch (error) {
                        logout()
                    }
                }
                tokenValid()
            }
        }, [login, logout]
    )
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, authFetch }}>
            {children}
        </AuthContext.Provider>
    )
}

// export { AuthContext, AuthProvider }
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}