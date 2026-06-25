import { auth } from "@/auth";
import type { Role } from "@prisma/client";

// Server-side guard helpers. Throwable so route handlers stay terse.
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) throw new HttpError(401, "Unauthorized");
  return session.user;
}

export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new HttpError(403, "Forbidden");
  return user;
}
