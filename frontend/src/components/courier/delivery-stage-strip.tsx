const DELIVERY_STEPS = ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

type DeliveryStageStripProps = {
  status: string;
};

function getStepIndex(status: string) {
  return DELIVERY_STEPS.indexOf(status);
}

export default function DeliveryStageStrip({
  status
}: DeliveryStageStripProps) {
  const currentStepIndex = getStepIndex(status);

  return (
    <div className="mt-3 grid gap-2 md:grid-cols-4">
      {DELIVERY_STEPS.map((step, index) => {
        const isCurrent = step === status;
        const isCompleted =
          currentStepIndex >= index && currentStepIndex !== -1;

        return (
          <div
            key={step}
            className={`rounded-xl border px-3 py-2.5 text-center ${
              isCurrent
                ? "progress-step-current border-transparent text-white"
                : isCompleted
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-50/80 text-slate-500"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">
              {step.replace("_", " ")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
