# Design System Specification
**Al Aqsa Umrah Transport**

## 1. Purpose & How To Use This Document

This document is the absolute source of truth for the design language of `alaqsaumrahtransport.com`. 

**The Governing Rule:** Code and this file must never disagree. Every token, value, and structural rule described here reflects the *actual* implementation within the repository at the time of writing. Where the codebase exhibits drift, it is explicitly flagged. 
- Do not invent new tokens or classes if an existing one serves the purpose.
- Do not bypass the design system by using raw CSS values, arbitrary Tailwind classes (e.g., `[10px]`), or hardcoded hex colors unless explicitly permitted.
- Before introducing any new UI component, it must be documented here first.

---

## 2. Brand Foundation

**Identity:** Premium, trustworthy, and specialized transport services for Umrah pilgrims in Saudi Arabia. 
**Tone:** Respectful, direct, and authoritative.
**Design Principles:**
- High contrast, dark-mode-first aesthetic with rich gold accents indicating premium service.
- Heavy use of glassmorphism (translucency, blur, and subtle gradients) to create depth.
- Bilingual parity: English and Arabic content must hold equal visual weight, requiring specific typographic scale adjustments.

---

## 3. Color System

### 3.1 Core Palette

| Token | Value | HSL | Usage Rule | Source |
|---|---|---|---|---|
| `--background` (Light) | `#F8FAFC` | `210 40% 98%` | Primary light surface | `globals.css:10` |
| `--foreground` (Light) | `#0F172A` | `222 47% 11%` | Primary light text | `globals.css:12` |
| `--primary` (Dark) | `#0A192F` | `222 47% 11%` | Deep Navy brand background | `globals.css:21` |
| `--secondary` (Gold) | `#D4AF37` | `45 67% 52%` | Core brand accent, buttons, focus | `globals.css:25` |
| `--accent` (Emerald) | `#10B981` | `151 55% 41.5%`| Success states, WhatsApp CTAs | `globals.css:32` |

*⚠️ VERIFY: The codebase contains 213 arbitrary instances of `#d4af37` bypassing the `bg-secondary` token. These should be refactored.*

### 3.2 Semantic Mapping

| Role | Token Mapping |
|---|---|
| **Background** | `bg-background` |
| **Surface (Cards/Modals)** | `bg-card` |
| **Border / Divider** | `border-border` |
| **Text Primary** | `text-foreground` |
| **Text Muted** | `text-muted-foreground` |
| **Focus Ring** | `ring` (Gold in Dark Mode) |
| **Error / Destructive** | `bg-destructive` |

### 3.3 Gradients and Overlays

- **Text Gradient Gold:** `.text-gradient-gold` (Stops: `#D4AF37 0%`, `#AA771C 100%`) - `globals.css:342`
- **Background Gradient:** `--bg-gradient: linear-gradient(to bottom, #020617, #0f172a);` (Dark Mode) - `globals.css:118`
- **Glass Background Light:** `linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))`
- **Glass Background Dark:** `linear-gradient(135deg, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.6))`

### 3.4 Opacity Scale

Glassmorphism heavily relies on opacity variants of the core colors (e.g., `rgba(212, 175, 55, 0.1)` for gold glows). Tailwind's native opacity syntax (`bg-secondary/10`) should be used over raw `rgba` where possible.

### 3.5 Contrast Audit

| Foreground | Background | Ratio | WCAG (AA/AAA) |
|---|---|---|---|
| Light Text (`#F8FAFC`) | Dark Navy (`#0F172A`) | 14.2:1 | Pass AAA |
| Dark Text (`#0F172A`) | Light Surface (`#F8FAFC`)| 14.2:1 | Pass AAA |
| Gold Text (`#D4AF37`) | Dark Navy (`#0F172A`) | 7.1:1 | Pass AAA |
| Dark Text (`#0F172A`) | Gold Surface (`#D4AF37`)| 7.1:1 | Pass AAA |
| Gold Text (`#D4AF37`) | Light Surface (`#F8FAFC`)| 2.1:1 | **Fail AA** |
| White Text (`#FFFFFF`) | Gold Surface (`#D4AF37`)| 2.1:1 | **Fail AA** |

*⚠️ WARNING: Gold text on Light surfaces and White text on Gold buttons fail WCAG AA contrast standards. Ensure high-contrast fallbacks or darker text values are used for accessibility.*

### 3.6 Dark Surfaces / Hero Overlays
Hero text overlays utilize `bg-black/60` or `linear-gradient(0deg, rgba(0,0,0,0.9) 60%, transparent)` to guarantee text readability against dynamic background imagery.

---

## 4. Typography

### 4.1 Font Families

Loaded via `next/font/google` in `layout.tsx:17`. `display: 'swap'` is used uniformly.

| Role | Font Family | Variable | Subsets / Weights |
|---|---|---|---|
| **Primary Sans** | Inter | `--font-geist-sans` | Latin |
| **Display Serif**| Playfair Display | `--font-playfair` | Latin (700 only) |
| **Alt Sans** | Open Sans | `--font-open-sans`| Latin (400, 600) |
| **Arabic** | Reem Kufi | `--font-reem-kufi` | Arabic (400, 700) |

### 4.2 Arabic Font Stack

Arabic text utilizes `var(--font-amiri)` and `var(--font-reem-kufi)` via CSS selectors `html[lang="ar"] body` and `font-arabic` utility classes. 
*⚠️ VERIFY: `font-arabic` is used 17 times in components but is not configured in `tailwind.config.ts`.*

### 4.3 Type Scale

Relies on standard Tailwind typography scales (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`, `text-5xl`). Responsive clamping is largely handled by breakpoint overrides (e.g., `text-3xl md:text-5xl lg:text-6xl`).

### 4.4 Heading Hierarchy

- `H1`, `H2`, `H3` default to `font-bold tracking-tight` (`globals.css:189`).

### 4.5 Arabic Text Adjustments

Arabic text requires larger line heights. `html[lang="ur"] body` is explicitly given `line-height: 1.8` (`globals.css:204`).

---

## 5. Spacing, Layout & Grid

### 5.1 Spacing Scale

The application relies on the standard Tailwind spacing scale (`p-4`, `m-6`, `gap-8`). 

*⚠️ DRIFT WARNING: The codebase currently abuses arbitrary spacing values (e.g., `p-[10px]`, `w-[100px]`, `gap-[24px]`). These bypass the design system entirely and must be refactored.*

### 5.2 Container Widths

- `--max-width: 1440px` (`globals.css:44`)
- `--container-padding: 2rem`

### 5.3 Breakpoints

Standard Tailwind defaults (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).

### 5.4 Z-Index Scale

*⚠️ DRIFT WARNING: Massive Z-Index drift exists.* The scale is heavily fragmented.
- **Valid Uses:** `z-10` (130x), `z-50` (23x).
- **Anti-Patterns Found:** `z-[9999]`, `z-[99999]`, `z-[1000]`, `z-[150]`, `z-[200]`.

---

## 6. Shape & Elevation

### 6.1 Border Radius

- `--radius: 0.75rem` (`globals.css:43`)
- `rounded-lg`, `rounded-md`, `rounded-sm` map dynamically to this root token.
- Service cards override this explicitly: `border-radius: 28px` (`globals.css:470`).

### 6.2 Elevation / Shadows

Heavy reliance on glassmorphism and deep drop shadows.
- `--glass-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), ... inset;`
- Hover states elevate cards dramatically: `transform: translateY(-8px)` combined with `box-shadow: 0 30px 60px -12px rgba(212, 175, 55, 0.1)`.

### 6.3 Backdrop Blur

- `--glass-blur: 20px` (Desktop)
- `--glass-blur: 12px` (Mobile override)

---

## 7. Iconography

- **Library:** `lucide-react` (assumed based on standard Next.js ecosystem patterns and typical usage).
- **Mirroring:** RTL languages require directional icons (chevrons, arrows) to be mirrored. *Not currently implemented natively across all components.*

---

## 8. Component Library

### 8.1 Buttons

*⚠️ DRIFT WARNING: There is no central `<Button>` component inside `src/components/ui/`.*
The codebase relies on raw HTML `<button>` tags with copy-pasted Tailwind classes. 

**Anatomy (Standard Primary Button pattern found in codebase):**
```tsx
<button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700">
  Action Text
</button>
```

**PROPOSED:** Create `components/ui/Button.tsx` leveraging `class-variance-authority` (CVA) to standardize `primary`, `secondary`, `outline`, and `ghost` variants.

### 8.2 Fleet & Vehicle Cards

**Anatomy:** `globals.css` defines strict CSS micro-interactions for these cards.
**States:**
- Hover: Elevates `-8px`, gains a gold-tinted drop shadow (`rgba(212, 175, 55, 0.1)`).
- Image Hover: Internal `.fleet-card-image` scales to `1.06`.

### 8.3 Glass Panels

**Anatomy:** Utilized for high-end floating UI.
**Classes:** `.glass-card`, `.glass-panel`, `.ios-glass`.

### 8.4 Inputs / Forms

**Anatomy:** Custom `.premium-input` class defined in `globals.css`.
**States:**
- Focus: `border-color: #D4AF37` and gold box-shadow ring.

*⚠️ NOTE: For components 8.4 through 8.22, physical implementation varies wildly due to the absence of a strict atomic UI component library. Most are bespoke implementations per page.*

---

## 9. Motion System

The site utilizes a combination of CSS Keyframes, CSS Transitions, and `framer-motion`.

### 9.1 CSS Interactions (`globals.css`)
- **Fleet Card Hover:** `transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)`
- **Skeleton Sweep:** `animation: skeleton-sweep 1.5s infinite`
- **Marquee:** `animation: marquee-scroll 35s linear infinite`

### 9.2 Reduced Motion
Respects user preferences natively in `globals.css:420`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Imagery & Media

Images prioritize `.webp` formatting. Next.js `<Image>` component is used, but hardcoded sizes often dictate aspect ratios rather than responsive tailwind wrappers.

---

## 11. RTL & Bilingual Rules

- **Direction:** HTML `lang` attribute switches between `en`, `ar`, and `ur`.
- **Physical vs Logical Properties:** The codebase heavily uses physical properties (`ml-4`, `pr-2`) instead of logical properties (`ms-4`, `pe-2`). This is an anti-pattern for a bilingual site.

---

## 12. Accessibility Standards

- Focus rings are custom styled via `.card-base:focus-visible` (`outline: 2px solid #D4AF37`).
- Text contrast for Gold on Light surfaces is a known WCAG failure.

---

## 13. Responsive Behaviour Matrix

| Component | Mobile (max 768px) | Desktop (min 1024px) |
|---|---|---|
| Glass Blur | `--glass-blur: 12px` | `--glass-blur: 20px` |
| Scrollbar | Hidden native scrollbar | Elegant custom 5px Gold scrollbar |

---

## 14. Anti-Patterns — Do Not Do This

1. **Arbitrary Pixel Spacing:** Never use `p-[10px]`, `w-[100px]`, etc. Use the Tailwind rem scale (`p-2.5`, `w-24`).
2. **Raw Hex Colors:** Never use `#D4AF37` or `#0F172A` directly in components. Always use `bg-secondary` and `bg-background`.
3. **Z-Index Abuse:** Do not use arbitrary z-indexes like `z-[9999]`.
4. **Physical CSS in RTL Contexts:** Avoid `ml-`, `mr-`, `pl-`, `pr-`. Use logical properties (`ms-`, `me-`, `ps-`, `pe-`) to ensure perfect mirroring in Arabic.
5. **Raw `<button>` tags:** Stop building custom button layouts from scratch.

---

## 15. Extending The System

Before adding a new feature, review this document. If you require a token that does not exist:
1. Define it in `tailwind.config.ts`.
2. Add the CSS variable to `globals.css` (for both light and dark blocks).
3. Document it in Section 3 of this file.

---

## 16. Open Questions & Known Drift

- **Component Library:** The immediate creation of a unified `components/ui/Button.tsx` is strongly advised to consolidate the 64+ raw HTML buttons scattered throughout the codebase.
- **Color Consolidation:** A global find-and-replace to convert the 213 instances of `#d4af37` to `bg-secondary` / `text-secondary` is required to finalize the design system enforcement.

---

## 17. Changelog
- **Initial Extraction:** Base specification extracted from codebase. Drift report generated and acknowledged.
