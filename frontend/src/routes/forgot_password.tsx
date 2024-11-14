import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

import { useMutation } from "@tanstack/react-query";
import { z, ZodError } from "zod";

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
import { Label } from "components/ui/label";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { AUTH_URL } from "src/utils/constants";
import { sleep } from "src/utils/utils";
export const Route = createFileRoute("/forgot_password")({
  component: () => <ForgotPasswordPage />,
});

const forgotPasswordValidation = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: async (data: FormData) => {
      return await fetch(`${AUTH_URL}/forgot-password`, {
        method: "POST",
        body: data,
      });
    },
    onSuccess: async (data) => {
      if (data.status === 200) {
        toast.success("Password reset instructions sent to your email");
        await sleep(1);
        await router.navigate({ to: "/login" });
      } else {
        const { error } = await data.json();
        toast.error(error || "Failed to process your request");
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email") as string;

    try {
      await forgotPasswordValidation.parseAsync({ email });
      await mutateAsync(formData);
    } catch (error: any) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to process your request. Please try again.");
      }
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background p-4 text-foreground">
      <div className="flex w-full flex-col overflow-hidden rounded-lg bg-login-image bg-right shadow-xl sm:max-w-4xl md:flex-row">
        {/* Left side - Background */}
        <div className="relative hidden w-full md:block md:w-1/2">
          <div className="absolute inset-0 flex items-center justify-center bg-primary/15">
            {/* You can add a background image or icon here if needed */}
          </div>
        </div>

        {/* Right side - Forgot Password form */}
        <div className="flex w-full flex-col justify-center bg-card/30 p-8 backdrop-blur-[3rem] md:w-1/2">
          <Card className="border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-white">
                Enter your email address to reset your password.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3">
                <Button className="w-full" type="submit">
                  <Send className="mr-2 h-4 w-4" /> Send Reset Instructions
                </Button>
              </CardFooter>
            </form>
          </Card>
          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
