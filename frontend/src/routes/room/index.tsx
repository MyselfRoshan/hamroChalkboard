import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/room/")({
  component: () => <div>Hello /room/!</div>,
});
