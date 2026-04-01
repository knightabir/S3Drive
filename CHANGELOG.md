# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-04-01
### Added
- New reusable `ConnectionLoader` component with local-to-global connection animation.
- Accessibility improvements (`role=status`, `aria-live`, reduced-motion support).
- Vitest + React Testing Library setup and tests for loader behavior/accessibility.
- GitHub templates for issues and pull requests.
- CI workflow for lint, test, and build.
- Open-source governance docs: CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, LICENSE.
- Deployment documentation and `vercel.json`.

### Changed
- Lazy-loaded loader component after connection submit to reduce initial payload.
- Project documentation rewritten for contributors and deployment readiness.
