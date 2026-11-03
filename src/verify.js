export function verifyRelease(input, now = new Date()) {
  const blockers = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {decision:'HOLD', blockers:['Missing release manifest']};
  if (!/^[a-f0-9]{40}$/i.test(input.candidateCommit ?? '')) blockers.push('Candidate commit must be a full 40-character SHA');
  if (input.productionCommit !== input.candidateCommit) blockers.push('Production commit does not match candidate');
  if (!Array.isArray(input.requiredSuites) || input.requiredSuites.length === 0) blockers.push('No required test suites defined');
  const suiteNames = new Set();
  for (const suite of Array.isArray(input.requiredSuites) ? input.requiredSuites : []) {
    if (!suite || typeof suite.name !== 'string' || !suite.name.trim()) {blockers.push('Unnamed test suite'); continue;}
    if (suiteNames.has(suite.name)) blockers.push(`${suite.name}: duplicate suite name`);
    suiteNames.add(suite.name);
    const {passed, failed, skipped, completedAt, evidenceUrl} = suite;
    if (![passed,failed,skipped].every(n => Number.isSafeInteger(n) && n >= 0)) {blockers.push(`${suite.name}: invalid test counts`); continue;}
    if (passed + failed + skipped === 0) blockers.push(`${suite.name}: 0/0 test run is not a pass`);
    if (failed > 0) blockers.push(`${suite.name}: ${failed} failed tests`);
    if (passed === 0) blockers.push(`${suite.name}: no passing tests`);
    if (typeof evidenceUrl !== 'string' || !/^https:\/\//.test(evidenceUrl)) blockers.push(`${suite.name}: missing HTTPS evidence URL`);
    const timestamp = Date.parse(completedAt);
    const maxAgeHours = Number.isFinite(input.maxEvidenceAgeHours) && input.maxEvidenceAgeHours > 0 ? input.maxEvidenceAgeHours : 24;
    if (!Number.isFinite(timestamp) || timestamp > now.getTime() || now.getTime() - timestamp > maxAgeHours * 3600000) blockers.push(`${suite.name}: missing, future, or stale evidence`);
    if (suite.commit !== input.candidateCommit) blockers.push(`${suite.name}: evidence commit differs from candidate`);
  }
  if (!Array.isArray(input.unresolvedBlockers)) blockers.push('Unresolved blocker list is missing');
  else for (const b of input.unresolvedBlockers) blockers.push(`Unresolved: ${String(b)}`);
  return {decision:blockers.length ? 'HOLD':'SHIP',blockers};
}