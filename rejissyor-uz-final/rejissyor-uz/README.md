# Rejissyor.uz

An interactive, AI-directed cinema experience — now rendered as a full 3D
scene with **Three.js** and **React Three Fiber**. Pick a genre from a
floating "genre galaxy," and a **No-Repeat Story Engine** (powered by
Google Gemini via `@google/genai`) writes every scene, image prompt, and
choice fresh — grounded in your full choice history so nothing ever
repeats within a session.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and
`@react-three/fiber` / `@react-three/drei` in a **Dark Cinema / cosmic
theater** visual style: a drifting starfield and golden dust, a 3D
projector-beam cinema screen with letterboxing, floating genre and
choice panels that hover and face the camera, a procedural spinning
film-reel loading indicator, and subtle pointer-parallax camera motion.

## Getting started

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local and paste your Gemini API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). A WebGL-capable
browser is required (any modern desktop or mobile browser works).

Get a Gemini API key at https://aistudio.google.com/apikey.

## ⚠️ If Gemini requests get rejected as "unsupported region"

This is not a bug in the code — Google's Gemini API (AI Studio keys) is
only available from a specific list of countries, and it currently does
**not** include Uzbekistan. The check happens on Google's side, based on
the IP address of whatever server calls `generativelanguage.googleapis.com`.
Check the live list here: https://ai.google.dev/gemini-api/docs/available-regions

Since the Gemini call happens **server-side**, in `/api/generate-scene`
(never from the visitor's browser), the fix is to deploy the app itself to
a host with servers in a supported region — for example Vercel, whose
serverless functions default to a US region. Once deployed there, the
API call reaches Google from that server's IP, not from Uzbekistan, and
the block no longer applies. This is standard practice for any app with
geo-restricted upstream APIs, not a workaround — running `npm run dev`
locally in an unsupported country will still hit the block, since your
own machine's IP is what's calling Google.

If you see a different error (invalid key, quota, malformed JSON from the
model), that's unrelated to region — check the message text returned by
`/api/generate-scene`, which is surfaced directly in the UI.

## Project structure

```
app/
  layout.tsx                Root layout, fonts, metadata
  page.tsx                  App state (genre, scene, history) + mounts CinemaCanvas
  globals.css                Cinema chrome: grain overlay, sprocket rails
  api/
    generate-scene/
      route.ts               POST endpoint: validates input, calls Gemini
components/
  FilmFrame.tsx               Sprocket-rail + grain overlay (2D chrome, outside the canvas)
  three/
    CinemaCanvas.tsx          Canvas root: lighting, fog, switches galaxy ↔ stage
    CameraRig.tsx             Eases camera between framings + pointer parallax
    StarField.tsx             Drifting starfield + golden dust + fog
    FilmReelMesh.tsx          Procedural 3D film reel (used as icon + loader)
    LoadingReel3D.tsx         Spinning reel + rotating status line while generating
    GenreGalaxy.tsx           8 genres as floating, camera-facing 3D panels
    ScreenStage.tsx           3D cinema screen: projector beam, letterbox, scene text
    ChoiceOrbs.tsx            Option A/B 3D panels + custom text console
lib/
  types.ts                   Shared TypeScript types
  genres.ts                  Genre catalogue (Uzbek + English labels)
  gemini.ts                  Gemini client, prompt construction, JSON parsing
```

## How the "No-Repeat" engine works

Every request to `/api/generate-scene` sends the model:

1. The selected genre.
2. The **entire history** of prior scenes and the choices made after each one.
3. A per-session random seed, generated once in the browser when a genre is
   picked, used purely as a creative-entropy nudge (never shown to the user).

The system instruction explicitly forbids repeating any theme, location,
character name, or plot beat found in that history, and the model is called
with a high temperature/top-p and `responseMimeType: "application/json"` so
responses are both varied and structurally reliable.

## How the 3D layer is built

- `CinemaCanvas` mounts a single `<Canvas>` and switches between two
  "worlds" — `GenreGalaxy` (genre picking) and `ScreenStage` + `ChoiceOrbs`
  (the story) — based on whether a genre is selected. `CameraRig` eases the
  camera between the two framings every frame and adds a small
  pointer-parallax offset, so the scene feels responsive without a free-fly
  orbit that could disorient a guided narrative.
- Genre and choice panels are real 3D meshes (`RoundedBox` + emissive
  material) with `drei`'s `<Html transform>` for crisp, readable labels that
  scale and move with the 3D object they're attached to.
- The custom-text input and its submit button use non-`transform` `<Html>`
  (screen-space, anchored to a 3D point) instead — this keeps the real
  `<input>` fully usable with mobile keyboards and screen readers, which is
  hard to guarantee with a perspective-transformed DOM node.
- `CinemaCanvas` is loaded via `next/dynamic` with `ssr: false`, since WebGL
  requires a browser; a lightweight text fallback shows while the 3D chunk
  loads.
- 2D chrome — the sprocket-hole rails, film-grain overlay, and the "back to
  genres" / "retry" buttons — stays outside the `<Canvas>` as plain HTML,
  since it's meta-navigation rather than part of the 3D story world.

## Notes

- `imagePrompt` in each scene response is a ready-to-use cinematic prompt
  string (English, genre-styled) meant for a downstream image/video
  generation model — currently shown as a caption under the scene text;
  wire it into an image/video provider inside `ScreenStage.tsx` (e.g. as a
  texture on the screen plane) if you want rendered visuals instead.
- The API route validates all input and never trusts the client for
  anything beyond what's echoed back into the prompt.
- Performance: the scene targets mid-range mobile GPUs (capped `dpr`,
  moderate particle counts). If you add heavier assets (real 3D models,
  textures), consider `<Suspense>` boundaries with `useGLTF.preload` and
  testing on a mid-tier Android device.
