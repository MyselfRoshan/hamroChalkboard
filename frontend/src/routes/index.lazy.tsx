import { createLazyFileRoute } from "@tanstack/react-router"
import Toolbar from "../components/Toolbar"
import Canvas from "src/components/Canvas"
import TextCanvas from "src/components/TextCanvas"

export const Route = createLazyFileRoute("/")({
    component: () => (
        <>
            {/* <Canvas boardId="1" /> */}

            {/* <Toolbar /> */}
            {/* <TextCanvas /> */}
            <Canvas boardId="1" />
        </>
    ),
})
