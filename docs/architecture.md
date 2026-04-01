# Architecture Notes

## Project organization
- `src/components`: reusable UI components and loaders.
- `src/hooks`: shared React hooks.
- `src/utils`: utility helpers.
- `tests`: unit/integration tests.
- `docs`: architecture and contributor-facing docs.

## Loader design goals
- Visually represent local-to-global data flow.
- Respect reduced-motion preferences.
- Keep payload lightweight (SVG + CSS/Framer Motion).
