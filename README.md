# prajjwalsilwal.github.io

Portfolio of **Prajjwal Silwal** — Automation & Data Platform Engineer, Monroe LA.

🌐 **Live**: [prajjwalsilwal.github.io](https://prajjwalsilwal.github.io)

The site is one continuous dark WebGL world the visitor travels through on scroll. Each
section is a location the camera flies to: the hero constellation, a flight along the six
stages of the Braud Data Platform, a gallery of floating project monoliths, and a closing
contact portal. Case studies are chaptered scenes inside that same world rather than
separate articles.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # static export to ./out
npm run typecheck    # tsc --noEmit
```

There is no server in production — `next build` writes a fully static site to `out/`.

## The FX_LEVEL toggle

`NEXT_PUBLIC_FX_LEVEL` sets the **ceiling** for visual fidelity. The runtime probe in
[`src/world/fx.ts`](src/world/fx.ts) can lower it but never raise it.

| Value  | What renders |
| ------ | ------------ |
| `full` | Everything — 24k particles, pipeline nodes, monoliths, portals, bloom + chromatic aberration + vignette + noise. The default. |
| `lite` | Particle backdrop only at 4k particles, no post-processing, no scene geometry. |
| `off`  | No WebGL at all. The site renders as a plain, compact HTML document. |

```bash
NEXT_PUBLIC_FX_LEVEL=lite npm run dev
NEXT_PUBLIC_FX_LEVEL=off  npm run build
```

The probe **automatically downgrades** to `lite` on coarse-pointer devices, viewports under
900px, 4-or-fewer CPU cores, or ≤4GB reported memory — and all the way to `off` when the
user has `prefers-reduced-motion: reduce` set or WebGL is unavailable.

**Every tier shows the same content.** The world is decoration layered over a complete
semantic document; it is never the only way to reach a fact or a link.

## How it fits together

```
src/
  content/          Single source of truth for every real fact on the site
    profile.ts        identity, bio, contact, hero + scale stats, JSON-LD
    platform.ts       the 6 pipeline stages, 8 product surfaces, architecture manifest
    work.ts           7 projects; 5 of them carry a full case study
    resume.ts         experience, skills, education, certifications
    nav.ts            nav items, loader copy
  world/            The engine
    fx.ts             tier resolution + per-tier budgets
    World.tsx         the single persistent <Canvas>
    CameraRig.tsx     flies the camera along a beat curve against scroll
    locations.ts      the camera journey (home + per-case-study)
    layout.ts         where nodes, monoliths and portals physically sit
    ParticleField.tsx one GPU-morphing particle system for the whole site
    formations.ts     the shapes the field morphs between
    scrollStore.ts    scroll state, deliberately outside React
  scenes/           3D contents (stage nodes, streams, monoliths, portals, markers)
  sections/         The HTML overlay — hero, platform, work, about, …
  components/       Nav, Loader, Section, Reveal, Counter, Footer
```

Two rules hold the thing together:

1. **Content lives in `src/content/`, never in a component.** The 3D scene and the HTML
   both read from it, so a stat rendered in the world can't disagree with the stat in the
   text.
2. **Scroll state lives outside React.** [`scrollStore.ts`](src/world/scrollStore.ts) is a
   plain mutable object read per-frame by the camera and particles. Putting it in component
   state would re-render the tree on every scroll event.

### Performance notes

- All particle buffers are preallocated to the FX budget; the frame loop allocates nothing.
- Formation changes swap two buffer attributes and animate a single `uMix` uniform — the
  morph runs on the GPU, and a rebuild happens a handful of times per session.
- The pipeline flow curve is baked into a float texture and sampled in the vertex shader,
  so animating thousands of streaming particles costs zero CPU per frame.
- `dpr` is capped at `[1, 2]`; the render loop stops entirely when the tab is hidden.

### A constraint worth knowing before you edit

`@react-three/fiber` v8 reaches into React 18 internals that don't exist during a server
render, so importing any three.js code into the prerender **crashes the build**. Every
entry into the 3D layer therefore goes through a `dynamic(..., { ssr: false })` boundary —
see `src/scenes/HomeWorldMount.tsx` and `src/scenes/CaseWorldMount.tsx`. Add new scene code
underneath those, not alongside the sections.

## Deploying

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the static export and publishes `out/` to GitHub Pages.

> **One-time setup:** in **Settings → Pages**, set **Source** to **GitHub Actions**. The
> repo previously served raw files from the branch root; the workflow will not take effect
> until that is switched.

`public/.nojekyll` is required — without it, Pages' Jekyll step strips the `_next/`
directory and the site 404s on all of its assets.

## Content and URL preservation

The rebuild kept every fact, demo and link from the previous static site:

- Interactive demos still live at their original URLs — `/braud_demo_master/demo/`,
  `/projects/lead-intelligence/demo/`, `/projects/diagnostic-dashboard/demo/`.
- The old case-study URLs (`/projects/braud-pipeline/` and friends) now serve redirect
  stubs pointing at their new `/work/<slug>/` homes, so existing links and search results
  keep working.
- Notebook and analysis directories moved under `public/projects/…`, and the GitHub links
  in `work.ts` were updated to match. **Those `tree/main/public/projects/…` links only
  resolve once this work is merged to `main`.**

## Where to raise the fidelity

Search the source for `TODO:` — each marks a place where a placeholder should be swapped
for a real asset:

- `src/scenes/StageNodes.tsx` — sprite halos → volumetric light shafts or GLTF node models
- `src/scenes/Monoliths.tsx` — flat slabs → GLTF panels with real refraction
- `src/scenes/ChapterMarkers.tsx` — primitives → per-project models
- `src/world/bootStore.ts` — register real asset downloads as loader milestones

## Stack

Next.js 15 (App Router, static export) · React 18 · TypeScript · Tailwind CSS ·
three.js · @react-three/fiber · @react-three/drei · @react-three/postprocessing ·
Lenis · GSAP ScrollTrigger

## License

© 2026 Prajjwal Silwal. All rights reserved.
