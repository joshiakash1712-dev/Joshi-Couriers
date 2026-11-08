---
name: frontend-design-taste
description: Senior Frontend Design & Taste Engineering Toolkit (v2). Enforces dial-driven aesthetic variance, strict anti-slop rules (including complete em-dash ban), mathematical typographic scale, cohesive color & shape locking, and fluid Motion/React animations.
metadata:
  version: 2.0.0-experimental
  taste-engine: v2-core
---

# Frontend Design Taste & Craft Toolkit (v2)

A comprehensive architectural and visual engineering standard for generating distinctive, production-grade web interfaces with high taste, optical rhythm, and zero generic AI clichés.

---

## Dial Matrix & Configuration

Every frontend design execution is calibrated across three core dials:

| Dial | Range | Description | Recommended Defaults |
|------|-------|-------------|----------------------|
| `DESIGN_VARIANCE` | 1 - 10 | 1 = Strict Corporate/Gov System; 5 = Polished Modern Commercial; 10 = Avant-Garde Editorial | **5-7** for High-Conversion Commercial/SaaS |
| `MOTION_INTENSITY` | 1 - 10 | 1 = Pure Static; 3 = Subtle Hover & Micro-fades; 7 = Orchestrated Staggers; 10 = Interactive Physics | **3-5** (Smooth, hardware-accelerated, respects reduced-motion) |
| `VISUAL_DENSITY` | 1 - 10 | 1 = High Negative Space/Luxury; 5 = Balanced Web App; 10 = Bloomberg/Dense Data Grid | **4-6** for Consumer & Regional Services |

---

## §0 Brief Inference & Anti-Default Read

Before writing frontend code, perform a rapid brief inference:
1. **Audience & Context**: Who uses this, in what environment, with what urgency?
2. **Typography Pairing**: Never default to plain system sans for both heading and body. Pair a characterful heading font (e.g., Poppins, Plus Jakarta Sans, Outfit, Cabinet Grotesk, Fraunces) with an ultra-legible body font (Manrope, DM Sans, Public Sans).
3. **Color Identity Lock**: Lock **one primary brand accent** and **one supportive functional accent**. Never swap accent hues between sections.

---

## §1 Hardened Anti-Slop Bans (Section 9 "AI Tells")

### §9.G Em-Dash Ban (Absolute)
- **Zero em-dashes (`—`) or html entities (`&mdash;`) anywhere on the page.**
- Forbidden in: Headlines, eyebrows, badges, pills, body copy, testimonials, FAQ accordions, buttons, alt text, meta tags, and footer copyright text.
- **Remedy**: Use a clean hyphen (`-`), bullet (`•`), slash (`/`), or restructure the sentence naturally.

### Additional Strict Bans:
- **No Section Number Eyebrows**: Ban arbitrary `01 // INTRODUCTION`, `002 · CAPABILITIES`. Use clear contextual titles.
- **No Decorative Fake Terminal / Div UI Slop**: Never construct fake macOS window dots (`red/yellow/green`) or pseudo-code blocks unless building an actual developer tool.
- **No Pills / Badges Overlaid on Images**: Keeps visual hierarchy clean and accessible.
- **No Broken Multi-Line Badges**: Every pill, chip, and badge text must fit on **ONE line** (`white-space: nowrap`).
- **No Arbitrary Glassmorphism or Cyan/Purple Neon Glows**: Use crisp border-opacity, mathematical shadows, and neutral contrast.
- **No List-Divider Overuse**: Avoid `border-t + border-b` on every row of long lists; use cards, grids, or clean spacing instead.

---

## §2 Layout Variance & Spacing Mathematics

1. **4+ Layout Families per Page**: A multi-section page must vary its structural rhythm (e.g., Hero Split → Metric Strip → Interactive Tabbed Suite → Bento Card Grid → Step Flow → Accordion → Anchored Bottom CTA).
2. **Container Padding Math**:
   - Outer container padding must always exceed or equal inner child gap spacing.
   - Mathematical Nested Radius Rule: `Inner Radius = Outer Radius - Padding`.
3. **Bento Cell Rule**: If displaying $N$ items, generate exactly $N$ fully functional cells. Never leave filler cells.

---

## §3 Motion & Micro-Interaction Standards

- **Primary Motion Library**: Standardize on `motion` (`import { motion } from 'motion/react'`).
- **Hardware Acceleration**: Animate only composite properties (`transform`, `opacity`). Never animate `top`, `left`, `width`, or `height`.
- **Accessibility & Reduced Motion**: Always respect `prefers-reduced-motion`.
- **No Scroll State Polling**: Never run custom `window.addEventListener('scroll')` loops that trigger React re-renders.

```tsx
// Canonical Enter Reveal Pattern in Motion (motion/react)
import { motion, useReducedMotion } from 'motion/react';

export const RevealCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};
```

---

## §4 WCAG AA Contrast & Polish Checklist

- [ ] **Contrast**: All body text $\ge$ 4.5:1, bold/large text $\ge$ 3.0:1.
- [ ] **Buttons**: Button horizontal padding is exactly $2\times$ vertical padding (e.g., `px-6 py-3`).
- [ ] **Zero Em-Dashes**: Scanned and verified zero `—` occurrences.
- [ ] **Responsive Touch Targets**: Minimum 44px on touch screens.
- [ ] **Forms & Inputs**: Explicit labels, clear focus rings (`ring-2 ring-primary/30`), and accessible keyboard navigation (`ArrowUp/Down`, `Enter`, `Escape`).

---

## §5 Final Pre-Flight Release Gate

Before marking a frontend turn complete:
1. Did you inspect typography for orphaned descenders and clipping?
2. Are all interactive triggers (search dropdowns, modals, tabs, calculators) fully reactive with error-free handlers?
3. Is color and corner radius strictly unified across every component?
4. Did you run `lint_applet` and `compile_applet` to guarantee green compilation?
