import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyRelease} from '../src/verify.js';

const sha='f'.repeat(40);
const now=new Date('2026-11-03T18:00:00Z');
const fixture=()=>({
 candidateCommit:sha,
 productionCommit:'0'.repeat(40),
 unresolvedBlockers:['Full deployment verification is incomplete'],
 requiredSuites:[{
   name:'private-application-syntax',
   passed:3,failed:0,skipped:0,commit:sha,
   completedAt:'2026-11-03T17:00:00Z',
   evidenceUrl:'https://github.com/example/private-repo/actions/runs/123'
 }]
});
test('private application integration stays HOLD without release verification',()=>{
 const result=verifyRelease(fixture(),now);
 assert.equal(result.decision,'HOLD');
 assert.ok(result.blockers.some(b=>b.includes('Production commit')));
 assert.ok(result.blockers.some(b=>b.includes('Unresolved')));
});
test('metadata for one test lane cannot mask a missing required lane',()=>{
 const m=fixture();
 m.requiredSuites.push({name:'full-release',passed:0,failed:0,skipped:0,commit:sha,completedAt:'2026-11-03T17:00:00Z',evidenceUrl:'https://github.com/example/private-repo/actions/runs/123'});
 const result=verifyRelease(m,now);
 assert.equal(result.decision,'HOLD');
 assert.ok(result.blockers.some(b=>b.includes('0/0')));
});
