import { useMutation } from "@tanstack/react-query"
import {
  createFileRoute,
  Link,
  redirect,
  useRouter
} from "@tanstack/react-router"
import { z, ZodError } from "zod"


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
import { toast } from "sonner"
import { useAuth } from "src/auth"
import { AUTH_URL } from "src/utils/constants"
import { sleep } from "src/utils/utils"
import {
  loginValidation
} from "src/utils/validation/loginValidation"


const fallback = "/dashboard" as const
export const Route = createFileRoute("/login")({
  component: () => <LoginPage />,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
})

export default function LoginPage() {
  const auth = useAuth()
  const router = useRouter()
  const search = Route.useSearch()
  const [showPassword, setShowPassword] = useState(false)
  console.log(AUTH_URL)

  const { mutateAsync } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: FormData) => {
      // return await fetch("http://localhost:3333/login", {
      return await fetch(AUTH_URL, {
        method: "POST",
        body: data,
      })
    },
    onSuccess: async (data) => {
      console.log(data)
      if (data.status === 401) {
        toast.error((await data.json()).error)
        return
      }
      if (data.status === 200) {
        toast.success("Signing in...")
        const { access_token } = await data.json()
        console.log(access_token)
        await auth.login(access_token)
        await router.invalidate()

        await sleep(1)
        await router.navigate({ to: search.redirect || fallback })
      }
    },
  })
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    // console.log(formData)
    const formValues = {
      email_or_username: formData.get("email_or_username") as string,
      password: formData.get("password") as string,
    }

    try {
      await loginValidation.parseAsync(formValues)
      await mutateAsync(formData)
    } catch (error: any) {
      if (error.name === 'TypeError') {
        toast.error("Unable to connect to the server. Please check your internet connection and try again.")
        return
      }
      if (error instanceof ZodError) {
        const firstError = error.errors[0]
        toast.error(firstError.message)
        return
      }
      toast.error("Login failed")
      // console.log(error, typeof error)
      // toast.error("Login failed")
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background p-4 text-foreground">
      <div className="flex w-full flex-col overflow-hidden rounded-lg bg-login-image shadow-xl sm:max-w-4xl md:flex-row">
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
              {
                search.redirect ? (
                  <>
                    <CardTitle className="text-2xl font-bold text-primary">
                      Login
                    </CardTitle>
                    <CardDescription className="text-red-900 font-black">
                      You need to login to access this page
                    </CardDescription>
                  </>

                ) : (
                  <>
                    <CardTitle className="text-2xl font-bold text-primary">
                      Welcome Back
                    </CardTitle>
                    <CardDescription className="text-white">
                      Enter your credentials to access your account.
                    </CardDescription>
                  </>

                )
              }
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white" htmlFor="email">
                    Email or Username
                  </Label>
                  <Input
                    id="email_or_username"
                    type="text"
                    name="email_or_username"
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
              <CardFooter className="flex flex-wrap gap-3">
                <Button className="w-full" type="submit">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>

              </CardFooter>
            </form>
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
  )
}
