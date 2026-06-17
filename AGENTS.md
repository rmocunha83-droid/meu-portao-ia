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
- The `/empresas` page should read as a continuous landing page, not a menu-led product/dashboard. Avoid section navigation, tabs, sidebars, or heavy menus; use a simple header with logo + one CTA and guide the reader through promise, proof, comparison, process, FAQ, price, and signup in one scroll.
- The AI simulation should preserve the same house and camera angle while replacing the gate. It may subtly improve old walls, lighting, exposure, and curb appeal so the after image feels polished, but the result must remain believable as the same facade and keep the gate as the main transformation.
- For the MVP, keep AI generation cost-conscious without making the result look cheap: optimize uploaded photos before sending them to the AI, generate 2 options by default, request JPEG output with moderate compression, and keep medium quality unless the user explicitly asks for a lower-cost test mode.
- Admin lead distribution should start with WhatsApp handoff for the MVP, but every handoff must be recorded internally before opening WhatsApp. Track how many leads each partner has received and keep the partner delivery history visible in the admin.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
