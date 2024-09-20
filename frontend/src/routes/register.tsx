import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Checkbox } from "components/ui/checkbox";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  RegisterFormValues,
  validationSchema as registerValidation,
} from "src/utils/validation/registerValidation";

export const Route = createFileRoute("/register")({
  component: () => <Register />,
});

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // use mutation for post, delete and update request
  // use query for get request
  const { mutateAsync } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: FormData) => {
      return await fetch("http://localhost:3333/register", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      toast.success("Registered successfully");
    },
    onError: () => {
      toast.error("Failed to register user");
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const formValues = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirm-password") as string,
    };

    try {
      await registerValidation.validate(formValues, { abortEarly: false });
      await mutateAsync(formData);
    } catch (err: any) {
      const firstError = err.inner[0];
      // outline the errored input field
      console.log(firstError.path as keyof RegisterFormValues);

      toast.error(firstError.message);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-register-image bg-contain shadow-xl md:flex-row">
        {/* Right side - Background */}
        <div className="relative hidden w-full md:block md:w-1/2">
          <div className="absolute inset-0 grid place-items-center bg-primary/20 backdrop-blur-[1px]">
            {/* <div className="absolute inset-0 bg-primary/20 flex items-center justify-center"> */}
            {/* <ChalkboardIcon className="h-24 w-24 text-primary-foreground" /> */}
          </div>
        </div>

        {/* Right side - Signup form */}
        <div className="flex w-full flex-col justify-center bg-card/30 p-8 backdrop-blur-[3.5rem] md:w-1/2">
          <Card className="border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Create an Account
              </CardTitle>
              <CardDescription className="text-white">
                Sign up to start collaborating on Hamro Chalkboard.
              </CardDescription>
            </CardHeader>
            <form onSubmit={async (e) => handleSubmit(e)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="name">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="user123"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="example@mail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="password">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="pr-10"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-[var(--input)]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="confirm-password">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10"
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-[var(--input)]"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex gap-x-2">
                  <Checkbox id="remember" name="remember" className="mt-1" />
                  <Label className="text-sm text-white" htmlFor="terms">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Button>
              </CardFooter>
            </form>
          </Card>
          <p className="mt-4 text-center text-sm text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
