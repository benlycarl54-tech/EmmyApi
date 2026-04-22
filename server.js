const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.set('trust proxy', true);
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const registry = JSON.parse(fs.readFileSync(path.join(__dirname, 'registry.json'), 'utf8'));

function baseUrl(req) {
  return `${req.protocol}://${req.get('host')}`;
}

function loadHandler(file) {
  try { return require(path.join(__dirname, 'apis', file + '.js')); }
  catch (e) { return null; }
}

const loaded = {};
const broken = [];
for (const ep of registry) {
  const fn = loadHandler(ep.file);
  if (typeof fn === 'function') { loaded[ep.file] = fn; }
  else { broken.push(ep.file); }
}
console.log(`Loaded ${Object.keys(loaded).length}/${registry.length} endpoints. Broken:`, broken);

for (const ep of registry) {
  if (!loaded[ep.file]) continue;
  app.all(ep.endpoint, async (req, res) => {
    try {
      const q = { ...req.query, ...req.body };
      const args = ep.params.map(p => q[p.name]);
      const missing = ep.params.filter(p => !p.optional && (q[p.name] === undefined || q[p.name] === ''));
      if (missing.length) {
        return res.status(400).json({
          status: false,
          error: 'Missing required parameter(s): ' + missing.map(p => p.name).join(', '),
          example: `${baseUrl(req)}${ep.endpoint}?${ep.params.map(p => `${p.name}=VALUE`).join('&')}`
        });
      }
      const started = Date.now();
      const result = await loaded[ep.file](...args);
      res.json({ status: true, creator: 'Emmy', took: (Date.now()-started)+'ms', result });
    } catch (e) {
      res.status(500).json({ status: false, error: e.message || String(e) });
    }
  });
}

app.get('/api/list', (req, res) => {
  const b = baseUrl(req);
  res.json({
    status: true,
    total: registry.length,
    loaded: Object.keys(loaded).length,
    endpoints: registry.map(ep => ({
      name: ep.file,
      category: ep.category,
      description: ep.desc,
      params: ep.params,
      url: b + ep.endpoint + (ep.params.length ? '?' + ep.params.map(p => `${p.name}=`).join('&') : '')
    }))
  });
});

app.get('/categories.json', (req, res) => {
  const out = {};
  for (const ep of registry) (out[ep.category] ||= []).push(ep);
  res.json(out);
});

app.get('/docs', (req, res) => res.sendFile(path.join(__dirname, 'public', 'docs.html')));
app.get('/category', (req, res) => res.sendFile(path.join(__dirname, 'public', 'category.html')));

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
