import { createFileRoute, redirect } from "@tanstack/react-router"

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

import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Button } from "components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "components/ui/dropdown-menu"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { ScrollArea } from "components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { cn } from "lib/utils"
import { LayoutGrid, List, Menu, Settings, Users } from "lucide-react"
import React, { useState } from "react"
import FlexibleButton from "src/components/FlexibleButton"
import Logout from "src/components/Logout"
import { RoomCard } from "src/components/Room/RoomCard"

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
            { id: 2, name: "Bob", avatar: "/placeholder.svg?height=32&width=32" },
            { id: 3, name: "Charlie", avatar: "/placeholder.svg?height=32&width=32" },
            { id: 4, name: "David", avatar: "/placeholder.svg?height=32&width=32" },
            { id: 5, name: "Eve", avatar: "/placeholder.svg?height=32&width=32" },
        ],
        createdAt: "2023-06-15T10:00:00Z",
        createdBy: 1,
    },
    {
        id: 2,
        name: "Project Planning",
        participants: [
            { id: 6, name: "Frank", avatar: "/placeholder.svg?height=32&width=32" },
            { id: 7, name: "Grace", avatar: "/placeholder.svg?height=32&width=32" },
            { id: 8, name: "Henry", avatar: "/placeholder.svg?height=32&width=32" },
        ],
        createdAt: "2023-06-14T14:30:00Z",
        createdBy: 6,
    },
    {
        id: 3,
        name: "Design Review",
        participants: [
            { id: 9, name: "Ivy", avatar: "/placeholder.svg?height=32&width=32" },
            { id: 10, name: "Jack", avatar: "/placeholder.svg?height=32&width=32" },
            { id: 11, name: "Kate", avatar: "/placeholder.svg?height=32&width=32" },
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

export default function DashboardPage() {
    const [rooms, setRooms] = useState(mockRooms)
    const [newRoomName, setNewRoomName] = useState("")

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault()
        if (newRoomName.trim()) {
            const newRoom = {
                id: rooms.length + 1,
                name: newRoomName.trim(),
                participants: [currentUser],
                createdAt: new Date().toISOString(),
                createdBy: currentUser.id,
            }
            setRooms([newRoom, ...rooms])
            setNewRoomName("")
        }
    }

    const createdRooms = rooms.filter(
        (room) => room.createdBy === currentUser.id,
    )
    const participatingRooms = rooms.filter(
        (room) =>
            room.createdBy !== currentUser.id &&
            room.participants.some((p) => p.id === currentUser.id),
    )

    return (
        // <div className={cn(" bg-background text-foreground grid grid-cols-dashboard-opened", sidebarCollapsed && "grid-cols-dashboard-closed")}>
        <div
            className={cn(
                "grid-cols-dashboard-opened grid text-foreground",
                sidebarCollapsed && "grid-cols-dashboard-closed",
            )}
        >
            {/* Sidebar */}
            <aside className="bg-dashboard-image grid-rows-side-bar sticky top-0 grid h-screen items-start gap-8 border-r border-primary/20 bg-card/30 bg-cover bg-[center] bg-no-repeat p-4 backdrop-blur-md transition-all duration-300 ease-in-out">
                {/* <ToolButton className={cn("flex mx-0", sidebarCollapsed && "mx-auto")} label='menu' icon={Menu} onClick={() => setSidebarCollapsed(prev => !prev)} /> */}
                <FlexibleButton
                    className={cn("mx-0 flex", sidebarCollapsed && "mx-auto")}
                    label="Menu"
                    icon={Menu}
                    onClick={() => setSidebarCollapsed((prev) => !prev)}
                />
                <nav
                    className={cn(
                        "mb-auto flex flex-col gap-3",
                        sidebarCollapsed && "items-center",
                    )}
                >
                    <FlexibleButton
                        label="Dashboard"
                        icon={LayoutGrid}
                        onClick={() => { }}
                        isSidebar={true}
                        sidebarCollapsed={sidebarCollapsed}
                    />
                    <FlexibleButton
                        label="My Rooms"
                        icon={Users}
                        onClick={() => { }}
                        isSidebar={true}
                        sidebarCollapsed={sidebarCollapsed}
                    />
                    <FlexibleButton
                        label="Settings"
                        icon={Settings}
                        onClick={() => { }}
                        isSidebar={true}
                        sidebarCollapsed={sidebarCollapsed}
                    />
                    {/* <SidebarItem icon={LayoutGrid} label="Dashboard" onClick={() => { }} />
                    <SidebarItem icon={Users} label="My Rooms" onClick={() => { }} />
                    <SidebarItem icon={Settings} label="Settings" onClick={() => { }} /> */}
                </nav>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className={cn(
                                "w-full self-end bg-yellow-500/20 p-2 text-black hover:bg-yellow-500/20 hover:text-yellow-800",
                                !sidebarCollapsed && "justify-start gap-4",
                            )}
                            size="auto"
                        >
                            <Avatar className="font-bold">
                                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {!sidebarCollapsed && currentUser.name}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Logout />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </aside>

            {/* Main content */}
            <main className="p-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    <h1 className="my-4 text-2xl font-bold text-primary">
                        Hamro Chalkboard
                    </h1>
                    <Card className="border-primary/20 bg-card/30 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Create a New Room</CardTitle>
                            <CardDescription>
                                Start a new collaborative drawing session
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateRoom} className="flex space-x-2">
                                <div className="flex-grow">
                                    <Label htmlFor="room-name" className="sr-only">
                                        Room Name
                                    </Label>
                                    <Input
                                        id="room-name"
                                        placeholder="Enter room name"
                                        value={newRoomName}
                                        onChange={(e) => setNewRoomName(e.target.value)}
                                        className="bg-background/50"
                                    />
                                </div>
                                <Button type="submit">Create Room</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Your Rooms</h2>
                        <div className="flex space-x-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="created">
                        <TabsList>
                            <TabsTrigger value="created">Created by You</TabsTrigger>
                            <TabsTrigger value="participating">Participating</TabsTrigger>
                        </TabsList>
                        <TabsContent value="created">
                            <ScrollArea className="h-[calc(100vh-300px)]">
                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                                            : "space-y-4"
                                    }
                                >
                                    {createdRooms.map((room) => (
                                        <RoomCard
                                            key={room.id}
                                            room={room}
                                            isCreator={true}
                                            setRooms={setRooms}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="participating">
                            <ScrollArea className="h-[calc(100vh-300px)]">
                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                                            : "space-y-4"
                                    }
                                >
                                    {participatingRooms.map((room) => (
                                        <RoomCard key={room.id} room={room} setRooms={setRooms} />
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
