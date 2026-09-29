import fs from 'fs';

const bundle = fs.readFileSync('bundle_index-CjPg4vX-.js', 'utf-8');
console.log('Bundle length:', bundle.length);

// Search for strings or patterns like "PASCO", "LIMA", "partidos", "candidates", etc.
const matchesPasco = [...bundle.matchAll(/pasco/gi)];
console.log('Pasco occurrences in bundle:', matchesPasco.length);

// Let's search for JSON-like structures or arrays of parties
const jsonRegex = /\[\{[^{}]*"name"[^{}]*\}\]/g;
const jsonMatches = bundle.match(jsonRegex);
console.log('JSON matches found:', jsonMatches ? jsonMatches.length : 0);

// Let's find snippets mentioning "candidatos", "partidos", "movimientos", "organizaciones", "cedula", "onpe"
const keywords = ['partido', 'organizacion', 'candidato', 'distrito', 'provincia', 'departamento', 'supabase', 'api', 'firebase', 'backend', 'voto'];

keywords.forEach(kw => {
  const r = new RegExp(`.{0,40}${kw}.{0,40}`, 'gi');
  const m = [...bundle.matchAll(r)].slice(0, 3);
  console.log(`\n--- Keyword: ${kw} (${m.length} sample matches) ---`);
  m.forEach(match => console.log(match[0]));
});

// Let's extract any URLs or API endpoints in the bundle
const urlMatches = [...bundle.matchAll(/https?:\/\/[a-zA-Z0-9.\-_/]+/g)].map(m => m[0]);
const uniqueUrls = [...new Set(urlMatches)];
console.log('\n--- URLs found in bundle: ---');
console.log(uniqueUrls.slice(0, 20));

// Let's write a search tool for specific sections
fs.writeFileSync('extracted_urls.json', JSON.stringify(uniqueUrls, null, 2));
