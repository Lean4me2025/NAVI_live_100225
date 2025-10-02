
# NOVA v8.2 (Integrated Static Build)

**Flow:** Welcome → Categories → Traits → Plan (Payhip + Family PIN) → Navi (subdomain).

## What’s included
- Dark theme, zero white tiles.
- Categories-first, traits-second.
- 10 categories, 50 traits (mapped), up to 12 trait selections.
- Plans page with Payhip embed buttons:
  - Pro/Mastery: `re4Hy`
  - Purpose Book: `N7Lvg`
- Family PIN bypass (local-only): `FAMILY2025`, `NOVA-FAMILY`, `DREW-CLARA`
- Smooth page transitions and localStorage for state.

## Deploy steps (GitHub → Vercel)
1) Create a **new GitHub repo** (fresh). Upload contents of `Nova_v8_2/`.
2) In **Vercel**, import the repo → **Framework: Other** → Root directory is `/` (static).
3) After deploy, set **Production Domain** to your Nova root (e.g., `meetnovanow.com`).
4) For Navi, create a separate Vercel project and map **`navi.meetnovanow.com`** as a CNAME to that project.

## Edit PINs or Plans
- Change PINs in `/assets/js/app.js` (`FAMILY_PINS` array).
- Edit plan features or Payhip IDs in `/assets/data/plans.json`.

## Notes
- This is a static app with client-side routing by page; data loaded from local JSON.
- To expand trait library (e.g., full OOH roles), add to `/assets/data/traits.json` and map to categories accordingly.
