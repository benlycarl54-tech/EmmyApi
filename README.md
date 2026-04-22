# Emmy API

A Zennz-style REST API collection, 99 endpoints auto-wrapped from public gist functions.

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000

## Deploy

### Render
- Build command: `npm install`
- Start command: `npm start`
- Auto-detected port via `process.env.PORT`.

### Heroku
```
heroku create
git push heroku main
```
Includes `Procfile`.

### VPS / PM2
```
npm install
pm2 start server.js --name emmy-api
```

## How it works
- Each `apis/*.js` file exports a single async function.
- `server.js` reads `registry.json` and mounts one route per file at `/api/<name>`.
- Query-string params map positionally onto the function signature: `(a, b)` → `?a=...&b=...`.
- Base URL auto-detected from `req.protocol + req.get('host')` — no hardcoding.

## Endpoints
See `/api/list` at runtime for the full JSON catalogue, or `/docs` for the interactive docs page.

## Adding more
Drop a new file into `apis/` that ends with `module.exports = myFunc;` and add an entry to `registry.json`:
```json
{ "file": "myfunc", "func": "myFunc", "endpoint": "/api/myfunc",
  "params": [{"name":"q","optional":false}], "category":"Tools & Utils",
  "desc": "What it does" }
```
Restart the server.

## Notes on live testing
Many upstream providers gate with Cloudflare / reCAPTCHA and may 403 intermittently. Endpoints are wrapped in try/catch so failures return `{status:false,error}` without crashing the server.
