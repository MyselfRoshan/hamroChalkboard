import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Button } from "components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"
import { Input } from "components/ui/input"
import { ArrowRight, Clock, Pencil, Send, Trash, Users } from "lucide-react"
import { useState } from "react"

export type Room = {
    id: number
    name: string
    participants: {
        id: number
        name: string
        avatar: string
    }[]
    createdAt: string
    createdBy: number

}
export type RoomCardProps = {
    room: Room
    isCreator?: boolean
    setRooms: React.Dispatch<React.SetStateAction<any>>
}
// Helper function to generate random pastel colors
const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, 70%, 80%)`
}
export function RoomCard({ room, isCreator = false, setRooms }: RoomCardProps) {
    const [inviteEmail, setInviteEmail] = useState("")
    const handleUpdateRoom = (roomId: number, newName: string) => {
        setRooms((prevRooms: Room[]) => prevRooms.map(room =>
            room.id === roomId ? { ...room, name: newName } : room
        ))
    }

    const handleDeleteRoom = (roomId: number) => {
        setRooms((prevRooms: Room[]) => prevRooms.filter(room => room.id !== roomId))
    }

    const handleSendInvite = (roomId: number) => {
        console.log(`Inviting ${inviteEmail} to room ${roomId}`)
        setInviteEmail("")
    }

    const handleLogout = () => {
        console.log("Logging out...")
    }


    return (
        <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{room.name}</span>
                    {isCreator && (
                        <div>
                            <Button variant="ghost" size="sm" onClick={() => handleUpdateRoom(room.id, prompt("Enter new room name") || room.name)}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteRoom(room.id)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardTitle>
                <CardDescription>
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="mr-4">{room.participants.length} participants</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex -space-x-2 overflow-hidden mb-4">
                    {room.participants.slice(0, 5).map((participant) => (
                        <Avatar key={participant.id} className="inline-block border-2 border-background font-bold text-lg w-12 h-12" style={{ backgroundColor: getRandomPastelColor() }}>
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    ))}
                    {room.participants.length > 5 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-medium border-2 border-background">
                            +{room.participants.length - 5}
                        </div>
                    )}
                </div>
                <div className="flex space-x-2">
                    <Input
                        placeholder="Enter email to invite"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-grow"
                    />
                    <Button onClick={() => handleSendInvite(room.id)}>
                        <Send className="h-4 w-4 mr-2" /> Invite
                    </Button>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    Join <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}