"use client";

import { useEffect, useMemo, useState } from "react";
import { FrontendAuthUser, getStoredAuthUser } from "../lib/auth";
import LandingHero from "../components/landing/landing-hero";
import LandingFeatures from "../components/landing/landing-role-cards";
import LandingCtaFooter from "../components/landing/landing-cta-footer";

function getRoleDestination(user: FrontendAuthUser | null) {
  if (!user) {
    return {
      href: "/login",
      label: "Get Started"
    };
  }

  if (user.role === "ADMIN") {
    return {
      href: "/admin",
      label: "Open Admin Panel"
    };
  }

  if (user.role === "COURIER") {
    return {
      href: "/courier",
      label: "Open Courier Workspace"
    };
  }

  return {
    href: "/user",
    label: "Open My Shipments"
  };
}

export default function HomePage() {
  const [user, setUser] = useState<FrontendAuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredAuthUser());
  }, []);

  const primaryCta = useMemo(() => getRoleDestination(user), [user]);

  return (
    <main className="landing-experience px-6 py-8 md:px-8 md:py-10">
      <div className="landing-page-shell space-y-6">
        <LandingHero
          primaryHref={primaryCta.href}
          primaryLabel={primaryCta.label}
          secondaryHref="#features"
        />
        <LandingFeatures />
        <LandingCtaFooter
          primaryHref={primaryCta.href}
          primaryLabel={primaryCta.label}
        />
      </div>
    </main>
  );
}
