import AuthFormField from "../auth/auth-form-field";

const STRENGTH_COLORS = [
  "",
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-emerald-400"
];
const STRENGTH_LABELS_COLOR = [
  "",
  "text-red-600",
  "text-orange-600",
  "text-yellow-600",
  "text-emerald-600"
];

type ChangePasswordCardProps = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  saving: boolean;
  errors: Record<string, string>;
  passwordStrength: { score: number; label: string };
  onCurrentPasswordChange: (v: string) => void;
  onNewPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onSubmit: () => void;
};

export default function ChangePasswordCard({
  currentPassword,
  newPassword,
  confirmPassword,
  saving,
  errors,
  passwordStrength,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit
}: ChangePasswordCardProps) {
  const hasErrors = Object.keys(errors).length > 0;
  const isIncomplete = !currentPassword || !newPassword || !confirmPassword;

  return (
    <div className="profile-surface px-5 py-5 md:px-6">
      <h3 className="text-base font-bold text-stone-900">Change Password</h3>
      <p className="mt-1 text-xs text-stone-400">
        You will be logged out after changing your password.
      </p>

      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <AuthFormField
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={onCurrentPasswordChange}
          required
          disabled={saving}
          error={errors.currentPassword}
        />

        <div>
          <AuthFormField
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={onNewPasswordChange}
            required
            disabled={saving}
            error={errors.newPassword}
            hint={
              !errors.newPassword && !newPassword
                ? "Use 6+ characters with a mix of letters, numbers & symbols."
                : undefined
            }
          />
          {newPassword && !errors.newPassword ? (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        passwordStrength.score >= level
                          ? STRENGTH_COLORS[passwordStrength.score]
                          : "bg-stone-200"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-medium ${
                    STRENGTH_LABELS_COLOR[passwordStrength.score] ||
                    "text-stone-400"
                  }`}
                >
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <AuthFormField
          label="Confirm New Password"
          type="password"
          placeholder="Repeat new password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          required
          disabled={saving}
          error={errors.confirmPassword}
        />

        <button
          type="submit"
          disabled={saving || (hasErrors && !isIncomplete)}
          className="profile-btn-primary w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50"
        >
          {saving ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
