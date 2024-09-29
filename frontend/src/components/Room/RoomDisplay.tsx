import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { cn } from "lib/utils";
import { ArrowRight, Clock, Pencil, Send, Trash, Users } from "lucide-react";
import { useState } from "react";
import styles from "./index.module.css";
export type Room = {
  id: number;
  name: string;
  participants: {
    id: number;
    name: string;
    avatar: string;
  }[];
  createdAt: string;
  createdBy: number;
};
export type RoomCardProps = {
  room: Room;
  isCreator?: boolean;
  setRooms: React.Dispatch<React.SetStateAction<any>>;
};
// Helper function to generate random pastel colors
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};
export function RoomDisplay({
  room,
  isCreator = false,
  setRooms,
}: RoomCardProps) {
  console.log(styles.avatarList);
  const [inviteEmail, setInviteEmail] = useState("");
  const handleUpdateRoom = (roomId: number, newName: string) => {
    setRooms((prevRooms: Room[]) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, name: newName } : room,
      ),
    );
  };
  console.log(room.name.length);
  const handleDeleteRoom = (roomId: number) => {
    setRooms((prevRooms: Room[]) =>
      prevRooms.filter((room) => room.id !== roomId),
    );
  };

  const handleSendInvite = (roomId: number) => {
    console.log(`Inviting ${inviteEmail} to room ${roomId}`);
    setInviteEmail("");
  };

  return (
    <Card className="border-primary/20 bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{room.name}</span>
          {isCreator && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleUpdateRoom(
                    room.id,
                    prompt("Enter new room name") || room.name,
                  )
                }
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteRoom(room.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span className="mr-4">
              {room.participants.length} participants
            </span>
            <Clock className="mr-1 h-4 w-4" />
            <span>{new Date(room.createdAt).toLocaleDateString()}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn(styles.avatarList)}>
          {room.participants.slice(0, 5).map((participant) => (
            <Avatar key={participant.id} className={cn(styles.avatar)}>
              <Link to="/" className={styles.avatarLink}>
                <AvatarImage
                  src={participant.avatar}
                  alt={participant.name}
                  className={styles.avatarImg}
                />
                <AvatarFallback
                  style={{ backgroundColor: getRandomPastelColor() }}
                  className="text-lg font-bold"
                >
                  {participant.name.charAt(0)}
                </AvatarFallback>
              </Link>
            </Avatar>
          ))}
          {room.participants.length > 5 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground">
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
            <Send className="mr-2 h-4 w-4" /> Invite
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Join <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
