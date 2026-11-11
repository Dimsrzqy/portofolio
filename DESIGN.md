# DESIGN.md — Portfolio Design System & Guidelines

> **Mandatory Rule for AI Coding Assistants**: Whenever you receive a prompt involving UI, layout, styling, components, colors, typography, or interaction design in this codebase, you **MUST** read and adhere strictly to this document before generating or editing code.

---

## 1. Brand Identity & Design Philosophy

- **Persona**: Dimas — Web Developer & Software Engineer (Informatics Management, Politeknik Negeri Jember).
- **Core Aesthetic**: Modern Neo-Brutalist Pop-Comic Minimalism with tactile precision.
- **Tone**: Energetic, playful yet deeply professional, structured, and communicative.
- **Comic-Inspired Theme Motifs**:
  - **Solid Ink Borders**: Crisp 2px solid outlines (`border-2 border-zinc-950 dark:border-zinc-700`) reminiscent of comic panels.
  - **Hard Offset Block Shadows**: Physical offset drop shadows (`shadow-[4px_4px_0px_0px_#09090b]` in light mode; `dark:shadow-[4px_4px_0px_0px_rgba(99,102,241,0.65)]` in dark mode) replacing blurry AI glow effects.
  - **Tactile Button Press**: Realistic mechanical press interaction (`active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`).
  - **Speech Bubble & Sticker Badges**: Dialogue callout balloon on the hero badge, subtle badge rotations (`rotate-1`, `rotate-[-2deg]`), and comic sticker pins.
  - **Halftone Dot Texture**: Subtle retro comic print canvas (`.comic-halftone`) providing tactile warmth without compromising readability.
  - **Chapter Headers**: Section demarcations styled as comic logs (`CHAPTER 01 // ORIGIN`, `CHAPTER 02 // ARSENAL`, `CHAPTER 03 // MISSIONS`, `CHAPTER 04 // LOGBOOK`, `TRANSMISSION // OPEN FREQUENCY`).
- **Philosophy (Anti-Slop Craft)**:
  - Every visual technique must pass the purpose test.
  - Zero generic AI glowing purple-blue fog orbs or fuzzy rainbow gradients.
  - Strict palette discipline: Clean Zinc neutrals + deliberate **Indigo** brand accent.

---

## 2. Color System & Design Tokens

This project uses **Tailwind CSS v4** with CSS variable tokens defined in `src/app/globals.css`. It features full **Light Mode** and **Dark Mode** support via `next-themes`.

### 2.1 Color Tokens

| Token | Light Mode (`:root`) | Dark Mode (`.dark`) | Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `#fbfbfd` (Off-white comic paper) | `#09090c` (Obsidian ink dark) | Page background |
| `--foreground` | `#09090b` (Deep ink black) | `#fafafa` (Bright comic paper) | Primary text |
| `--card` | `#ffffff` (Pure white comic cell) | `#121217` (Elevated ink cell) | Card & panel containers |
| `--card-foreground` | `#09090b` | `#fafafa` | Card text |
| `--primary` | `#6366f1` (Indigo 500) | `#6366f1` (Indigo 500) | Primary brand accent |
| `--primary-foreground` | `#ffffff` | `#ffffff` | Text on primary brand |
| `--secondary` | `#f4f4f5` (Zinc 100) | `#18181b` (Zinc 900) | Subtle secondary surface |
| `--muted` | `#f4f4f5` | `#18181b` | Inactive elements / tags |
| `--muted-foreground` | `#71717a` (Zinc 500) | `#a1a1aa` (Zinc 400) | Metadata / secondary text |
| `--border` | `#18181b` (Solid dark ink) | `#3f3f46` (Zinc 700 / 800) | Panel dividers & borders |
| `--input` | `#18181b` | `#3f3f46` | Form input border |
| `--ring` | `#6366f1` (Indigo 500) | `#6366f1` (Indigo 500) | Accessible focus outline |

### 2.2 Comic Shadows & Halftone Classes (`src/app/globals.css`)

```css
/* Halftone Dots Background */
.comic-halftone {
  background-image: radial-gradient(rgba(99, 102, 241, 0.12) 1.2px, transparent 1.2px);
  background-size: 18px 18px;
}
.dark .comic-halftone {
  background-image: radial-gradient(rgba(99, 102, 241, 0.16) 1.2px, transparent 1.2px);
  background-size: 18px 18px;
}

/* Comic Panel */
.comic-panel {
  border: 2px solid #09090b;
  box-shadow: 4px 4px 0px 0px #09090b;
}
.dark .comic-panel {
  border: 2px solid #52525b;
  box-shadow: 4px 4px 0px 0px rgba(99, 102, 241, 0.65);
}

/* Small Comic Panel */
.comic-panel-sm {
  border: 2px solid #09090b;
  box-shadow: 2.5px 2.5px 0px 0px #09090b;
}
.dark .comic-panel-sm {
  border: 2px solid #52525b;
  box-shadow: 2.5px 2.5px 0px 0px rgba(99, 102, 241, 0.5);
}

/* Tactile Comic Button */
.comic-btn {
  border: 2px solid #09090b;
  box-shadow: 3px 3px 0px 0px #09090b;
}
.dark .comic-btn {
  border: 2px solid #e4e4e7;
  box-shadow: 3px 3px 0px 0px #ffffff;
}
.comic-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px 0px transparent !important;
}
```

### 2.3 Semantic Accent Palette

- **Brand Accent (Indigo)**:
  - Button primary: `bg-indigo-600 text-white hover:bg-indigo-700`
  - Badges & highlights: `bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-600 dark:border-indigo-400`
  - Subtle dark mode shadows: `dark:shadow-[4px_4px_0px_0px_rgba(99,102,241,0.65)]`
- **Featured Burst / Sticker (Amber & Indigo)**:
  - `bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider rounded-md border-2 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_#09090b] rotate-[-2deg]`
- **Success / Feedback (Emerald)**:
  - `border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 shadow-[2px_2px_0px_0px_#059669]`
- **Destructive / Error (Red)**:
  - `border-2 border-red-600 bg-red-50 dark:bg-red-950/50 text-red-900 shadow-[2px_2px_0px_0px_#dc2626]`

---

## 3. Typography & Text Hierarchy

We use Google's **Geist** font family (`geistSans` and `geistMono`) with optimized OpenType features:
`font-feature-settings: "cv02", "cv03", "cv04", "cv11"`.

### 3.1 Type Scale

| Level | Desktop Classes | Mobile Classes | Weight & Leading | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `text-5xl lg:text-7xl` | `text-4xl sm:text-6xl` | `font-black tracking-tight leading-[1.05]` | Main comic headline |
| **Section Title** | `text-3xl sm:text-5xl` | `text-2xl sm:text-3xl` | `font-black tracking-tight leading-tight` | Section headers |
| **Chapter Marker** | `text-xs` | `text-xs` | `font-mono font-bold uppercase tracking-wider` | Chapter / log badges |
| **Subtitle / H3** | `text-xl sm:text-2xl` | `text-lg` | `font-bold tracking-tight text-zinc-700 dark:text-zinc-300` | Section subtitles |
| **Card Header** | `text-lg sm:text-xl` | `text-base` | `font-black tracking-tight` | Project & mission titles |
| **Body Primary** | `text-base sm:text-lg` | `text-sm sm:text-base` | `font-normal leading-relaxed text-zinc-700 dark:text-zinc-300` | Bios, paragraphs, summaries |
| **Microcopy / Tag** | `text-[11px]` or `text-xs` | `text-[11px]` | `font-bold font-mono` | Tech stack, dates, statuses |

---

## 4. Layout, Spacing & Container Architecture

### 4.1 Grid & Containers
- **Main Max-Width**: `max-w-6xl mx-auto` (1152px max width for optimal layout structure).
- **Horizontal Page Gutters**: `px-4 sm:px-6` (16px on mobile, 24px on tablet/desktop).
- **Section Separators**: Bold 2px comic boundary: `border-t-2 border-zinc-950 dark:border-zinc-800 py-20 sm:py-28`.
- **Responsive Grids**:
  - Skills: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
  - Projects: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8`
  - Timeline & Split: `grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16`

### 4.2 Mobile Responsiveness Guardrails
- **No Horizontal Scroll**: Zero fixed pixel overflows; always wrap with `max-w-full`.
- **Touch Target Law**: All interactive elements (buttons, links, toggles, badges) must meet minimum `min-h-[44px] min-w-[44px]` touch target sizing on mobile devices.
- **Tactile Click**: All buttons retain a 1.5px/2px active press translation (`active:translate-x-0.5 active:translate-y-0.5`).

---

## 5. Component Design Standards

### 5.1 Buttons (`src/components/ui/button.tsx`)
- **Primary**: `.comic-btn bg-indigo-600 text-white hover:bg-indigo-700 font-bold uppercase tracking-wider`
- **Secondary**: `.comic-panel-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold uppercase`
- **Outline**: `border-2 border-zinc-950 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 font-bold`
- **Touch Target**: At least `min-h-[44px]` on mobile.

### 5.2 Comic Panels & Cards (`src/components/ui/card.tsx`)
- **Structure**: `.comic-panel rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden`
- **Hover Behavior**: Smooth lift with shadow expansion:
  `hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_0px_rgba(99,102,241,0.9)] transition-all duration-200`

### 5.3 Badges & Chapter Marks (`src/components/ui/badge.tsx`)
- **Chapter Badges**: `inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-850 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold uppercase tracking-wider rounded-md shadow-[2px_2px_0px_0px_#09090b]`
- **Tech Stack Badges**: `inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-950 dark:border-zinc-700 shadow-[1.5px_1.5px_0px_0px_#09090b]`
- **Sticker Burst**: `border-2 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_#09090b] rotate-[-2deg]`

### 5.4 Border Radius Scale
- `rounded-md` (6px): Tech badges, chapter markers, status chips, icon triggers.
- `rounded-lg` (8px): Navigation capsule, interactive buttons, text inputs.
- `rounded-xl` (12px): Feature boxes, stat counters.
- `rounded-2xl` (16px): Main comic panels, project cards, photo wrappers.

---

## 6. Motion & Interaction Standards

Animations must feel snappy, mechanical, and tactile. We use **Framer Motion**.

### 6.1 Standard Configurations
```tsx
// Active click / press
active:translate-x-0.5 active:translate-y-0.5 transition-all duration-150

// Section entry
initial={{ opacity: 0, y: 16 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5, ease: "easeOut" }}

// Staggered list items
transition={{ duration: 0.4, delay: index * 0.1 }}
```

### 6.2 Motion Rules
1. **Always `viewport: { once: true }`**: Elements animate once when scrolled into view.
2. **Subtle Offsets**: Y translations should not exceed 16px to maintain punchy stability.
3. **Reduced Motion**: Respect user accessibility preferences via CSS `motion-reduce:transition-none`.

---

## 7. Anti-Slop Forbidden Patterns (Hard Constraints)

- ❌ **NO Generic Purple-Blue/Rainbow AI Gradients**: No fuzzy multi-color washes across headers or backgrounds.
- ❌ **NO Glowing Fog Orbs**: No blurred radial gradient divs (`blur-3xl bg-purple-600/30 w-96 h-96`).
- ❌ **NO Indiscriminate Glassmorphism**: Surfaces stay solid like comic panels. Backdrop-blur is reserved strictly for the floating sticky navigation.
- ❌ **NO Pill-Shaped Overuse**: Avoid making cards, inputs, and primary buttons `rounded-full`.
- ❌ **NO Fluffy Soft Shadows**: Use crisp, tactile offset block shadows (`shadow-[4px_4px_0px_0px_...]`).
- ❌ **NO AI Boilerplate Copy**: Keep copy grounded in Dimas's real Informatics Management background at Politeknik Negeri Jember, technical skills, and verified projects.

---

## 8. AI Agent Pre-Flight Checklist

Before generating, editing, or evaluating any UI in this project, verify:
- [ ] Did I adhere to the Neo-Brutalist Pop-Comic styling (2px solid borders, hard offset shadows, halftone texture)?
- [ ] Does the UI render with perfect contrast in both Light Mode (`#fbfbfd`) and Dark Mode (`#09090c`)?
- [ ] Is the primary accent strictly **Indigo** (`#6366f1`)?
- [ ] Are all mobile touch targets at least 44x44px (`min-h-[44px] min-w-[44px]`)?
- [ ] Is there zero horizontal scroll on small viewports (320px–375px)?
- [ ] Are focus-visible states accessible with `ring-indigo-500`?
- [ ] Does Framer Motion include `viewport={{ once: true }}`?
