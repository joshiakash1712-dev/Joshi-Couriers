# Taste-Skill — Design Taste for AI Coding Agents

This project strictly adheres to **Leonxlnx/taste-skill (v2)** to guarantee high-craft, anti-slop frontend craftsmanship across all features, components, and user interfaces.

---

## 0. Sub-Skills Index & Decision Logic

When handling frontend tasks, select the corresponding sub-skill behavior:

| Sub-skill | Focus & Trigger | Core Application |
|---|---|---|
| **design-taste-frontend** *(default)* | New landing pages, portals, feature additions | Brief inference, Three Dials, em-dash ban, anti-slop rules, pre-flight check |
| **redesign-skill** | Upgrading an existing project | Audit first (Scan ➔ Diagnose ➔ Fix) without breaking current functionality |
| **output-skill** | All code output & implementations | Absolute ban on `// ...`, `// TODO`, `/* ... */`, and all truncated code |
| **gpt-taste** | Elite Awwwards-level frontend + GSAP | Premium, deterministic, anti-slop UI with high-framerate motion curves |
| **image-to-code-skill** | Screenshot or image reference | Deep layout & visual hierarchy extraction before implementation |

---

## 1. Brief Inference & The "Design Read"

Before generating or modifying any UI, formulate a one-line **Design Read**:
> *"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."*

- **Read the room**: Identify page type (commercial portal, B2B courier service, sender tracking), audience (Jalna merchants, shopkeepers, operations staff), and quiet constraints (speed, trust, mobile 44px touch targets).
- **Anti-Default Discipline**: Do NOT default to generic AI-purple gradients, centered hero on dark mesh, identical 3-column cards with stacked icons, ungrounded glassmorphism, or lazy Inter + slate-900 palettes.

---

## 2. The Three Dials

Calibrate layout, motion, and density through the three dials:

- **DESIGN_VARIANCE** (1 = Perfect Symmetry, 10 = Artsy Chaos) — *Baseline: 7–8*
- **MOTION_INTENSITY** (1 = Static, 10 = Cinematic / Physics) — *Baseline: 5–6*
- **VISUAL_DENSITY** (1 = Art Gallery / Airy, 10 = Cockpit / Packed Data) — *Baseline: 4–5*

For this B2B daily logistics courier platform:
- **DESIGN_VARIANCE: 7** (high asymmetric rhythm, distinct functional modules)
- **MOTION_INTENSITY: 5** (subtle, high-performance GSAP / layout transitions, no blank gaps)
- **VISUAL_DENSITY: 5** (compact operational parcel data, clear scanning hierarchy)

---

## 3. Global Em-Dash Ban

**Do NOT use em-dashes (—) anywhere in rendered UI copy.**
- Applies to all headings, body text, badges, status chips, buttons, labels, and meta descriptions.
- Replace with a colon, comma, hyphen (-), period, or natural sentence phrasing.

---

## 4. Anti-Slop Directives (Hard Failures)

- **Color & Effects**:
  - No purple-to-blue generic gradient fills or gradient text.
  - No cyan-on-dark text and no arbitrary glowing dark-mode drop-shadows.
  - Neutrals must use calibrated undertones (slate/zinc/stone) with WCAG AA compliance (4.5:1 minimum text contrast).
- **Layout & Composition**:
  - No identical 3-column feature grids with centered icons and 2-line descriptions.
  - No nested cards (cards inside cards). Use clean negative space, typographic scale, and hairline dividers.
  - No side-tab accent borders competing with rounded corners.
- **Copywriting**:
  - Ban generic AI verbs and buzzwords (*"supercharge"*, *"empower"*, *"seamless"*, *"next-gen"*, *"unleash"*).
  - Use grounded, direct, human language tailored to the actual domain (e.g., Jalna–Partur morning corridor, vehicle MH21 V 6370, Anant Joshi & Akash Joshi direct handover).
  - No fake round numbers (`99.99%`, `$100.00`). No exclamation marks in success banners.

---

## 5. Architectural & Coding Standards

- **Viewport Stability**:
  - NEVER use `h-screen` for full-height views. ALWAYS use `min-h-[100dvh]` to prevent layout jumping on mobile Safari/Chrome address bars.
- **Typography**:
  - Minimum body font size 16px (1rem), line-height 1.5–1.7, column width constrained to 65–75 characters.
  - Badges, pills, chips, and button labels must stay on a single line (`whitespace-nowrap`) with 2x horizontal padding.
- **Nested Border Radius Formula**:
  - $\text{Inner Radius} = \text{Outer Radius} - \text{Padding}$. Never mix mismatched radii.
- **Iconography**:
  - Use standard vector icons (`lucide-react`). Never hand-roll SVG icon paths. Maintain consistent stroke width across the interface.
  - No raw emoji in code, markup, or visible text unless explicitly requested.
- **Motion & Lifecycle**:
  - Wrap all GSAP animations in `matchMedia('(prefers-reduced-motion: no-preference)')`.
  - Zero Blank Flashes: Never hide critical UI with `autoAlpha: 0` or fragile scroll triggers. Content must be 100% visible immediately.
  - Always clean up animations using `useGsapContext` or `gsap.context()` with `ctx.revert()`.

---

## 6. Output-Skill Enforcement (Complete Output Only)

- **Absolute Prohibition**:
  - Never emit `// ...`, `// rest of code`, `// implement here`, `// TODO`, `/* ... */`, or truncated code blocks.
  - Never write "let me know if you want me to continue" or omit sections for brevity.
- **Full Implementation**:
  - Every component, handler, modal, and utility must be provided completely with robust loading, empty, active, and error states.

---

## 7. Pre-Flight Checklist

Before completing any task, verify:
- [ ] One-line Design Read established.
- [ ] Three Dials evaluated and respected.
- [ ] Zero em-dashes (—) in rendered UI copy.
- [ ] No generic AI cliches in copy or design.
- [ ] `min-h-[100dvh]` used for full-height sections instead of `h-screen`.
- [ ] Mobile touch targets $\ge 44\text{px} \times 44\text{px}$.
- [ ] Smooth accessibility: `prefers-reduced-motion` respected, zero blank flash.
- [ ] Complete code with zero truncation or `// TODO` placeholders.
