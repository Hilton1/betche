"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useState } from "react";

import { ChevronLeftIcon, Loader2Icon, Wand2Icon } from "lucide-react";
import { toast } from "sonner";
import { loginAction, magicLinkAction } from "@/app/login/actions";

export function LoginForm() {
  const [isMagicLink, setIsMagicLink] = useState(false);

  const [, dispatchAction, isPending] = useActionState(
    async (_previousData: any, formData: FormData) => {
      const action = isMagicLink ? magicLinkAction : loginAction;

      const response = await action(formData);

      if (response?.error) {
        toast.error(response.error);
      }
    },
    null
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatchAction} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              {!isMagicLink && (
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>

                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                  <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && <Loader2Icon className="animate-spin" />}
                  {isMagicLink ? "Send Magic Link" : "Login"}
                </Button>

                {!isMagicLink && (
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    type="button"
                    disabled={isPending}
                    onClick={() => signIn("google")}
                  >
                    Login with Google
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsMagicLink((prev) => !prev)}
                >
                  {isMagicLink ? <ChevronLeftIcon /> : <Wand2Icon />}
                  {isMagicLink ? "Back" : "Login with Magic Link"}
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
