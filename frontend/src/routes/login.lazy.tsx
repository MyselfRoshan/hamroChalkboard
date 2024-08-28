import { createLazyFileRoute, Link } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/login")({
    component: () => <LoginPage />,
})

import { Button } from "components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "components/ui/card"
import { Checkbox } from "components/ui/checkbox"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useState } from "react"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className="min-h-screen bg-background text-foreground grid place-items-center p-4">
            <div className="w-full sm:max-w-4xl flex flex-col md:flex-row rounded-lg overflow-hidden shadow-xl">
                <div className="w-full md:w-1/2 relative hidden md:block">
                    {/* // src="https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1" */}
                    <img
                        src="https://images.pexels.com/photos/1573434/pexels-photo-1573434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        className="w-full h-full object-cover"
                        alt="Collaborative drawing"
                        width={600}
                        height={600}
                    />
                    <div className="absolute inset-0 bg-primary/20  flex items-center justify-center">
                        {/* <ChalkboardIcon className="h-24 w-24 text-primary-foreground" /> */}
                    </div>
                </div>

                {/* Right side - Login form */}
                <div className="w-full md:w-1/2 bg-card/30 backdrop-blur-md p-8 flex flex-col justify-center">
                    <Card className="border-none bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-primary">
                                Welcome Back
                            </CardTitle>
                            <CardDescription>
                                Enter your credentials to access your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@mail.com"
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="bg-background/50 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
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
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox id="remember" />
                                    <span className="text-sm">Remember me</span>
                                </Label>
                                <a
                                    href="#"
                                    className="text-sm text-primary hover:underline"
                                >
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
                    <p className="text-center mt-4 text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
