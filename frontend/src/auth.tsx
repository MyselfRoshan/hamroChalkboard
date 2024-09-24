import { jwtDecode } from 'jwt-decode'
import { createContext, useCallback, useContext, useState } from 'react'
import { sleep } from './utils/utils'
export enum Role {
    USER = 0,
    ADMIN = 1
}
export type User = {
    exp: number
    username: string
    role: Role
}
export type AuthContext = {
    isAuthenticated: boolean
    login: (token: string) => Promise<void>
    logout: () => Promise<void>
    user: User | null,
    fetch: Fetch
}
export type Fetch = (endPoint: RequestInfo | URL, config: RequestInit) => Promise<Response>
const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<User | null>(null)
    // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)

    const login = useCallback(async (token: string) => {
        await sleep(500)

        setToken(token)
        setUser(jwtDecode<User>(token))
        setIsAuthenticated(true)
    }, [])

    const logout = useCallback(async () => {
        await sleep(250)

        setToken(null)
        setIsAuthenticated(false)
    }, [])

    const fetchAPIRequestInterceptor: Fetch = async (endPoint, config) => {
        const headers = new Headers(config.headers)
        headers.set('Authorization', `Bearer ${token}`)
        config.headers = headers
        config.method = 'GET'

        try {
            const response = await window.fetch(endPoint, config)
            // https://www.youtube.com/watch?v=AcYF18oGn6Y
            // console.log("before refresh_token")
            if (response.status === 401 && response.statusText === "Unauthorized") {
                // Refresh token
                const refreshTokenResponse = await window.fetch('http://localhost:3333/refresh-token', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,

                    },
                    credentials: 'include'

                })
                console.log(refreshTokenResponse)
                // console.log("inside refresh_token")
                if (refreshTokenResponse.ok) {
                    const newToken = await refreshTokenResponse.json()
                    console.log(newToken)

                    setToken(newToken)
                    // Retry the original request with the new token
                    return window.fetch(endPoint, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    })
                } else {
                    // setToken(null)
                    throw new Error('Failed to refresh token')
                }
            }
            return response
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    }

    const fetch: Fetch = async (endPoint, config) => {
        return fetchAPIRequestInterceptor(endPoint, config)
        // if (isAuthenticated) {
        //     return fetchAPIRequestInterceptor(endPoint, config)
        // } else {
        //     return window.fetch(endPoint, config)
        // }
    }

    // useLayoutEffect(() => {
    //     if (token) {
    //         fetch("http://localhost:3333/refresh_token", {

    //         })
    //         setIsAuthenticated(true)
    //     }
    // }, [token])

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, fetch }}>
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