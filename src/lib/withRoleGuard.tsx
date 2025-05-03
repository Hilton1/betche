import { UserRole } from "@prisma/client";
import { auth } from "./auth";

export function withRoleGuard(Component: React.ComponentType<any>, requiredRole: UserRole[]) {
  return async function RoleGuardedComponent(props: any) {
    const session = await auth();

    if(session?.user.role && !requiredRole.includes(session?.user.role)) {
      return (
        <div>
          <h1 className="text-3xl">Acesso Negado</h1>
        </div>
      )
    }

    return <Component {...props} />;
  };
}