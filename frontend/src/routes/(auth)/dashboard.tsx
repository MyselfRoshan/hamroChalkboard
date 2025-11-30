import { useQuery } from "@tanstack/react-query"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute("/(auth)/dashboard")({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({
                to: "/login",
                search: {
                    redirect: location.href,
                },
            })
        }
    },
    component: DashboardPage,
})

import { Button } from "components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "components/ui/card"
import { Input } from "components/ui/input"
import { cn } from "lib/utils"
import { ArrowRight, LayoutGrid, List } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "src/auth"
import { Room } from "src/components/Room"
import RoomCreate from "src/components/Room/RoomCreate"
import Sidebar from "src/components/Sidebar"
import { ROOM_URL } from "src/utils/constants"
// Mock user data
const currentUser = {
    id: 1,
    name: "Current User",
    avatar: "/placeholder.svg?height=32&width=32",
}

// This would typically come from your backend
const mockRooms = [
    {
        id: 1,
        name: "Brainstorming Session",
        participants: [
            {
                id: 1,
                name: "Current User",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                id: 2,
                name: "Bob",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                id: 3,
                name: "Charlie",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                id: 4,
                name: "David",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                id: 5,
                name: "Eve",
                avatar: "/placeholder.svg?height=32&width=32",
            },
        ],
        createdAt: "2023-06-15T10:00:00Z",
        createdBy: 1,
    },
    {
        id: 2,
        name: "Project Planning",
        participants: [
            {
                id: 6,
                name: "Frank",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                id: 7,
                name: "Grace",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                id: 8,
                name: "Henry",
                avatar: "/placeholder.svg?height=32&width=32",
            },
        ],
        createdAt: "2023-06-14T14:30:00Z",
        createdBy: 6,
    },
    {
        id: 3,
        name: "Design Review",
        participants: [
            {
                id: 9,
                name: "Ivy",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                id: 10,
                name: "Jack",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                id: 11,
                name: "Kate",
                avatar: "/placeholder.svg?height=32&width=32",
            },
            {
                id: 1,
                name: "Current User",
                avatar: "/placeholder.svg?height=32&width=32",
            },
        ],
        createdAt: "2023-06-13T09:15:00Z",
        createdBy: 9,
    },
]

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export default function DashboardPage() {
    const [rooms, setRooms] = useState(mockRooms)

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
    const navigate = useNavigate()

    const joinRoomRef = useRef<HTMLInputElement>(null)

    const participatingRooms = rooms.filter(
        (room) =>
            room.createdBy !== currentUser.id &&
            room.participants.some((p) => p.id === currentUser.id),
    )

    const { authFetch } = useAuth()
    // const queryClient = useQueryClient();
    const query = useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
            const data = await authFetch(ROOM_URL, { method: "GET" })
            return await data.json()
        },
    })
    const rms = query.data

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(joinRoomRef.current?.value)

        const joinRoomCode = joinRoomRef.current?.value as string
        if (!joinRoomCode.trim()) {
            toast.error("Room code is required")
            return
        }

        if (!UUID_REGEX.test(joinRoomCode)) {
            toast.error("Invalid room code format")
            return
        }
        navigate({ to: `/room/${joinRoomRef.current?.value}` })
        // if (joinRoomCode.trim()) {
        //     joinRoomMutation.mutate(joinRoomCode)
        // }
    }
    return (
        <div
            className={cn(
                "ease grid grid-cols-dashboard-opened text-foreground transition-[grid-template-columns] duration-200",
                sidebarCollapsed && "grid-cols-dashboard-closed",
            )}
        >
            <Sidebar
                isClosed={sidebarCollapsed}
                setIsClosed={setSidebarCollapsed}
            />
            {/* Main content */}
            <main className="p-8">
                <section className="mx-auto max-w-6xl space-y-8">
                    <h1 className="my-4 text-2xl font-bold text-primary">
                        Hamro Chalkboard
                    </h1>
                    <RoomCreate />
                    <Card className="border-primary/20 bg-card/30">
                        <CardHeader>
                            <CardTitle>Join a New Room</CardTitle>
                            <CardDescription>
                                Start joining room by entering room code
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Enter room code"
                                ref={joinRoomRef}
                                // value={joinRoomCode}
                                // onChange={(e) => setJoinRoomCode(e.target.value)}
                                className="flex-grow"
                            />
                            <Button onClick={handleJoinRoom}>
                                {/* {joinRoomMutation.isPending ? "Joining..." : "Join Room"} */}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Your Rooms</h2>
                        <div className="flex space-x-2">
                            <Button
                                variant={
                                    viewMode === "grid" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setViewMode("grid")}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === "list" ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* <Tabs defaultValue="created">
                        <TabsList>
                            <TabsTrigger value="created">
                                Created by You
                            </TabsTrigger>
                            <TabsTrigger value="participating">
                                Participating
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="created">
                            <ScrollArea className="h-[calc(100vh-300px)]"> */}
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 gap-4 md:grid-cols-2"
                                : // ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                                  "space-y-4"
                        }
                    >
                        {rms !== undefined &&
                            rms?.rooms &&
                            rms?.rooms.map((room: Room) => (
                                <Room
                                    key={room.id}
                                    room={room}
                                    isCreator={true}
                                    setRooms={setRooms}
                                />
                            ))}
                    </div>
                    {/* </ScrollArea>
                        </TabsContent>
                        <TabsContent value="participating">
                            <ScrollArea className="h-[calc(100vh-300px)]">
                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 gap-4 md:grid-cols-2"
                                            : // ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                                              "space-y-4"
                                    }
                                >
                                    {rms !== undefined &&
                                        rms?.rooms &&
                                        rms?.rooms.map((room: Room) => (
                                            <Room
                                                key={room.id}
                                                room={room}
                                                isCreator={true}
                                                setRooms={setRooms}
                                            />
                                        ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs> */}
                </section>
            </main>
        </div>
    )
}
