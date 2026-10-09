# Contributing: git-flow

- `main` is production. Production releases still require owner approval.
- `develop` is the default branch and the integration branch.
- Work on a feature branch (`feat/...`, `fix/...`) cut from `develop`.
- Open every PR against `develop`. Squash-merge once checks pass.
- Release by opening a PR from `develop` to `main`. Do not merge feature branches into `main`.
- Vercel previews are enabled for `develop` and `fix/*` only. Keep deploys bounded inside the free-plan daily cap; verify each preview before merge. Feature branches outside `fix/*` need a scoped preview rule.
