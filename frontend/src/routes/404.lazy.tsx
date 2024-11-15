import { createLazyFileRoute } from "@tanstack/react-router"
import NotFound from "src/components/NotFound"

export const Route = createLazyFileRoute("/404")({
    component: () => <NotFound />,
})
