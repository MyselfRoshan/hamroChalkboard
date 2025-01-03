import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import ReactDOM from "react-dom/client"
// Import the generated route tree
import { StrictMode } from "react"
import { AuthProvider, useAuth } from "./auth.tsx"
import "./index.css"
import { routeTree } from "./routeTree.gen"
// Create a new router instance
const queryClient = new QueryClient()
const router = createRouter({
    routeTree,
    context: {
        queryClient,
        auth: undefined!,
    },
    defaultPreload: "intent",
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    // visit https://tanstack.com/router/latest/docs/framework/react/examples/basic-react-query-file-based for more info
    defaultStaleTime: 0,
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
    interface Register {
        router: typeof router
    }
}
// Create the app with JWT auth
function App() {
    const auth = useAuth()
    return <RouterProvider router={router} context={{ auth }} />
}

// Render the app
const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    // console.log(import.meta.env.PUBLIC_API_PREFIX)
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </QueryClientProvider>
        </StrictMode>,
    )
}
