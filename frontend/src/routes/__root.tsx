import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import Notification from "src/components/Notification"
export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Notification position="top-center" />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </>
  ),
})
