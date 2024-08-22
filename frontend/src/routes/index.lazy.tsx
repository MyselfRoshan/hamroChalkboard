import { Color } from "@rc-component/color-picker"
import { createLazyFileRoute } from "@tanstack/react-router"
import { useRef } from "react"
import Canvas from "src/components/Canvas"
import { useWindowSize } from "src/hooks/useWindowSize"
import { CanvasMode, CanvasSetting, LayerType } from "types/canvas"
// import { ColorPicker, useColor } from "react-color-palette"

export const Route = createLazyFileRoute("/")({
    component: () => {
        const settings = useRef<CanvasSetting>({
            stroke: 3,
            color: new Color("#000"),
            mode: CanvasMode.Pan,
        })

        const size = useWindowSize()
        return (
            <>
                <Canvas boardId="1" settings={settings} size={size} />
                {/* <ColorPicker color={color} onChange={setColor} /> */}
            </>
        )
    },
})
