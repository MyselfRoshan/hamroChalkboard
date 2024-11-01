import { Link } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import { AlertCircle } from "lucide-react";

interface NotFoundProps {
  title?: string;
  message?: string;
}

export default function NotFound({
  title = "404 - Page Not Found",
  message = "Oops! The page you're looking for doesn't exist.",
}: NotFoundProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <AlertCircle className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="mb-2 text-4xl font-bold">{title}</h1>
      <p className="mb-8 max-w-md text-center text-xl">{message}</p>
      <Button asChild>
        <Link to="/">Go back to homepage</Link>
      </Button>
    </div>
  );
}
