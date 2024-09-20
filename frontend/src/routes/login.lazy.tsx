import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/login")({
  component: () => <LoginPage />,
});

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
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="grid min-h-screen place-items-center bg-background p-4 text-foreground">
      <div className="bg-login-image flex w-full flex-col overflow-hidden rounded-lg shadow-xl sm:max-w-4xl md:flex-row">
        {/* Right side - Background */}
        <div className="relative hidden w-full md:block md:w-1/2">
          <div className="absolute inset-0 flex items-center justify-center bg-primary/15">
            {/* <ChalkboardIcon className="h-24 w-24 text-primary-foreground" /> */}
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex w-full flex-col justify-center bg-card/30 p-8 backdrop-blur-[3rem] md:w-1/2">
          <Card className="border-none bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-white">
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white" htmlFor="email">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="example@mail.com" />
              </div>
              <div className="space-y-2">
                <Label className="text-white" htmlFor="password">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
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
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="remember"
                  className="flex items-center space-x-2 text-white"
                >
                  <Checkbox id="remember" />
                  <span className="text-sm">Remember me</span>
                </Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </CardFooter>
          </Card>
          <p className="mt-4 text-center text-sm text-white">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
