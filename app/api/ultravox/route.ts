import { NextRequest, NextResponse } from "next/server";
import { SCENARIOS, ScenarioKey } from "@/lib/scenarios";

// Force this route to run on the Node.js runtime (not the edge) so we can
// safely read process.env.ULTRAVOX_API_KEY without it being bundled to the
// client. We also force dynamic — no caching of call-creation responses.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ULTRAVOX_API_URL = "https://api.ultravox.ai/api/calls";

export async function POST(req: NextRequest) {
  try {
    const { scenario } = (await req.json()) as { scenario: ScenarioKey };

    if (!scenario || !SCENARIOS[scenario]) {
      return NextResponse.json(
        { error: "Unknown scenario" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ULTRAVOX_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing ULTRAVOX_API_KEY" },
        { status: 500 }
      );
    }

    const config = SCENARIOS[scenario];

    const payload = {
      systemPrompt: config.systemPrompt,
      temperature: 0.3,
      model: "fixie-ai/ultravox",
      voice: config.voice,
      firstSpeaker: config.firstSpeaker,
      medium: { webRtc: {} },
      // Useful metadata for analytics in the Ultravox console
      metadata: {
        product: "bhavik-tfg",
        scenario: config.key,
        region: "ZA",
        language: "en",
      },
    };

    const uvRes = await fetch(ULTRAVOX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!uvRes.ok) {
      const detail = await uvRes.text();
      console.error("Ultravox API error", uvRes.status, detail);
      return NextResponse.json(
        { error: "Ultravox API failed", status: uvRes.status, detail },
        { status: 502 }
      );
    }

    const data = await uvRes.json();
    // We only return what the client actually needs.
    return NextResponse.json({
      joinUrl: data.joinUrl,
      callId: data.callId,
      scenario: config.key,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
