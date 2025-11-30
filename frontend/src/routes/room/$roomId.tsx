import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useRef } from "react"
import { useAuth } from "src/auth"
import Canvas from "src/components/Canvas"
import Loading from "src/components/Loading"
import NotFound from "src/components/NotFound"
import { HistoryProvider } from "src/hooks/useHistory"
import { useWindowSize } from "src/hooks/useWindowSize"
import { ROOM_URL } from "src/utils/constants"
import { CanvasMode, CanvasSetting } from "types/canvas"
export const Route = createFileRoute("/room/$roomId")({
    notFoundComponent: () => (
        <NotFound
            title="404 - Room Not Found"
            message="Oops! The room you're looking for doesn't exist."
            redirect="/dashboard"
        />
    ),

    component: () => {
        const { roomId } = Route.useParams()
        const { authFetch, user } = useAuth()

        const { isError, error, isPending, data } = useQuery({
            queryKey: ["roomexists", roomId],
            queryFn: async () => {
                if (!roomId) throw new Error("Room ID is null")
                const response = await authFetch(
                    `${ROOM_URL}/exists/${roomId}`,
                    {
                        method: "GET",
                    },
                )

                // Check for a 404 response
                if (!response.ok) {
                    throw new Error("Room not found")
                }

                return await response.json()
            },
        })

        const size = useWindowSize()

        const settings = useRef<CanvasSetting>({
            stroke: 6,
            color: "#000",
            mode: CanvasMode.None,
            rdpEpsilon: 5
        })

        if (isError) {
            return (
                <NotFound
                    title="404 - Room Not Found"
                    message="Oops! The room you're looking for doesn't exist."
                />
            )
        }

        if (isPending) {
            return <Loading text={`Joining room ${roomId}`} />
        }
        // console.log(user?.username);

        return (
            <section className="grid">
                {/* <Component /> */}
                <HistoryProvider roomId={roomId}>
                    <Canvas settings={settings} size={size} roomId={roomId} />
                </HistoryProvider>
                {/* <CanvasT width={size.width} height={size.height} /> */}
                {/* <ColorPicker color={color} onChange={setColor} /> */}
            </section>
        )
    },
})
