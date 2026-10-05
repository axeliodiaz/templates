# Contributing: git-flow

- `main` is production. Vercel deploys only `main`.
- `develop` is the default branch and the integration branch.
- Work on a feature branch (`feat/...`, `fix/...`) cut from `develop`.
- Open every PR against `develop`. Squash-merge once checks pass.
- Release by opening a PR from `develop` to `main`. Do not merge feature branches into `main`.
- Preview deployments are off for all branches except `main` (see `vercel.json`, `git.deploymentEnabled`) to stay inside the free-plan daily deploy cap.
