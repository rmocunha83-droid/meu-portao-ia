# Design QA - Meu Portao IA / Empresas

## Source of truth
- Selected direction: Casa Brasileira, model 2B landing page.
- Source mock image: `/Users/romeucunha/.codex/generated_images/019ec91d-a196-7f50-b97a-a04241da21c4/ig_07bef2594b389372016a31fc260b888191bd111b8fdeba6ea2.png`.
- User marked the left/source mock image as the preferred photo direction.

## What changed
- `/empresas` is now a continuous landing page, not a menu-led page.
- Header on `/empresas` is simplified to logo plus one CTA.
- Hero and process photos were replaced with crops from the marked model 2B source mock.
- FAQ was moved before the price/cadastro section to answer objections before presenting the offer.
- The first two FAQ answers are open by default: no sales commission and the site does not fabricate/install gates.
- Mobile hero now uses the full hero composition instead of cropping the embedded lead cards.

## Verification
- Production build passed with Vite on 2026-06-16.
- Local server responded with HTTP 200 at `http://127.0.0.1:5174/empresas`.
- Browser checks confirmed the mobile hero uses `/assets/partner-2b-hero.webp`, no visible duplicate lead-card DOM remains, and FAQ contains five questions.
- Source inspection confirms `.partner-faq-section` renders before `.partner-signup`, and the first two `<details>` are open by default.

## Notes
- The hero image intentionally includes the generated lead cards from the source mock as part of the photo composition. Separate floating DOM cards were removed to avoid duplication.
- Local screenshots were used during review, but are not required for the published site.
