# Integrating with a private application

This public project is intentionally separate from the proprietary Nara Forge application.

## Safe integration pattern

1. Keep the application repository private.
2. Run application tests inside the **private** repository's CI.
3. Check out this public verifier at a pinned, reviewed commit in that private workflow.
4. Generate a manifest inside the private workflow, using the exact checked-out application commit.
5. Run the verifier locally in that workflow; do not upload the manifest or logs to this public repository.
6. Treat HOLD as blocking, and never equate a successful syntax check with a complete release verification.

A proposed private integration exists in Nara Forge pull request [#1334](https://github.com/wpwtsghhp2-ship-it/nara-forge/pull/1334). Its contents and run logs require access to the private repository. The public verifier tests here use **synthetic data**, not copied private code or CI logs.

## Security boundaries

- Never copy proprietary source, .env files, tokens, internal hostnames, or production manifests into this public repository.
- Never use pull-request workflows from untrusted forks with production secrets.
- Pin the public verifier to a reviewed commit rather than an untrusted floating branch.
- Validate real evidence separately; the current verifier checks supplied metadata, not evidence authenticity.
- A public GitHub project does not imply the private Nara Forge application is open source.

## Status

Public unit tests and synthetic integration tests are available. A successful hosted private integration run has not been established by this document.
