import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"
import { toast } from "sonner"
import { TOKEN_URL } from "./utils/constants"
export enum Role {
    USER = 0,
    ADMIN = 1,
}
export type User = {
    exp: number
    username: string
    email: string
    role: Role
}
export type AuthContext = {
    isAuthenticated: boolean
    login: ({
        token,
        payload,
    }: {
        token: string
        payload: User
    }) => Promise<void>
    logout: () => Promise<void>
    user: User | null
    authFetch: Fetch
    token: string | null
}
export type Fetch = (
    endPoint: RequestInfo | URL,
    config: RequestInit,
) => Promise<Response>
const AuthContext = createContext<AuthContext | null>(null)
const tokenKey = "auth.token"
const userKey = "auth.user"

function store(key: string, value: string | User | null) {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value))
    } else {
        localStorage.removeItem(key)
    }
}

const getFromStore = (key: string) => JSON.parse(localStorage.getItem(key)!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => getFromStore(userKey))
    let isAuthenticated = !!user

    const login = useCallback(
        async ({ token, payload }: { token: string; payload: User }) => {
            // console.log(token, payload);
            store(tokenKey, token)
            store(userKey, payload)
            setUser(payload)
        },
        [],
    )

    const logout = useCallback(async () => {
        store(tokenKey, null)
        store(userKey, null)
        setUser(null)
    }, [])

    const authFetch: Fetch = async (endPoint, config) => {
        const headers = new Headers(config.headers || {})
        const token = getFromStore(tokenKey)
        if (!token) {
            logout()
            throw new Error("No token found in local storage")
        }

        headers.set("Authorization", `Bearer ${token}`)

        try {
            const response = await window.fetch(endPoint, {
                ...config,
                headers,
            })

            if (!response) {
                logout()
                throw new Error("Failed to fetch data")
            }

            if (response.status === 401) {
                // Refresh token
                const params = user ? `?username=${user!.username}` : ""
                const refreshTokenResponse = await window.fetch(
                    `${TOKEN_URL}${params}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )

                if (refreshTokenResponse.status === 201) {
                    const data = await refreshTokenResponse.json()
                    await login(data)

                    // Retry original request with new token
                    return window.fetch(endPoint, {
                        ...config,
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${data.token}`,
                        },
                    })
                } else {
                    logout()
                    throw new Error("Failed to refresh token")
                }
            }

            return response
        } catch (error) {
            console.error("Error fetching data:", error)
            logout()
            throw error
        }
    }

    // const authFetch: Fetch = async (endPoint, config) => {
    //     return fetchAPIRequestInterceptor(endPoint, config)
    // }

    useEffect(() => {
        const params = user ? `?username=${user!.username}` : ""

        if (!getFromStore(tokenKey)) {
            return
        }

        const tokenValid = async () => {
            try {
                const response = await window.fetch(`${TOKEN_URL}${params}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${getFromStore(tokenKey)}`,
                    },
                })
                // console.log(response);
                if (response.status === 200) {
                    setUser(getFromStore(userKey))
                }

                if (response.status === 401) {
                    const { error } = await response.json()
                    toast.error(error)
                    store(tokenKey, null)
                    store(userKey, null)
                    return
                }

                if (response.status === 500) {
                    const { error } = await response.json()
                    toast.error(error)
                    logout()
                    return
                }

                if (response.status === 201) {
                    const data = await response.json()
                    await login(data)
                }
            } catch (error) {
                console.error("Error fetching data:", error)
                logout()
            }
        }
        tokenValid()
    }, [])
    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                token: getFromStore(tokenKey),
                authFetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
