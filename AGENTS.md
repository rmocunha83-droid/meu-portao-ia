# Prototype Instructions

Run the local server yourself and open the preview in the in-app browser. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Selected visual direction

- Use the "Casa Brasileira" concept selected on 2026-06-15.
- Preserve warm residential photography, ivory and stone surfaces, terracotta actions, forest-green details, humanist typography, and a welcoming local-renovation tone.
- Keep marketing pages emotional and image-led while simulation forms remain simple and practical.
- Do not reuse the same photo across Home inspiration cards, result cards, and customer stories when the user is comparing options.
- Keep the hero transformation visually clear: copy must not cover the before-and-after image, especially on mobile and narrow browser widths.
- Treat the footer as a conversion and trust area with clear paths for moradores, empresas, simulation CTA, and privacy reassurance.
- The `/empresas` page should sell the partner offer to serralherias, gate manufacturers, automatic gate installers, automation companies, and local service owners. Keep the promise concrete: qualified opportunities from users who already simulated gate options on their own facade, not generic leads. Standard partner price is R$ 299/month with the first month free for new partners.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
