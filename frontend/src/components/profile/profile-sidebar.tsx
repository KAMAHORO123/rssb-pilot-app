import { UserProfile } from "../../lib/api";

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-violet-100 text-violet-800 border-violet-200",
  COURIER: "bg-teal-100 text-teal-800 border-teal-200",
  USER: "bg-stone-100 text-stone-700 border-stone-200"
};

type ProfileSidebarProps = {
  profile: UserProfile;
};

export default function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const roleStyle = ROLE_STYLES[profile.role] ?? ROLE_STYLES.USER;
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  return (
    <aside className="profile-surface px-5 py-6 md:px-6">
      <h2 className="text-lg font-bold text-stone-900">Account</h2>

      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
            Email
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-800 break-all">
            {profile.email}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
            Role
          </p>
          <span
            className={`mt-1 inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${roleStyle}`}
          >
            {profile.role}
          </span>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
            Member since
          </p>
          <p className="mt-1 text-sm text-stone-600">{memberSince}</p>
        </div>

        {profile.courier ? (
          <>
            <hr className="border-stone-200" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Vehicle
              </p>
              <p className="mt-1 text-sm text-stone-700">
                {profile.courier.vehicleType ?? "Not set"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Availability
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                  profile.courier.availability
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                {profile.courier.availability ? "Available" : "Unavailable"}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </aside>
  );
}
