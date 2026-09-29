import fs from 'fs';

const bundle = fs.readFileSync('bundle_index-CjPg4vX-.js', 'utf-8');

// Find the string containing ubigeo_jne
const startIdx = bundle.indexOf('[{"dep":');
if (startIdx !== -1) {
  // Find where this JSON string ends
  // It is enclosed in quotes or brackets
  let endIdx = bundle.indexOf('}]', startIdx);
  if (endIdx !== -1) {
    endIdx += 2;
    const jsonStr = bundle.substring(startIdx, endIdx);
    console.log('Found JSON string, length:', jsonStr.length);
    try {
      const parsed = JSON.parse(jsonStr);
      console.log('Successfully parsed! Total records:', parsed.length);
      fs.writeFileSync('extracted_ubigeo_peru.json', JSON.stringify(parsed, null, 2));

      const pasco = parsed.filter(u => u.departamento.toUpperCase() === 'PASCO');
      console.log('Pasco records:', pasco.length);
      fs.writeFileSync('extracted_pasco_ubigeo.json', JSON.stringify(pasco, null, 2));
    } catch (e) {
      console.error('JSON parse error:', e.message);
    }
  }
} else {
  console.log('dep pattern not found directly with [{"dep":');
  // Search for "ubigeo_jne"
  const uIdx = bundle.indexOf('ubigeo_jne');
  console.log('ubigeo_jne at:', uIdx);
  if (uIdx !== -1) {
    console.log(bundle.substring(uIdx - 100, uIdx + 200));
  }
}
