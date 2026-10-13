"use client";

import ProfileSidebar from "../../components/profile/profile-sidebar";
import ChangePasswordCard from "../../components/profile/change-password-card";
import ChangeEmailCard from "../../components/profile/change-email-card";
import useProfile from "../../hooks/use-profile";

export default function ProfilePage() {
  const {
    profile,
    loading,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    changingPassword,
    passwordErrors,
    passwordStrength,
    handleChangePassword,
    newEmail,
    setNewEmail,
    emailPassword,
    setEmailPassword,
    changingEmail,
    emailErrors,
    handleChangeEmail
  } = useProfile();

  if (loading) {
    return (
      <main className="profile-experience px-4 py-6 md:px-8 md:py-8">
        <div className="profile-page-shell">
          <div className="profile-surface px-5 py-10 text-center text-sm text-stone-500">
            Loading profile...
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-experience px-4 py-6 md:px-8 md:py-8">
        <div className="profile-page-shell">
          <div className="profile-surface px-5 py-10 text-center text-sm text-stone-500">
            Unable to load profile.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-experience px-4 py-6 md:px-8 md:py-8">
      <div className="profile-page-shell">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
          <ProfileSidebar profile={profile} />

          <section className="space-y-4">
            <ChangePasswordCard
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              saving={changingPassword}
              errors={passwordErrors}
              passwordStrength={passwordStrength}
              onCurrentPasswordChange={setCurrentPassword}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onSubmit={handleChangePassword}
            />

            <ChangeEmailCard
              newEmail={newEmail}
              currentPassword={emailPassword}
              saving={changingEmail}
              errors={emailErrors}
              currentUserEmail={profile.email}
              onNewEmailChange={setNewEmail}
              onCurrentPasswordChange={setEmailPassword}
              onSubmit={handleChangeEmail}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
