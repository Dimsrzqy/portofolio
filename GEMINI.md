# Project Guidelines & Rules

## MANDATORY: Design System & UI Protocol (DESIGN.md)

> **CRITICAL AGENT INSTRUCTION**:
> Whenever you receive a prompt that involves creating, modifying, styling, refactoring, or evaluating any UI component, page, layout, animation, typography, or visual aspect in this project:
>
> 1. **You MUST consult and follow [`DESIGN.md`](./DESIGN.md)** as the primary source of truth for design tokens, colors (Zinc neutral + Indigo accent), typography (Geist Sans / Mono), border radius hierarchy, spacing scales, and anti-slop guidelines.
> 2. **Anti-Slop Hard Constraints**:
>    - NO generic purple-blue/rainbow AI gradients.
>    - NO floating glowing background fog/orbs.
>    - NO indiscriminate glassmorphism (solid surfaces by default; blur only for floating nav).
>    - NO uniform pill-shapes for every component.
> 3. **Accessibility & Responsiveness**:
>    - Support both Light and Dark modes (`next-themes`).
>    - Ensure touch targets are at least 44x44px on mobile (`min-h-[44px]`).
>    - No horizontal scrollbars or fixed-width overflows on mobile viewports.
>    - Ensure WCAG AA contrast ratio compliance.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
Before starting, consult `DESIGN.md` for project-specific brand and design tokens.
<!-- antislop:end -->

