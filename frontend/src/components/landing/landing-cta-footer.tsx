import Link from "next/link";

type LandingCtaFooterProps = {
  primaryHref: string;
  primaryLabel: string;
};

export default function LandingCtaFooter({
  primaryHref,
  primaryLabel
}: LandingCtaFooterProps) {
  return (
    <section className="landing-cta-footer relative overflow-hidden rounded-2xl bg-slate-950 px-8 py-16 text-center md:px-12 md:py-20">
      <div className="landing-glow -top-20 left-1/2 -translate-x-1/2 opacity-40" />

      <div className="relative z-10">
        <h2 className="landing-display text-3xl text-white md:text-4xl">
          Ready to streamline your logistics?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-400">
          Get started in minutes. Create shipments, assign couriers, and track
          deliveries in real time.
        </p>
        <div className="mt-8">
          <Link href={primaryHref} className="landing-gradient-btn">
            {primaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
