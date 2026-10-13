import { getStoredAuthUser } from "./auth";

type RouterLike = {
  push: (path: string) => void;
};

export function redirectToLoginIfUnauthorized(
  router: RouterLike,
  requiredRoles?: string[]
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const token = localStorage.getItem("access_token");
  const user = getStoredAuthUser();

  if (!token || !user) {
    router.push("/login");
    return false;
  }

  if (
    requiredRoles &&
    requiredRoles.length > 0 &&
    !requiredRoles.includes(user.role)
  ) {
    router.push("/login");
    return false;
  }

  return true;
}
