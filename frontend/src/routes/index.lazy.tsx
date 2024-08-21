import { createLazyFileRoute } from "@tanstack/react-router"
import Toolbar from "../components/Toolbar"
import Canvas from "src/components/Canvas"
import ClrPicker from "src/components/Colorpicker"
// import { ColorPicker, useColor } from "react-color-palette"
export const Route = createLazyFileRoute("/")({
    component: () => {
        // const [color, setColor] = useColor("rgb(86 30 203)")
        return (
            <>
                <Canvas boardId="1" />
                {/* <ColorPicker color={color} onChange={setColor} /> */}
            </>
        )
    },
})
