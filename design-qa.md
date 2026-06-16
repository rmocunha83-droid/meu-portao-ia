# Design QA

- Source visual direction: Casa Brasileira, selected on 2026-06-15
- Implementation URL: `http://127.0.0.1:5173/`
- Viewport inspected: 627 x 714
- State: Home, initial state, before-and-after control at 50%

**Findings**

- The local site is reachable at `http://127.0.0.1:5173/`; the earlier connection-refused state was resolved by keeping the Vite preview running.
- Browser inspection confirmed 13 page images, all loaded successfully.
- Browser inspection confirmed no repeated image source on the Home page.
- The hero text no longer overlaps the before-and-after transformation; on the inspected mobile/narrow viewport, the transformation appears first and the copy sits in a separate ivory card below it.
- The footer now has clearer navigation, a stronger brand block, a visible simulation CTA, company links, and a privacy reassurance card.
- Production build passes through the local Vite build command.

**Patches Made**

- Added a separate natural wood gate image so “Ripado” and “Madeira” no longer reuse the same photo.
- Replaced the repeated hero “after” image in the “Moderno” card and result card with the existing metal gate asset.
- Refined the hero layout so the copy and before-and-after comparison are separate components instead of competing for the same image area.
- Reworked the footer into a more useful conversion and trust section.
- Kept the Casa Brasileira visual language: warm residential photography, ivory surfaces, terracotta actions, forest-green details, and a welcoming renovation tone.

final result: passed
