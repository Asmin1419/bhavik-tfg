# Lethabo · TFG Financial Services Voice Demo

A Next.js webapp that demos **Lethabo**, the TFG Financial Services voice agent,
across two scenarios:

1. **Collections Outbound** — Lethabo calling a customer in arrears.
2. **Customer Service 24/7** — Lethabo handling routine inbound enquiries.

Built on Next.js 15 (App Router) + Tailwind + the
[`ultravox-client`](https://www.npmjs.com/package/ultravox-client) SDK.
The Ultravox API key stays server-side via a `/api/ultravox` route.

---

## 1. Prerequisites

- Node.js 18.18+ (Next 15 requires it)
- An Ultravox account & API key — sign up at https://app.ultravox.ai
- A modern browser (Chrome/Safari/Edge) that allows microphone access

---

## 2. Local setup

```bash
# from the project root
cp .env.example .env.local
# then edit .env.local and paste your real Ultravox key

npm install
npm run dev
```

Open http://localhost:3000 and:
1. Click a scenario card.
2. Allow the microphone prompt.
3. Click **Start conversation with Lethabo**.

> The first time the page calls `/api/ultravox`, your server creates an
> Ultravox call and returns a `joinUrl`. The browser then opens a WebRTC
> session directly with Ultravox — the API key never leaves your server.

---

## 3. Customising Lethabo

All persona + scenario prompts live in **`lib/scenarios.ts`**.
Edit `SCENARIOS.collections.systemPrompt` or `SCENARIOS["customer-service"].systemPrompt`
to change Lethabo's behaviour.

To use a different voice, change the `voice` field. You can browse voices in
the Ultravox console or list them via the API. Examples: `Mark`, `Jessica`,
`Steve`. For South African English specifically, audition voices in the
console and pick the one that sounds most authentic.

---

## 4. Deploy to Vercel

```bash
# install the Vercel CLI once
npm i -g vercel

# from the project root
vercel
```

Follow the prompts. After the first deploy:

1. Go to your project on https://vercel.com → **Settings** → **Environment Variables**.
2. Add `ULTRAVOX_API_KEY` with your real key (Production, Preview, Development).
3. Redeploy: `vercel --prod`.

That's it — your demo is live.

---

## 5. Project structure

```
Lethabo-tfg/
├── app/
│   ├── api/ultravox/route.ts   ← server: creates Ultravox calls
│   ├── call/page.tsx           ← the call experience
│   ├── page.tsx                ← landing page with two scenarios
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── CallStage.tsx           ← Ultravox session + transcripts UI
│   └── TFGMark.tsx
├── lib/
│   └── scenarios.ts            ← system prompts for Lethabo
├── tailwind.config.ts
└── package.json
```

---

## 6. Notes on POPIA + production-readiness

This is a **demo**. Before letting real customers near it:

- Verify identity with at least two factors and **never read out full ID
  numbers or full card numbers** by voice.
- Log every call with a clear consent prompt at the start ("This call is being
  recorded and may be used to train AI…").
- Add **Ultravox tools** for the things Lethabo shouldn't fake — looking up a
  real account balance, scheduling a real payment, etc. See
  https://docs.ultravox.ai for the tool-calling spec.
- For outbound calls at scale, wire Ultravox to Twilio or another SIP carrier
  rather than browser audio.
