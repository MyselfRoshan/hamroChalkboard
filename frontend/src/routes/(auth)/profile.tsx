import { createFileRoute } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Button } from "components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "components/ui/card"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { cn } from "lib/utils"
import { CalendarDays, Clock, Key, Mail, Save, User, X } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "src/auth"
import Sidebar from "src/components/Sidebar"

export const Route = createFileRoute("/(auth)/profile")({
    component: () => <UserProfile />,
})

export default function UserProfile() {
    const { user } = useAuth()
    function changePassword(newPassword: string) {}
    function updateUser(editedUser: any) {}
    const [isEditing, setIsEditing] = useState(false)
    const [editedUser, setEditedUser] = useState(user)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedUser(user)
        setNewPassword("")
        setConfirmPassword("")
    }

    const handleSave = () => {
        try {
            updateUser(editedUser)
            if (newPassword && newPassword === confirmPassword) {
                changePassword(newPassword)
            }
            setIsEditing(false)
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error("Failed to update profile")
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setEditedUser({ ...editedUser, [e.target.name]: e.target.value })
    }
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)

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
            {/* <Card className="container mx-auto w-full max-w-3xl p-6"> */}
            <Card className="max-w-3xl p-6">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        {/* <Avatar className="h-20 w-20">
                            <AvatarImage
                                src={user.avatar}
                                alt={user.username}
                            />
                            <AvatarFallback>
                                {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar> */}
                        <Avatar className="font-bold">
                            <AvatarImage
                                src={user?.username}
                                alt={user?.username}
                            />
                            <AvatarFallback>
                                {user?.username.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                {user?.username}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                {user?.email}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="info" className="w-full">
                        <TabsList>
                            <TabsTrigger value="info">User Info</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                    <Label htmlFor="username">Username:</Label>
                                    {isEditing ? (
                                        <Input
                                            id="username"
                                            name="username"
                                            value={editedUser?.username}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span>{user?.username}</span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                    <Label htmlFor="email">Email:</Label>
                                    {isEditing ? (
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={editedUser?.email}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span>{user?.email}</span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                    <span>
                                        Joined:{" "}
                                        {new Date(
                                            // user?.createdAt,
                                            new Date(),
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <span>
                                        Last Updated:{" "}
                                        {new Date(
                                            new Date(),
                                            // user?.updatedAt,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="security">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Key className="h-5 w-5 text-muted-foreground" />
                                    <Label htmlFor="current-password">
                                        Current Password:
                                    </Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value="********"
                                        disabled
                                    />
                                </div>
                                {isEditing && (
                                    <>
                                        <div className="flex items-center space-x-2">
                                            <Key className="h-5 w-5 text-muted-foreground" />
                                            <Label htmlFor="new-password">
                                                New Password:
                                            </Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) =>
                                                    setNewPassword(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Key className="h-5 w-5 text-muted-foreground" />
                                            <Label htmlFor="confirm-password">
                                                Confirm New Password:
                                            </Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    {isEditing ? (
                        // <div className="flex w-full space-x-2">
                        <div className="flex space-x-2">
                            <Button onClick={handleSave} className="flex-1">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="flex-1"
                            >
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleEdit} className="w-full">
                            Edit Profile
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
