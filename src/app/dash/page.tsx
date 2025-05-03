import { auth } from "@/lib/auth";
import { withRoleGuard } from "@/lib/withRoleGuard";
import { UserRole } from "@prisma/client";

async function Home() {
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

export default withRoleGuard(Home, [UserRole.ADMIN, UserRole.USER]);