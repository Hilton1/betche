import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      Seu Cargo é: {session?.user.role}
      <pre>
        {JSON.stringify(session?.user, null, 2)}
      </pre>
    </div>
  )
}
