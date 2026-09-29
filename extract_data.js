import fs from 'fs';

const bundle = fs.readFileSync('bundle_index-CjPg4vX-.js', 'utf-8');

// Find all s3 urls or data urls or fetch calls
const s3Matches = [...bundle.matchAll(/https:\/\/[^"'`\s]+\.amazonaws\.com\/[^"'`\s]*/g)].map(m => m[0]);
console.log('S3 matches:', [...new Set(s3Matches)]);

// Find all fetch or axios calls in the bundle
const fetchMatches = [...bundle.matchAll(/fetch\s*\(\s*[`"']([^`"']+)`?["']/g)].map(m => m[1]);
console.log('Fetch calls:', [...new Set(fetchMatches)]);

// Find all template strings with URLs
const templateMatches = [...bundle.matchAll(/`https:\/\/[^`]+`/g)].map(m => m[0]);
console.log('Template URL matches:', [...new Set(templateMatches)]);

// Let's search where "organizaciones" or "candidatos" or JSON files are fetched
const jsonFetch = [...bundle.matchAll(/[`"'](https:\/\/[^`"']+\.json[^`"']*)[`"']/g)].map(m => m[1]);
console.log('JSON file URLs:', [...new Set(jsonFetch)]);

// Search for Ubigeo dataset in bundle
const ubigeoMatch = bundle.match(/JSON\.parse\('(\[\{"dep":[^']+\})'\)/);
if (ubigeoMatch) {
  console.log('Found full Ubigeo dataset in bundle! Length:', ubigeoMatch[1].length);
  const ubigeo = JSON.parse(ubigeoMatch[1]);
  fs.writeFileSync('extracted_ubigeo_peru.json', JSON.stringify(ubigeo, null, 2));
  console.log('Saved extracted_ubigeo_peru.json. Total districts in Peru:', ubigeo.length);
  
  // Filter Pasco districts
  const pascoDistricts = ubigeo.filter(u => u.departamento.toUpperCase() === 'PASCO');
  console.log('Pasco districts from votabien.pe dataset:', pascoDistricts.length);
  fs.writeFileSync('extracted_pasco_ubigeo.json', JSON.stringify(pascoDistricts, null, 2));
}
