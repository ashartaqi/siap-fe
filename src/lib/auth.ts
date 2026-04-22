import { cookies } from "next/headers";
import { AUTH_COOKIE } from "./auth/constants";

export { AUTH_COOKIE, COOKIE_OPTIONS } from "./auth/constants";

export async function getSession(): Promise<{ token: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return { token };
}
