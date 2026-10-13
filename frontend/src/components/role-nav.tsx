"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FrontendAuthUser, getStoredAuthUser } from "../lib/auth";

export default function RoleNav() {
  const [user, setUser] = useState<FrontendAuthUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUser(getStoredAuthUser());
  }, [pathname]);

  if (!user) {
    return null;
  }

  if (user.role === "ADMIN") {
    return (
      <Link href="/admin" className="text-gray-700 hover:text-black">
        Admin Panel
      </Link>
    );
  }

  if (user.role === "COURIER") {
    return (
      <Link href="/courier" className="text-gray-700 hover:text-black">
        Courier Panel
      </Link>
    );
  }

  return (
    <Link href="/user" className="text-gray-700 hover:text-black">
      My Shipments
    </Link>
  );
}
