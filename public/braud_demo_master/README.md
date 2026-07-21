# Braud Dashboard — Sanitized Demo

Standalone demo of the Braud property operations dashboard. **No database, no API, no real tenant or property data.**

## Contents

- `demo/` — static single-page app (open `index.html` in a browser or serve with any static host)

## Run locally

```powershell
cd demo
python -m http.server 5179
```

Then open http://localhost:5179

Or double-click `demo/index.html` (some browsers block module scripts from `file://` — use the server above if needed).

## What's included

- Home briefing (delinquent, vacant, maintenance, leases)
- Executive KPI overview
- Decision Inbox (sample workflow items)
- Occupancy snapshot

All names, amounts, and addresses are fictional.
