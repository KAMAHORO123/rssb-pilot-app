export type FrontendAuthUser = {
  id: string;
  email: string;
  role: string;
};

export function getStoredAuthUser(): FrontendAuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("auth_user");

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as FrontendAuthUser;
  } catch {
    return null;
  }
}
