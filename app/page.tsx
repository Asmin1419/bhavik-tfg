import Link from "next/link";
import { TFGMark } from "@/components/TFGMark";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper paper-texture">
      {/* Top nav */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <TFGMark className="h-9 w-9" />
          <div className="leading-tight">
            <div className="font-display text-[17px] font-semibold tracking-tight">
              TFG Financial Services
            </div>
            <div className="eyebrow text-aubergine-600">
              Voice AI · Pilot Programme
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="eyebrow text-ink/60">ZA · EN</span>
          <span className="h-2 w-2 animate-breathe rounded-full bg-rust" />
          <span className="eyebrow text-ink/60">Live demo</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-8 pb-24 pt-12">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-8 animate-rise">
            <p className="eyebrow mb-6 text-aubergine-600">
              ◍ Issue №01 — The Collections & Care Edition
            </p>
            <h1 className="font-display text-[68px] leading-[0.95] tracking-[-0.02em] md:text-[104px]">
              Meet{" "}
              <span className="italic text-aubergine-600">Bhavik</span>.
              <br />
              <span className="text-ink/40">The voice</span>
              <br />
              of TFG.
            </h1>
          </div>
          <div className="col-span-12 mt-8 md:col-span-4 md:mt-24 animate-rise [animation-delay:120ms]">
            <p className="max-w-sm text-[17px] leading-[1.55] text-ink/75">
              A conversational AI engineered for South African customers — fluent,
              patient, and available at every hour. Designed to ease the load on
              our contact centres and to greet every caller with the same calm
              voice, whether it is 09:00 on Monday or 02:00 on Sunday.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-12 bg-ink/40" />
              <span className="eyebrow text-ink/60">
                Powered by Ultravox · v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div className="mt-20 flex items-center gap-6">
          <span className="eyebrow text-ink/40">Choose a scenario</span>
          <span className="h-px flex-1 bg-ink/15" />
          <span className="eyebrow text-ink/40">02 available</span>
        </div>

        {/* Two scenario cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <ScenarioCard
            number="01"
            tag="Outbound"
            title="Collections"
            description="Bhavik places considerate outbound calls to customers in arrears, confirms identity, discusses balances and arranges repayment commitments — replacing the linear cost of human headcount."
            stat="24/7"
            statLabel="availability"
            href="/call?scenario=collections"
            accent="rust"
          />
          <ScenarioCard
            number="02"
            tag="Inbound"
            title="Customer Service"
            description="An always-on assistant for routine enquiries: balance checks, application status, payment confirmations and account housekeeping — so skilled agents focus on the complex, revenue-generating conversations."
            stat="100%"
            statLabel="of low-complexity contacts"
            href="/call?scenario=customer-service"
            accent="aubergine"
          />
        </div>

        {/* Footer strip */}
        <div className="mt-24 grid grid-cols-2 gap-8 border-t border-ink/15 pt-8 md:grid-cols-4">
          <Metric value="< 400ms" label="Voice latency" />
          <Metric value="11" label="SA languages roadmap" />
          <Metric value="∞" label="Concurrent calls" />
          <Metric value="POPIA" label="Compliance posture" />
        </div>
      </section>

      {/* Big background type — editorial flourish */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-20 select-none font-display text-[260px] leading-none tracking-tighter text-aubergine-600/[0.06]"
      >
        Bhavik.
      </div>
    </main>
  );
}

function ScenarioCard({
  number,
  tag,
  title,
  description,
  stat,
  statLabel,
  href,
  accent,
}: {
  number: string;
  tag: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  href: string;
  accent: "rust" | "aubergine";
}) {
  const accentBg =
    accent === "rust"
      ? "group-hover:bg-rust"
      : "group-hover:bg-aubergine-600";
  const accentText =
    accent === "rust" ? "text-rust" : "text-aubergine-600";

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden border border-ink/15 bg-paper p-8 transition-all duration-500 hover:border-ink/30"
    >
      {/* Sliding accent panel */}
      <span
        className={`absolute inset-0 -translate-x-full ${accentBg} transition-transform duration-500 group-hover:translate-x-0`}
      />

      <div className="relative z-10 flex flex-col gap-6 transition-colors duration-500 group-hover:text-paper">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow text-ink/50 group-hover:text-paper/70">
            № {number} / {tag}
          </span>
          <span
            className={`font-display text-2xl italic ${accentText} group-hover:text-paper`}
          >
            ↗
          </span>
        </div>

        <h3 className="font-display text-5xl font-medium leading-none tracking-tight">
          {title}
        </h3>

        <p className="max-w-md text-[15px] leading-[1.6] text-ink/70 group-hover:text-paper/85">
          {description}
        </p>

        <div className="mt-2 flex items-end gap-3 border-t border-ink/15 pt-5 group-hover:border-paper/30">
          <span className="font-display text-3xl">{stat}</span>
          <span className="eyebrow pb-1 text-ink/55 group-hover:text-paper/70">
            {statLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl tracking-tight">{value}</div>
      <div className="eyebrow mt-1 text-ink/55">{label}</div>
    </div>
  );
}
