import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { toast } from "sonner";
import { useAuth } from "src/auth";
import { ROOM_URL } from "src/utils/constants";
import { RoomValidation as roomValidation } from "src/utils/validation/roomValidation";

export default function RoomCreate() {
  const queryClient = useQueryClient();
  const { authFetch } = useAuth();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await authFetch(ROOM_URL, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      const { message } = await data.json();
      toast.success(message);
    },

    onError: async (err) => {
      console.log(err);
      toast.error("Failed to create room");
      return;
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const formValues = {
      name: formData.get("name") as string,
    };

    try {
      await roomValidation.parseAsync(formValues);
      await mutateAsync(formData);
    } catch (err: any) {
      console.log(err);
      const firstError = err.errors[0];
      toast.error(firstError.message);
    }
  };
  return (
    <Card className="border-primary/20 bg-card/30">
      <CardHeader>
        <CardTitle>Create a New Room</CardTitle>
        <CardDescription>
          Start a new collaborative drawing session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={async (e) => handleSubmit(e)} className="flex gap-2">
          <Label htmlFor="name" className="sr-only">
            Room Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter room name"
            className="bg-background/50"
          />
          <Button type="submit">
            {isPending ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
