import fs from 'fs';

const bundle = fs.readFileSync('bundle_index-CjPg4vX-.js', 'utf-8');

// Find all fetch calls with context
const fetchMatches = [...bundle.matchAll(/fetch\s*\([^)]+\)/g)].map(m => m[0]);
console.log('All fetch calls with context:');
fetchMatches.forEach(f => console.log(f));

// Find all .json occurrences
const jsonMatches = [...bundle.matchAll(/.{0,50}\.json.{0,50}/g)].map(m => m[0]);
console.log('\nAll .json occurrences:');
jsonMatches.forEach(j => console.log(j));

// Search for candidate arrays or organization objects
const orgMatches = [...bundle.matchAll(/organizaciones/gi)].map(m => m.index);
console.log('\nOrganizaciones indices:', orgMatches);
orgMatches.slice(0, 5).forEach(idx => {
  console.log('\n--- Org Context @ ' + idx + ' ---');
  console.log(bundle.substring(Math.max(0, idx - 150), Math.min(bundle.length, idx + 250)));
});
