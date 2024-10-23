import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "src/auth";
import { ROOM_URL } from "src/utils/constants";

type ActionHandlerProps = {
  roomId: number;
  roomName: string;
  newRoomName: string;
  setNewRoomName: React.Dispatch<React.SetStateAction<string>>;
};

export default function RoomHandler({
  roomId,
  roomName,
  newRoomName,
  setNewRoomName,
}: ActionHandlerProps) {
  const { authFetch } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return authFetch(`${ROOM_URL}/${roomId}`, {
        method: "DELETE",
      });
    },
    onSuccess: async (data) => {
      if (data.status === 200) {
        const { message } = await data.json();
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        router.invalidate();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete room");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await authFetch(`${ROOM_URL}/${roomId}`, {
        method: "PATCH",
        body: data,
      });
    },
    onSuccess: async (data) => {
      if (data.status === 200) {
        const { message, name } = await data.json();
        // setNewRoomName(name);
        toast.success(
          `Room name updated from '${roomName}' to '${name}' successfully`,
        );
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        router.invalidate();
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update room name");
    },
  });

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error(error);
    }
  };

  // let newRoomName: string = "";
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    // newRoomName = formData.get("new_name") as string;
    console.log(formData.get("new_name"), roomName);
    try {
      console.log(formData);
      await updateMutation.mutateAsync(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoomName(e.target.value);
  };
  console.log(newRoomName, roomName);

  return (
    <div className="flex space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Room Name</DialogTitle>
            <DialogDescription>
              Enter a new name for the room.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <Input
              name="id"
              value={roomId}
              className="hidden"
              hidden
              readOnly
            />
            <Input
              value={newRoomName}
              onChange={handleOnChange}
              name="new_name"
              className="mt-4"
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={newRoomName === "" || newRoomName === roomName}>
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructiveHover" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
