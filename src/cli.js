#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {verifyRelease} from './verify.js';
const path = process.argv[2];
if (!path) {console.error('Usage: nara-release-check <manifest.json>'); process.exit(2);}
try {
  const result = verifyRelease(JSON.parse(readFileSync(path,'utf8')));
  console.log(JSON.stringify(result,null,2));
  process.exit(result.decision === 'SHIP' ? 0 : 1);
} catch (err) {console.error(`Cannot verify manifest: ${err.message}`); process.exit(2);}