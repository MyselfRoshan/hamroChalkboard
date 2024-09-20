import { createLazyFileRoute } from "@tanstack/react-router"
import { useRef } from "react"
import Canvas from "src/components/Canvas"
import { HistoryProvider } from "src/hooks/useHistory"
import { useWindowSize } from "src/hooks/useWindowSize"
import { CanvasMode, CanvasSetting } from "types/canvas"
// import { ColorPicker, useColor } from "react-color-palette"

export const Route = createLazyFileRoute("/draw")({
    component: () => {
        const settings = useRef<CanvasSetting>({
            stroke: 6,
            color: "#000",
            mode: CanvasMode.None,
        })

        const size = useWindowSize()

        return (
            <div className="grid">
                {/* <Component /> */}
                <HistoryProvider>
                    <Canvas boardId="board" settings={settings} size={size} />
                </HistoryProvider>
                {/* <CanvasT width={size.width} height={size.height} /> */}
                {/* <ColorPicker color={color} onChange={setColor} /> */}
            </div>
        )
    },
})
