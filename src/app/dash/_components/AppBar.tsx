"use client";

import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "../_actions/signOutAction";

export function AppBar() {
  const session = useSession();

  if (session.status === "loading") {
    return "Carregando...";
  }

  return (
    <header className="h-20 flex items-center justify-between px-6 border-b">
      <span>Olá, {session.data?.user?.name}</span>

      <div className="space-x-4">
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          onClick={() => signIn("google")}
        >
          Conectar conta Google
        </Button>

        <Button onClick={signOutAction} size="sm" className="cursor-pointer">
          Sair
        </Button>
      </div>
    </header>
  );
}
