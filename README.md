# Nara Forge DevTools

An independent, dependency-free Node.js release-evidence checker. This is a standalone open-source starter project, **not** a release certification for Nara Forge itself.

## Requirements
Node.js 20 or later.

## Run
```sh
npm test
node src/cli.js examples/release.json
```

The example deliberately returns **HOLD** and exits 1. A valid manifest returns **SHIP** and exits 0; malformed input exits 2.

## Manifest
A JSON object with a 40-character `candidateCommit`, matching `productionCommit`, nonempty `requiredSuites`, and an explicit `unresolvedBlockers` array. Each suite needs `name`, nonnegative integer `passed`, `failed`, `skipped`, `commit`, ISO `completedAt`, and HTTPS `evidenceUrl`. Evidence is checked for freshness using `maxEvidenceAgeHours` (default 24).

This verifier checks declared evidence metadata; it does **not** download evidence, validate signatures, verify actual deployments, or guarantee software security. Do not use the SHIP verdict without independent evidence validation.

## Contributing
Open an issue describing a bug or feature. Contributions should include tests and avoid secrets or customer data. See `CONTRIBUTING.md`.

## License
MIT.

## Relationship to Nara Forge

[Nara Forge](https://naraforge.com/) is the related application. Its main application source repository is private; this repository contains a **separately licensed public utility**, not the full Nara Forge application.

A private-repository integration workflow is proposed in Nara Forge PR #1334. It is designed to run syntax checks on three real application source files and feed the resulting evidence metadata into this public verifier. Because the full release checks and production commit are not verified, the expected verdict is **HOLD**. This integration has not yet been confirmed by a hosted CI run.

The public utility does not publish private source code or private CI logs. This is an initial open-source project; no claims are made about community adoption, production deployment, or external maintainers.
