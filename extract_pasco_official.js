import fs from 'fs';
import path from 'path';

async function fetchPascoCedulas() {
  const pascoDistricts = JSON.parse(fs.readFileSync('extracted_pasco_ubigeo.json', 'utf-8'));
  console.log(`Found ${pascoDistricts.length} districts for Pasco in extracted_pasco_ubigeo.json`);

  const outDir = './public/data/cedulas';
  const logoDir = './public/data/logos';
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(logoDir, { recursive: true });

  const allLogos = new Set();
  const summaryCedulas = [];

  for (const dist of pascoDistricts) {
    const url = `https://votabien.pe/data/cedulas/${dist.ubigeo_jne}.json`;
    console.log(`Fetching ${dist.distrito} (${dist.provincia}) -> ${url}`);
    
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        fs.writeFileSync(path.join(outDir, `${dist.ubigeo_jne}.json`), JSON.stringify(data, null, 2));
        summaryCedulas.push({
          ubigeo: dist.ubigeo_jne,
          provincia: dist.provincia,
          distrito: dist.distrito,
          seccionesCount: data.secciones ? data.secciones.length : 0,
          data
        });

        // Collect logos
        if (data.secciones) {
          for (const sec of data.secciones) {
            if (sec.organizaciones) {
              for (const org of sec.organizaciones) {
                if (org.logo) allLogos.add(org.logo);
              }
            }
          }
        }
      } else {
        console.warn(`Failed to fetch ${url}: status ${res.status}`);
      }
    } catch (err) {
      console.error(`Error fetching ${url}:`, err.message);
    }
  }

  console.log(`\nDownloaded ${summaryCedulas.length} Pasco cédulas successfully!`);
  console.log(`Found ${allLogos.size} unique logos in Pasco cédulas. Downloading logos...`);

  for (const logo of allLogos) {
    const logoUrl = `https://votabien.pe/data/logos/${logo}`;
    try {
      const res = await fetch(logoUrl);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(logoDir, logo), buffer);
        console.log(`Downloaded logo: ${logo}`);
      } else {
        console.warn(`Failed to download logo ${logoUrl}: ${res.status}`);
      }
    } catch (err) {
      console.error(`Error downloading logo ${logo}:`, err.message);
    }
  }

  fs.writeFileSync('pasco_cedulas_extracted.json', JSON.stringify(summaryCedulas, null, 2));
  console.log('\nSaved all extracted Pasco cédulas to pasco_cedulas_extracted.json');
}

fetchPascoCedulas();
