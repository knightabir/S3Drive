# Contributing to S3Drive

Thanks for contributing! We welcome pull requests, issues, and improvements.

## 1) Fork and clone
1. Fork this repository.
2. Clone your fork.
3. Create a branch from `main`.

## 2) Branch naming
Use one of these prefixes:
- `feat/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`
- `chore/<short-description>`

## 3) Development workflow
```bash
npm install
npm run dev
```

Before opening a PR:
```bash
npm run lint
npm run test
npm run build
```

## 4) Commit message format
Use Conventional Commits:
- `feat: add connection loader`
- `fix: prevent upload dialog overflow`
- `docs: update vercel deployment notes`

## 5) Pull request rules
- Keep PRs focused and small.
- Link related issues.
- Include screenshots for UI updates.
- Add or update tests where appropriate.
- Update docs/CHANGELOG when behavior changes.
