# Al Aqsa — Fixing the GSC "Not Found (404)" Validation Failure
For alaqsaumrahtransport.com | Ready to paste into Antigravity

---

## What I confirmed before writing this (so the prompt isn't guesswork)

Checked your live repo against the two flagged URLs:

1. **`/services/hajj-group-transport`** — confirmed there is no route folder for this page (matches your earlier decision not to build it), and it's correctly absent from `Footer.tsx` and the current `sitemap-services.xml`. So nothing in the current code links to it. The 404 Google is still seeing is either a stale crawl (an old link/sitemap entry from before the decision) or an external/backlink still pointing at it.

2. **While checking the sitemap, I found two more broken entries you didn't flag** — same bug, different URLs, likely why "Validate Fix" keeps failing (new 404s keep surfacing from the same source):
   - `sitemap-services.xml` lists **`/services/makkah-jeddah-taxi`** — no such route exists (your real route is `/services/makkah-madinah-taxi`).
   - It also lists **`/services/taif-city-tour`** — no such route exists (your real Taif page is `/routes/makkah-to-taif-taxi`).

   Every one of these is a "Submitted URL not found (404)" waiting to happen the next time Google crawls your sitemap.

3. **The `.woff2` 404** — your fonts (Inter, Open Sans, Reem Kufi) load via `next/font/google` in `layout.tsx`, so that file is a Next.js-generated, content-hashed asset under `_next/static/media/`, not something in your code. Google is very likely holding a stale reference to a hash from a previous deployment that no longer exists in your current build output. This needs verification, not a guess — the prompt below has Antigravity check it properly rather than assume.

---

## Short plan

1. Fix `sitemap-services.xml` — remove the two broken entries, and change the generator so it can only ever list routes that actually exist on disk (stops this class of bug recurring).
2. Decide `/services/hajj-group-transport`'s fate: 301 redirect it to the closest real page (recommended — preserves any link equity from old backlinks/GSC history) rather than leaving it a bare 404.
3. Investigate the `.woff2` 404 properly — confirm it's a stale-hash artifact and not a live bug, check caching headers on `_next/static/*`.
4. Deploy.
5. **Only after the deploy is live**, use GSC's URL Inspection tool on both URLs to confirm they now resolve correctly, then click Validate Fix — validating before the fix is actually live in production is almost certainly why the first attempt (started 7/20, failed 9/19) didn't stick.

---

## Antigravity Prompt

```
CONTEXT
alaqsaumrahtransport.com is a live production Next.js (App Router) site deployed on Vercel. Google Search Console is reporting a "Page indexing > Not found (404)" issue with a failed validation (validation started 7/20/26, failed 9/19/26) affecting:
1. https://www.alaqsaumrahtransport.com/services/hajj-group-transport
2. https://www.alaqsaumrahtransport.com/_next/static/media/ad85ec941b4c8b5c-s.p.abd41f7e.woff2

I've already confirmed: /services/hajj-group-transport has no route folder and is correctly absent from Footer.tsx and sitemap-services.xml. I also found sitemap-services.xml lists two OTHER routes that don't exist: /services/makkah-jeddah-taxi (should be /services/makkah-madinah-taxi) and /services/taif-city-tour (the real page is /routes/makkah-to-taif-taxi). The font 404 is a next/font/google-generated hashed asset in layout.tsx (Inter, Open Sans, Reem Kufi) — likely a stale hash from a previous deploy, not a code bug, but verify rather than assume.

OBJECTIVE
Eliminate every currently-broken URL that could be causing "Submitted URL not found (404)" errors in Search Console, make the sitemap generator structurally unable to list a non-existent route again, and properly resolve or redirect the hajj-group-transport URL rather than leaving it a bare 404. Diagnose the font asset 404 with evidence, not assumption.

NON-NEGOTIABLES
1. Do not deploy automatically. Work on a branch/staging environment — I will review and approve before merge to production.
2. Do not touch booking, payment, or admin panel logic. This is strictly sitemap, redirects, and a font-loading investigation.
3. Any redirect added must be a proper HTTP 301 (permanent), implemented in next.config.ts redirects() or middleware.ts — not a client-side router push.
4. Do not silently delete the /services/hajj-group-transport decision history — if you add a redirect, tell me exactly which target URL you chose and why.

TASKS

1. Sitemap audit and fix (src/app/sitemap-services.xml/route.ts):
   - Remove '/services/makkah-jeddah-taxi' and '/services/taif-city-tour' from the staticServices array — confirm neither has a matching folder under src/app/(public)/services/ or src/app/(public)/routes/ before removing.
   - Cross-check every other entry in staticServices, dynamicRoutes, and hotelRoutes against actual existing routes/pages. Flag (don't silently fix) anything else that looks mismatched — for example verify /fleet/business-sedan actually resolves versus /fleet/toyota-camry, since I saw both spellings used in different places (Footer.tsx vs data/fleet.json).
   - Propose (but don't implement without my sign-off) a refactor so this sitemap is generated FROM the actual filesystem routes under src/app/(public)/services and src/app/(public)/routes, rather than a hand-maintained array — this is the root cause of both broken entries and will keep recurring otherwise.
   - Do the same audit against src/app/sitemap-pages.xml/route.ts and src/app/sitemap-blog.xml (if it has similar static lists).

2. Resolve /services/hajj-group-transport:
   - Add a permanent 301 redirect from /services/hajj-group-transport to the most relevant existing live page — most likely /services/ziyarat-tours or /services (your call based on what content is closest; tell me which you chose and why).
   - Implement via the `redirects()` function in next.config.ts (preferred for a static, permanent redirect) rather than middleware, unless the existing codebase already handles other one-off redirects in middleware.ts — match whatever pattern already exists there.

3. Investigate the .woff2 404 (do not just reassure me it's fine — show your work):
   - Confirm ad85ec941b4c8b5c-s.p.abd41f7e.woff2 does not exist in the current build output (.next/static/media/ after a fresh `npm run build`).
   - Check git history / recent commits around next/font/google usage in layout.tsx for any font addition, removal, or subset/weight change that would have changed the generated hash.
   - Check Vercel's cache-control headers currently being served for /_next/static/* — confirm they use immutable, long-lived caching (Next.js's default), which is expected and correct; the issue is Google's own index cache being stale, not your server's caching config.
   - Report your conclusion clearly: is this a genuinely stale Google-side cache of an old build (self-resolving, no code fix needed), or is there an actual live bug currently serving a broken font reference on any real page? If the former, say so plainly rather than inventing a fix for a non-bug.

4. After your changes are merged and deployed to production, tell me explicitly: "This is now live at [production URL] — safe to re-run URL Inspection and Validate Fix in Search Console." Do not tell me to validate before confirming the deploy is live.

DELIVERABLE
- A single feature branch with all changes
- A clear list of every sitemap URL removed or changed, and why
- The redirect target chosen for /services/hajj-group-transport and your reasoning
- Your evidence-based conclusion on the font 404 (stale cache vs. live bug)
- Explicit confirmation of what still needs my decision before merging
```

---

## One more thing for after this is deployed

Validating in GSC too early is the most common reason a "Validate Fix" attempt fails a second time — Google re-crawls almost immediately after you click it, and if the fix isn't live yet in production (still on a preview branch, or the deploy hasn't propagated), it'll fail again and you'll be back in a ~1-2 week wait for the next validation window. Confirm the URLs actually resolve correctly in an incognito browser tab against the live domain before clicking Validate Fix.
