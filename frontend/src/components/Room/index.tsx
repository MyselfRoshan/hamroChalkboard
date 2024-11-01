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
import { cn } from "lib/utils";
import { ArrowRight, Clock, Users } from "lucide-react";
import { useState } from "react";
import { timeAgo } from "src/utils/utils";
import styles from "./index.module.css";
import RoomDelete from "./RoomDelete";
import RoomShare from "./RoomShare";
import RoomUpdate from "./RoomUpdate";
export type Room = {
  id: number;
  name: string;
  participants: {
    id: number;
    name: string;
    avatar: string;
  }[];
  created_at: string;
  creator: {
    id: number;
    name: string;
    avatar: string;
  };
};
export type RoomCardProps = {
  room: Room;
  isCreator?: boolean;
  // setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  setRooms: React.Dispatch<React.SetStateAction<any>>;
};
// Helper function to generate random pastel colors
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

export function Room({ room, isCreator = false, setRooms }: RoomCardProps) {
  const [newRoomName, setNewRoomName] = useState<string>(room.name);

  return (
    <Card className="grid border-primary/20 bg-background/50">
      <CardHeader>
        <CardTitle className="break-words">
          {isCreator && (
            <div className="flex justify-end gap-2">
              <RoomUpdate
                roomId={room.id}
                roomName={room.name}
                newRoomName={newRoomName}
                setNewRoomName={setNewRoomName}
              />
              <RoomDelete roomId={room.id} />
              <RoomShare roomId={room.id} />
            </div>
          )}
          {room.name}
        </CardTitle>
        <CardDescription>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span className="mr-4">
              {room.participants ? room.participants.length : 0} participants
            </span>
            <Clock className="mr-1 h-4 w-4" />
            <span>{timeAgo(room.created_at)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn(styles.avatarList)}>
          {room.participants &&
            room.participants.slice(0, 5).map((participant) => (
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
          {room.participants && room.participants.length > 5 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground">
              +{room.participants.length - 5}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="self-end">
        <Button asChild className="mt-auto w-full">
          <Link to={`/room/${room.id}`}>
            Join
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
