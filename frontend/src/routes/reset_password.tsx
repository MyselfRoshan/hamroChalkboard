import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
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
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AUTH_URL } from "src/utils/constants";
import { sleep } from "src/utils/utils";

const resetPasswordValidation = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const Route = createFileRoute("/reset_password")({
  component: () => <ResetPasswordPage />,
  //   validateSearch: z.object({
  //     token: z.string(),
  //   }),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const search = Route.useSearch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync } = useMutation({
    mutationKey: ["resetPassword"],
    mutationFn: async (data: FormData) => {
      return await fetch(`${AUTH_URL}/reset-password`, {
        method: "POST",
        body: data,
      });
    },
    onSuccess: async (data) => {
      if (data.status === 200) {
        toast.success("Password reset successfully");
        await sleep(1);
        await router.navigate({ to: "/login" });
      } else {
        const { error } = await data.json();
        toast.error(error || "Failed to reset password");
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("token", search.token);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {
      await resetPasswordValidation.parseAsync({ password, confirmPassword });
      await mutateAsync(formData);
    } catch (error: any) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background p-4 text-foreground">
      <div className="bg-reset-password-image flex w-full flex-col overflow-hidden rounded-lg bg-right shadow-xl sm:max-w-4xl md:flex-row">
        {/* Left side - Background */}
        <div className="relative hidden w-full md:block md:w-1/2">
          <div className="absolute inset-0 flex items-center justify-center bg-primary/15">
            {/* You can add a background image or icon here if needed */}
          </div>
        </div>

        {/* Right side - Reset Password form */}
        <div className="flex w-full flex-col justify-center bg-card/30 p-8 backdrop-blur-[3rem] md:w-1/2">
          <Card className="border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Reset Password
              </CardTitle>
              <CardDescription className="text-white">
                Enter your new password to reset your account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="password">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-yellow-950/60 hover:text-yellow-950"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="confirmPassword">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-yellow-950/60 hover:text-yellow-950"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-3">
                <Button className="w-full" type="submit">
                  <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
