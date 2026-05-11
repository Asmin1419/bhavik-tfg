"use client";

import { useEffect, useRef, useState } from "react";
import type { ScenarioKey } from "@/lib/scenarios";

type Status =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "disconnecting"
  | "disconnected";

interface Transcript {
  text: string;
  isFinal: boolean;
  speaker: "user" | "agent";
}

export function CallStage({
  scenarioKey,
  scenarioTitle,
  scenarioSubtitle,
}: {
  scenarioKey: ScenarioKey;
  scenarioTitle: string;
  scenarioSubtitle: string;
}) {
  const [status, setStatus] = useState<Status>("disconnected");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // We keep the UltravoxSession in a ref so that React state changes don't
  // throw away the live audio session.
  const sessionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the transcript pane
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  // Cleanup on unmount — never leave a call ringing
  useEffect(() => {
    return () => {
      sessionRef.current?.leaveCall?.();
    };
  }, []);

  async function startCall() {
    setError(null);
    setTranscripts([]);
    setStatus("connecting");

    try {
      // 1. Ask our own backend to create a call. The API key stays server-side.
      const res = await fetch("/api/ultravox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenarioKey }),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.error ?? `Server returned ${res.status}`);
      }

      const { joinUrl } = await res.json();
      if (!joinUrl) throw new Error("No joinUrl returned");

      // 2. Dynamically import the Ultravox client only in the browser.
      const { UltravoxSession } = await import("ultravox-client");
      const session = new UltravoxSession();
      sessionRef.current = session;

      // 3. Wire up listeners.
      session.addEventListener("status", () => {
        const s = session.status as Status;
        setStatus(s);
      });

      session.addEventListener("transcripts", () => {
        // session.transcripts is the full list each time
        const ts: Transcript[] = (session.transcripts ?? []).map((t: any) => ({
          text: t.text,
          isFinal: t.isFinal,
          speaker: t.speaker,
        }));
        setTranscripts(ts);
      });

      // 4. Join the call. This opens mic & speaker.
      await session.joinCall(joinUrl);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Something went wrong");
      setStatus("disconnected");
    }
  }

  async function endCall() {
    setStatus("disconnecting");
    try {
      await sessionRef.current?.leaveCall?.();
    } finally {
      sessionRef.current = null;
      setStatus("disconnected");
    }
  }

  function toggleMute() {
    const s = sessionRef.current;
    if (!s) return;
    if (isMuted) {
      s.unmuteMic?.();
      setIsMuted(false);
    } else {
      s.muteMic?.();
      setIsMuted(true);
    }
  }

  const isLive = !["disconnected", "disconnecting"].includes(status);

  return (
    <section className="relative mx-auto max-w-7xl px-8 pb-24 pt-10">
      <div className="grid grid-cols-12 gap-8">
        {/* LEFT: Scenario panel */}
        <div className="col-span-12 lg:col-span-5">
          <p className="eyebrow mb-5 text-aubergine-600">
            ◍ Scenario in progress
          </p>
          <h1 className="font-display text-[56px] leading-[0.95] tracking-tight">
            {scenarioTitle}
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-[1.55] text-ink/70">
            {scenarioSubtitle}
          </p>

          <div className="mt-10 border-t border-ink/15 pt-6">
            <p className="eyebrow mb-3 text-ink/50">What to try</p>
            <ul className="space-y-2 text-[15px] text-ink/80">
              {scenarioKey === "collections" ? (
                <>
                  <li>· Answer as the account holder, &ldquo;Thandi Mokoena&rdquo;.</li>
                  <li>· Try giving the last 4 digits of an ID: <span className="font-mono">3214</span>.</li>
                  <li>· Negotiate a payment date later this month.</li>
                  <li>· Push back on the amount — see how Bhavik handles it.</li>
                </>
              ) : (
                <>
                  <li>· Ask &ldquo;what&apos;s my account balance?&rdquo;</li>
                  <li>· Try &ldquo;when is my next payment due?&rdquo;</li>
                  <li>· Ask Bhavik to update your mobile number.</li>
                  <li>· Ask something out of scope — see the handover.</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* RIGHT: Call stage */}
        <div className="col-span-12 lg:col-span-7">
          <div className="relative border border-ink/15 bg-paper">
            {/* Status row */}
            <div className="flex items-center justify-between border-b border-ink/15 px-6 py-4">
              <div className="flex items-center gap-3">
                <StatusDot status={status} />
                <span className="eyebrow text-ink/70">
                  {humanStatus(status)}
                </span>
              </div>
              <span className="eyebrow text-ink/40">
                Bhavik · ZA / EN
              </span>
            </div>

            {/* Voice visual */}
            <div className="relative flex h-[280px] items-center justify-center overflow-hidden bg-aubergine-600 text-paper">
              <VoiceVisual status={status} />
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between">
                <span className="eyebrow text-paper/80">
                  Connection · WebRTC
                </span>
                <span className="eyebrow text-paper/80">
                  Latency &lt; 400ms
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 border-t border-ink/15 px-6 py-5">
              {!isLive ? (
                <button
                  onClick={startCall}
                  className="group relative inline-flex items-center gap-3 bg-ink px-6 py-3 text-paper transition-all hover:bg-aubergine-600"
                >
                  <span className="h-2 w-2 rounded-full bg-rust" />
                  <span className="font-sans text-[15px] font-medium tracking-tight">
                    Start conversation with Bhavik
                  </span>
                  <span className="ml-2 font-display text-lg italic">↗</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={endCall}
                    className="inline-flex items-center gap-2 bg-rust px-5 py-3 text-paper transition-opacity hover:opacity-90"
                  >
                    <span className="h-2 w-2 rounded-full bg-paper" />
                    <span className="font-sans text-[14px] font-medium">
                      End call
                    </span>
                  </button>
                  <button
                    onClick={toggleMute}
                    className={`inline-flex items-center gap-2 border px-5 py-3 text-[14px] transition-all ${
                      isMuted
                        ? "border-rust bg-rust/10 text-rust"
                        : "border-ink/30 text-ink hover:border-ink"
                    }`}
                  >
                    {isMuted ? "Unmute mic" : "Mute mic"}
                  </button>
                </>
              )}
              {error && (
                <div className="ml-auto max-w-xs text-right text-[13px] text-rust">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Transcript */}
          <div className="mt-6 border border-ink/15 bg-paper">
            <div className="flex items-center justify-between border-b border-ink/15 px-6 py-4">
              <span className="eyebrow text-ink/60">Live transcript</span>
              <span className="eyebrow text-ink/40">
                {transcripts.length} turn{transcripts.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="h-[280px] overflow-y-auto px-6 py-4">
              {transcripts.length === 0 ? (
                <p className="mt-12 text-center text-[14px] italic text-ink/40">
                  The conversation transcript will appear here once Bhavik
                  starts speaking.
                </p>
              ) : (
                <ul className="space-y-4">
                  {transcripts.map((t, i) => (
                    <li
                      key={i}
                      className={`flex gap-3 ${
                        t.speaker === "agent" ? "" : "flex-row-reverse text-right"
                      }`}
                    >
                      <span
                        className={`eyebrow shrink-0 pt-1 ${
                          t.speaker === "agent"
                            ? "text-aubergine-600"
                            : "text-rust"
                        }`}
                      >
                        {t.speaker === "agent" ? "Bhavik" : "You"}
                      </span>
                      <p
                        className={`text-[15px] leading-[1.5] ${
                          t.isFinal ? "text-ink" : "text-ink/55 italic"
                        }`}
                      >
                        {t.text}
                      </p>
                    </li>
                  ))}
                  <div ref={transcriptEndRef} />
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function humanStatus(s: Status) {
  switch (s) {
    case "idle": return "Connected · warming up";
    case "listening": return "Listening";
    case "thinking": return "Thinking";
    case "speaking": return "Bhavik is speaking";
    case "connecting": return "Connecting…";
    case "disconnecting": return "Ending call";
    case "disconnected": return "Ready";
  }
}

function StatusDot({ status }: { status: Status }) {
  const color =
    status === "speaking" ? "bg-rust"
    : status === "listening" ? "bg-aubergine-600"
    : status === "thinking" ? "bg-aubergine-400"
    : status === "connecting" || status === "idle" ? "bg-aubergine-300"
    : "bg-ink/30";
  const animate = status !== "disconnected" ? "animate-breathe" : "";
  return <span className={`h-2.5 w-2.5 rounded-full ${color} ${animate}`} />;
}

function VoiceVisual({ status }: { status: Status }) {
  // Animate bars only when the call is live
  const active = ["listening", "thinking", "speaking", "idle"].includes(status);

  return (
    <div className="flex items-end gap-2">
      {Array.from({ length: 11 }).map((_, i) => (
        <span
          key={i}
          className="wave-bar block w-2 rounded-full bg-paper/90"
          style={{
            height: `${30 + (i % 3) * 20}px`,
            animationDelay: `${(i * 80) % 1000}ms`,
            animationPlayState: active ? "running" : "paused",
            opacity: active ? 1 : 0.35,
          }}
        />
      ))}
    </div>
  );
}
