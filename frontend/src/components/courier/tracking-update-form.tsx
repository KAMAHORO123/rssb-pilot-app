import { TrackingFormState } from "../../lib/types";

type TrackingUpdateFormProps = {
  form: TrackingFormState;
  currentStatus: string;
  submitting: boolean;
  onChange: (field: keyof TrackingFormState, value: string) => void;
  onSubmit: () => void;
};

function getNextStatusOptions(currentStatus: string) {
  if (currentStatus === "ASSIGNED") {
    return ["PICKED_UP"];
  }

  if (currentStatus === "PICKED_UP") {
    return ["IN_TRANSIT"];
  }

  if (currentStatus === "IN_TRANSIT") {
    return ["DELIVERED"];
  }

  return [];
}

export default function TrackingUpdateForm({
  form,
  currentStatus,
  submitting,
  onChange,
  onSubmit
}: TrackingUpdateFormProps) {
  const nextStatusOptions = getNextStatusOptions(currentStatus);
  const hasNextTransition = nextStatusOptions.length > 0;

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <h3 className="text-sm font-bold text-slate-900">
        {hasNextTransition ? "Update Status" : "Delivery Complete"}
      </h3>

      {hasNextTransition ? (
        <>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Next Status
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none"
                value={form.status}
                onChange={(e) => onChange("status", e.target.value)}
                disabled={!hasNextTransition}
              >
                {nextStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Note</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                value={form.note}
                onChange={(e) => onChange("note", e.target.value)}
                placeholder={
                  form.status === "DELIVERED"
                    ? "Required for delivery"
                    : "Optional note"
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Latitude
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                value={form.locationLat}
                onChange={(e) => onChange("locationLat", e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Longitude
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                value={form.locationLng}
                onChange={(e) => onChange("locationLng", e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || !hasNextTransition}
            className="courier-btn-primary mt-4 px-4 py-2.5 text-sm"
          >
            {submitting ? "Submitting..." : "Submit Update"}
          </button>
        </>
      ) : (
        <p className="mt-2 text-sm text-slate-500">
          No further actions available.
        </p>
      )}
    </div>
  );
}
