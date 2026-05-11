import { SCENARIOS, ScenarioKey } from "@/lib/scenarios";
import { CallStage } from "@/components/CallStage";
import Link from "next/link";
import { TFGMark } from "@/components/TFGMark";

export default async function CallPage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string }>;
}) {
  const params = await searchParams;
  const key = (params.scenario ?? "customer-service") as ScenarioKey;
  const scenario = SCENARIOS[key] ?? SCENARIOS["customer-service"];

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper paper-texture">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-3">
          <TFGMark className="h-9 w-9" />
          <div className="leading-tight">
            <div className="font-display text-[17px] font-semibold tracking-tight">
              TFG Financial Services
            </div>
            <div className="eyebrow text-aubergine-600">
              Lethabo · {scenario.title}
            </div>
          </div>
        </Link>
        <Link
          href="/"
          className="eyebrow text-ink/60 hover:text-aubergine-600"
        >
          ← back to scenarios
        </Link>
      </nav>

      <CallStage scenarioKey={scenario.key} scenarioTitle={scenario.title} scenarioSubtitle={scenario.subtitle} />
    </main>
  );
}
