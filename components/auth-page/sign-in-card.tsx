"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { signInWithGoogle } from "@/app/server-actions/auth-actions";

type Props = {
  toggleAuthType: (type: "sign-in" | "sign-up") => void
}

export function SignInCard({toggleAuthType}: Props) {
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
           Login using Google
        </CardDescription>
        <CardAction>
          <Button onClick={() => toggleAuthType("sign-up")} variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      {/* <CardContent> </CardContent> */}
      <CardFooter className="flex-col gap-2">
        <form action={signInWithGoogle} className="w-full">
          <Button
            type="submit"
            variant="outline"
            className="w-full bg-black text-white hover:bg-white hover:text-black"
          >
            Sign up with Google
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
