import { createRootRoute, Outlet } from "@tanstack/react-router"
import Notification from "src/components/Notification"
export const Route = createRootRoute({
    component: () => {
        return (
            <>
                <Outlet />
                <Notification position="top-center" />

                {/* <TanStackRouterDevtools position="bottom-left" /> */}
                {/* <ReactQueryDevtools buttonPosition="bottom-right" /> */}
            </>
        )
    },
})
