import fs from 'fs';

async function extract() {
  try {
    console.log('Fetching https://votabien.pe/ ...');
    const htmlRes = await fetch('https://votabien.pe/');
    const html = await htmlRes.text();
    fs.writeFileSync('votabien_index.html', html);
    console.log('Saved votabien_index.html (length:', html.length, ')');

    // Find all script and link tags
    const scripts = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
    const links = [...html.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);

    console.log('Scripts found:', scripts);
    console.log('Links found:', links);

    for (const src of scripts) {
      const url = src.startsWith('http') ? src : `https://votabien.pe${src}`;
      console.log('Fetching script:', url);
      const res = await fetch(url);
      const text = await res.text();
      const filename = 'bundle_' + src.split('/').pop();
      fs.writeFileSync(filename, text);
      console.log(`Saved ${filename} (${text.length} bytes)`);
    }

    for (const href of links) {
      if (href.endsWith('.json') || href.endsWith('.css') || href.includes('data')) {
        const url = href.startsWith('http') ? href : `https://votabien.pe${href}`;
        console.log('Fetching link:', url);
        const res = await fetch(url);
        const text = await res.text();
        const filename = 'asset_' + href.split('/').pop();
        fs.writeFileSync(filename, text);
        console.log(`Saved ${filename} (${text.length} bytes)`);
      }
    }
  } catch (err) {
    console.error('Error during extract:', err);
  }
}

extract();
