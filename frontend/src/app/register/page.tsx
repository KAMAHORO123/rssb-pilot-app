"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/api";
import AuthShell from "../../components/auth/auth-shell";
import AuthSidePanel from "../../components/auth/auth-side-panel";
import AuthFormField from "../../components/auth/auth-form-field";
import { useToast } from "../../components/toast-provider";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await registerUser(form);
      setRedirecting(true);
      showToast({
        type: "success",
        message: "Account created successfully. Redirecting to sign in."
      });
      setForm({ email: "", password: "" });

      redirectTimerRef.current = setTimeout(() => {
        router.push("/login");
      }, 1600);
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Account creation could not be completed. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      sidePanel={
        <AuthSidePanel
          title="Get started today"
          subtitle="Create an account to start tracking shipments and managing deliveries."
        />
      }
      formPanel={
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">
            Create account
          </h2>
          <p className="landing-muted mt-2 text-sm">
            Set up your account to get started.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <AuthFormField
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              required
              disabled={submitting || redirecting}
            />

            <AuthFormField
              label="Password"
              type="password"
              placeholder="Create a secure password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required
              disabled={submitting || redirecting}
            />

            <button
              type="submit"
              disabled={submitting || redirecting}
              className="landing-gradient-btn w-full"
            >
              {submitting
                ? "Creating Account..."
                : redirecting
                  ? "Redirecting..."
                  : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      }
    />
  );
}
