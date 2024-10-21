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
import { ArrowRight, Clock, Send, Users } from "lucide-react";
import { useState } from "react";
import { timeAgo } from "src/utils/utils";
import styles from "./index.module.css";
import RoomHandler from "./RoomHandler";
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
  const [inviteEmail, setInviteEmail] = useState("");
  const [newRoomName, setNewRoomName] = useState<string>(room.name);

  // const { authFetch } = useAuth();
  // const queryClient = useQueryClient();
  // const deleteRoomMutation = useMutation({
  //   mutationFn: async (roomId: number) => {
  //     const response = await authFetch(`${ROOM_URL}/${roomId}`, {
  //       method: "DELETE",
  //     });
  //     console.log(response);
  //     return await response.json();
  //   },
  //   onSuccess: async (data) => {
  //     queryClient.invalidateQueries({ queryKey: ["rooms"] });
  //     // const { message } = await data.json();
  //     console.log(data);
  //     console.log(data);

  //     toast.success(data.message);
  //   },

  //   onError: async (err) => {
  //     console.log(err);
  //     toast.error("Failed to delete room");
  //     return;
  //   },
  // });

  // const updateRoomMutation = useMutation({
  //   mutationFn: async ({
  //     roomId,
  //     newName,
  //   }: {
  //     roomId: number;
  //     newName: string;
  //   }) => {
  //     const response = await authFetch(`${ROOM_URL}/${roomId}`, {
  //       method: "PATCH",
  //       body: newName,
  //     });
  //     console.log(response);
  //     return await response.json();
  //   },
  //   onSuccess: async (data) => {
  //     queryClient.invalidateQueries({ queryKey: ["rooms"] });
  //     // const { message } = await data.json();
  //     console.log(data);
  //     console.log(data);

  //     toast.success(data.message);
  //   },

  //   onError: async (err) => {
  //     console.log(err);
  //     toast.error("Failed to update room");
  //     return;
  //   },
  // });

  // const handleUpdateRoom = (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //   newName: string,
  // ) => {
  //   e.preventDefault();
  //   try {
  //     updateRoomMutation.mutateAsync({ roomId: room.id, newName });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // const handleDelete = async (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  // ) => {
  //   e.preventDefault();
  //   try {
  //     await deleteRoomMutation.mutateAsync(room.id);
  //   } catch (error) {}
  //   // setRooms((prevRooms: Room[]) =>
  //   //   prevRooms.filter((room) => room.id !== roomId),
  //   // );
  // };

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
            <RoomHandler roomId={room.id} setNewRoomName={setNewRoomName} />
          )}
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
