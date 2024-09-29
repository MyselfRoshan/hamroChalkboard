import { z } from "zod";
export type RoomFormValues = {
  name: string;
};
export const RoomValidation = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .min(3, "Room name must be at least 3 characters long")
    .max(30, "Room name must be at most 15 characters long"),
});
