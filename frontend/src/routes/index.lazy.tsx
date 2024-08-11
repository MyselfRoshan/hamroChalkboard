import { createLazyFileRoute } from "@tanstack/react-router"
import Toolbar from "../components/Toolbar"

export const Route = createLazyFileRoute("/")({
    component: () => (
        <main>
            <Toolbar />
        </main>
    ),
})
