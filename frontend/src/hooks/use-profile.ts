"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { redirectToLoginIfUnauthorized } from "../lib/route-guards";
import {
  fetchMyProfile,
  changePassword,
  changeEmail,
  UserProfile
} from "../lib/api";
import { useToast } from "../components/toast-provider";

type FieldErrors = Record<string, string>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(password: string): {
  score: number;
  label: string;
} {
  if (!password) return { score: 0, label: "" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak" };
  if (score <= 2) return { score: 2, label: "Fair" };
  if (score <= 3) return { score: 3, label: "Good" };
  return { score: 4, label: "Strong" };
}

export default function useProfile() {
  const router = useRouter();
  const { showToast } = useToast();
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors>({});
  const [passwordTouched, setPasswordTouched] = useState<
    Record<string, boolean>
  >({});

  // Email form
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailErrors, setEmailErrors] = useState<FieldErrors>({});
  const [emailTouched, setEmailTouched] = useState<Record<string, boolean>>({});

  const passwordStrength = getPasswordStrength(newPassword);

  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const authorized = redirectToLoginIfUnauthorized(router);
    if (!authorized) return;

    fetchMyProfile()
      .then(setProfile)
      .catch(() => {
        showToast({ type: "error", message: "Failed to load profile." });
      })
      .finally(() => setLoading(false));
  }, [router, showToast]);

  // Live password validation
  useEffect(() => {
    const errors: FieldErrors = {};

    if (passwordTouched.currentPassword && !currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (passwordTouched.newPassword) {
      if (!newPassword) {
        errors.newPassword = "New password is required.";
      } else if (newPassword.length < 6) {
        errors.newPassword = "Must be at least 6 characters.";
      } else if (currentPassword && newPassword === currentPassword) {
        errors.newPassword =
          "New password must be different from current password.";
      }
    }

    if (passwordTouched.confirmPassword) {
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your new password.";
      } else if (newPassword && confirmPassword !== newPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    setPasswordErrors(errors);
  }, [currentPassword, newPassword, confirmPassword, passwordTouched]);

  // Live email validation
  useEffect(() => {
    const errors: FieldErrors = {};

    if (emailTouched.newEmail) {
      if (!newEmail) {
        errors.newEmail = "New email is required.";
      } else if (!EMAIL_REGEX.test(newEmail)) {
        errors.newEmail = "Please enter a valid email address.";
      } else if (
        profile &&
        newEmail.toLowerCase() === profile.email.toLowerCase()
      ) {
        errors.newEmail = "New email must be different from current email.";
      }
    }

    if (emailTouched.emailPassword && !emailPassword) {
      errors.emailPassword = "Password is required to verify your identity.";
    }

    setEmailErrors(errors);
  }, [newEmail, emailPassword, emailTouched, profile]);

  function touchPasswordField(field: string) {
    setPasswordTouched((prev) => ({ ...prev, [field]: true }));
  }

  function touchEmailField(field: string) {
    setEmailTouched((prev) => ({ ...prev, [field]: true }));
  }

  function logoutAfterDelay(message: string) {
    showToast({ type: "success", message });
    logoutTimerRef.current = setTimeout(() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("auth_user");
      router.push("/login");
    }, 1500);
  }

  function validatePasswordForm(): boolean {
    const allTouched = {
      currentPassword: true,
      newPassword: true,
      confirmPassword: true
    };
    setPasswordTouched(allTouched);

    const errors: FieldErrors = {};

    if (!currentPassword) {
      errors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Must be at least 6 characters.";
    } else if (currentPassword && newPassword === currentPassword) {
      errors.newPassword =
        "New password must be different from current password.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword && confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateEmailForm(): boolean {
    const allTouched = { newEmail: true, emailPassword: true };
    setEmailTouched(allTouched);

    const errors: FieldErrors = {};

    if (!newEmail) {
      errors.newEmail = "New email is required.";
    } else if (!EMAIL_REGEX.test(newEmail)) {
      errors.newEmail = "Please enter a valid email address.";
    } else if (
      profile &&
      newEmail.toLowerCase() === profile.email.toLowerCase()
    ) {
      errors.newEmail = "New email must be different from current email.";
    }

    if (!emailPassword) {
      errors.emailPassword = "Password is required to verify your identity.";
    }

    setEmailErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleChangePassword = useCallback(async () => {
    if (!validatePasswordForm()) return;

    setChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordTouched({});
      setPasswordErrors({});
      logoutAfterDelay(
        "Password changed successfully. Redirecting to login..."
      );
    } catch (err) {
      showToast({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to change password."
      });
    } finally {
      setChangingPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPassword, newPassword, confirmPassword]);

  const handleChangeEmail = useCallback(async () => {
    if (!validateEmailForm()) return;

    setChangingEmail(true);
    try {
      await changeEmail({ newEmail, currentPassword: emailPassword });
      setNewEmail("");
      setEmailPassword("");
      setEmailTouched({});
      setEmailErrors({});
      logoutAfterDelay("Email changed successfully. Redirecting to login...");
    } catch (err) {
      showToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to change email."
      });
    } finally {
      setChangingEmail(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newEmail, emailPassword]);

  return {
    profile,
    loading,

    // Password form
    currentPassword,
    setCurrentPassword: (v: string) => {
      setCurrentPassword(v);
      touchPasswordField("currentPassword");
    },
    newPassword,
    setNewPassword: (v: string) => {
      setNewPassword(v);
      touchPasswordField("newPassword");
    },
    confirmPassword,
    setConfirmPassword: (v: string) => {
      setConfirmPassword(v);
      touchPasswordField("confirmPassword");
    },
    changingPassword,
    passwordErrors,
    passwordStrength,
    handleChangePassword,

    // Email form
    newEmail,
    setNewEmail: (v: string) => {
      setNewEmail(v);
      touchEmailField("newEmail");
    },
    emailPassword,
    setEmailPassword: (v: string) => {
      setEmailPassword(v);
      touchEmailField("emailPassword");
    },
    changingEmail,
    emailErrors,
    handleChangeEmail
  };
}
