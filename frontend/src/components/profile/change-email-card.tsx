import AuthFormField from "../auth/auth-form-field";

type ChangeEmailCardProps = {
  newEmail: string;
  currentPassword: string;
  saving: boolean;
  errors: Record<string, string>;
  currentUserEmail?: string;
  onNewEmailChange: (v: string) => void;
  onCurrentPasswordChange: (v: string) => void;
  onSubmit: () => void;
};

export default function ChangeEmailCard({
  newEmail,
  currentPassword,
  saving,
  errors,
  currentUserEmail,
  onNewEmailChange,
  onCurrentPasswordChange,
  onSubmit
}: ChangeEmailCardProps) {
  const hasErrors = Object.keys(errors).length > 0;
  const isIncomplete = !newEmail || !currentPassword;

  return (
    <div className="profile-surface px-5 py-5 md:px-6">
      <h3 className="text-base font-bold text-stone-900">Change Email</h3>
      <p className="mt-1 text-xs text-stone-400">
        You will be logged out after changing your email.
      </p>

      {currentUserEmail ? (
        <p className="mt-2 text-xs text-stone-500">
          Current email:{" "}
          <span className="font-medium text-stone-700">{currentUserEmail}</span>
        </p>
      ) : null}

      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <AuthFormField
          label="New Email"
          type="email"
          placeholder="new@example.com"
          value={newEmail}
          onChange={onNewEmailChange}
          required
          disabled={saving}
          error={errors.newEmail}
        />
        <AuthFormField
          label="Current Password"
          type="password"
          placeholder="Verify your identity"
          value={currentPassword}
          onChange={onCurrentPasswordChange}
          required
          disabled={saving}
          error={errors.emailPassword}
          hint={
            !errors.emailPassword && !currentPassword
              ? "Required to confirm this change."
              : undefined
          }
        />
        <button
          type="submit"
          disabled={saving || (hasErrors && !isIncomplete)}
          className="profile-btn-primary w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50"
        >
          {saving ? "Changing..." : "Change Email"}
        </button>
      </form>
    </div>
  );
}
