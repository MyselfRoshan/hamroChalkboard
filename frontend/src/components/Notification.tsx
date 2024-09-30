import { Toaster } from "components/ui/sonner";

type NotificationProps = {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  expand?: boolean;
};
export default function Notification({ position, expand }: NotificationProps) {
  return <Toaster position="top-center" expand={expand} richColors />;
}
