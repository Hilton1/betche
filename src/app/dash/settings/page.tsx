import { auth } from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await auth();

  if(session?.user.role !== "ADMIN") {
    redirect("/dash");
  }

  return (
    <div>
      <h1 className="text-3xl">Configurações de {session?.user?.name}</h1>
    </div>
  )
}
