# Al Aqsa — Fixing the GSC "Excluded by 'noindex' tag" Issue
For alaqsaumrahtransport.com | Ready to paste into Antigravity

3 affected URLs (first detected 1/6/26):
1. `/blog/ziyarat-places-madinah`
2. `/umrah/routes/makkah-to-taif-taxi`
3. `/umrah/routes/madinah-hotel-to-airport`

---

## What I confirmed before writing this (live-tested, not guessed)

I read the relevant code (`middleware.ts`, `next.config.ts`, `robots.ts`, root `layout.tsx`, `blog/[slug]/page.tsx`, `routes/[slug]/page.tsx`, `blogService.ts`, the Mongo `BlogPost` schema) and then live-fetched all three URLs against the production site to see what they actually do today. Here's what's really going on — it's three different situations, not one bug:

### 1. `/umrah/routes/makkah-to-taif-taxi` — already fixed, just needs re-validation
`next.config.ts` already contains a working permanent redirect (`source: '/umrah/:path*'` → `destination: '/:path*'`, `permanent: true`), plus a host-level flatten rule for the non-www domain. I fetched the URL live: it 301s cleanly to `/routes/makkah-to-taif-taxi`, which has the correct title, a correct self-referencing canonical, and no noindex anywhere. **This one is not broken.** GSC's "first detected 1/6/26" is stale — that redirect almost certainly didn't exist back then. Nothing to fix here except telling Google to recrawl it.

### 2. `/umrah/routes/madinah-hotel-to-airport` — the redirect works, but it redirects into a live bug
Same `/umrah/:path*` rule fires, sending this to `/routes/madinah-hotel-to-airport`. But I fetched `/routes/madinah-hotel-to-airport` **directly** (no `/umrah` prefix at all) and it is currently serving **the wrong page's content**: title "Makkah Hotel to Taif and Return", and a broken canonical tag literally reading `https://www.alaqsaumrahtransport.com/routes/undefined`. This is a real, live, independently-confirmed production bug — not a GSC artifact — and it's very likely a big part of why Google won't index this URL cleanly (a canonical pointing at a URL containing the literal string "undefined" tells Google this page doesn't know what it is).

**Likely root cause, based on the code:** `src/app/(public)/routes/[slug]/page.tsx` still types `params` as a plain object —
```ts
type Props = { params: { slug: string } };
```
— and reads `params.slug` synchronously in both `generateMetadata` and the page component. In Next.js 15's App Router, `params` is a `Promise` that must be awaited. Compare this to the working `src/app/(public)/blog/[slug]/page.tsx`, which correctly does:
```ts
params: Promise<{ slug: string }>
const { slug } = await params;
```
`makkah-to-taif-taxi` renders correctly not because this file works — it's because that specific route has its **own dedicated static folder** (`src/app/(public)/routes/makkah-to-taif-taxi/page.tsx`), which Next.js matches before ever falling through to the dynamic `[slug]` route. `madinah-hotel-to-airport` has no such dedicated folder, so it's the one hitting the buggy dynamic route directly — which is exactly the one showing wrong content. I can't confirm the exact internal mechanism (static-generation output mismatch vs. a params-resolution race) without build access, but the async-params mismatch is the clearest, verifiable defect in the file and the standard cause of this class of bug in Next 15. This needs to be fixed regardless of the GSC issue — right now, any visitor who lands on this URL from Google, a bookmark, or a link sees the wrong service entirely.

### 3. `/blog/ziyarat-places-madinah` — this post doesn't exist right now
I searched the entire static blog data file (`src/data/blog-posts.ts`, ~169KB) for `ziyarat-places-madinah` — zero matches. I live-fetched the URL and it renders "Article Not Found | Al Aqsa Umrah Transport", which is the exact fallback title `blog/[slug]/page.tsx` returns when `getPost()` comes back null (checks `staticBlogPosts` first, then falls back to the `BlogPost` Mongo collection). So today, this slug exists in neither place.

I also checked for anything that could be *emitting* a noindex tag for this page and found nothing: `blog/[slug]/page.tsx`'s `generateMetadata` has no `robots` field at all; the root `layout.tsx`'s `generateMetadata` has no site-wide default `robots` either; `robots.ts` (the robots.txt generator) doesn't disallow `/blog`. Since the code calls `notFound()`, this should be returning a genuine HTTP 404 — which GSC normally buckets as "Not found (404)", not "Excluded by noindex tag." My read: this is a stale classification from over 8 months ago (1/6/26), most likely from before this post was removed or unpublished, or from a short-lived state while it existed as an unpublished DB draft (note: `IBlogPost.isPublished` exists in the schema but `blogService.getPostBySlug` doesn't actually filter on it — it returns any post regardless of publish state, so that's not the current mechanism either, just worth knowing).

**This is the one item that needs your decision, not just a code fix:** did this post get deleted/renamed by mistake, or was it intentionally retired? Antigravity shouldn't invent a "Ziyarat Places in Madinah" article from scratch — that's your content and I don't want a prompt that silently fabricates it. The prompt below asks Antigravity to check your Git history and the admin panel/DB for any trace of this post and report back, rather than guessing.

---

## Short plan

1. Fix the real bug: make `routes/[slug]/page.tsx` use the async `params` pattern correctly (mirror `blog/[slug]/page.tsx`), and rebuild/verify `/routes/madinah-hotel-to-airport` renders its own correct content with a correct canonical.
2. While in that file, have Antigravity check every other route slug in `pricing.json` that (like `madinah-hotel-to-airport`) has **no** dedicated static folder — the same bug is likely live on some of those too, not just this one URL.
3. Investigate `ziyarat-places-madinah`: check git log / commit history for that slug, and check the admin panel / Mongo `blogposts` collection directly for any trace (deleted, draft, or renamed). Report findings — don't recreate content.
4. Based on what's found in step 3, either restore the post (if it existed and was lost) or leave it as a real 404 and tell me so I can mark it "Fixed" in GSC as a proper removal rather than a bug.
5. Deploy.
6. Only after deploy is confirmed live, re-run URL Inspection on all three URLs in Search Console, then click Validate Fix.

---

## Antigravity Prompt

```
CONTEXT
alaqsaumrahtransport.com is a live production Next.js 15 (App Router) site on Vercel. Google Search Console reports "Page indexing > Excluded by 'noindex' tag" (first detected 1/6/26) for three URLs:
1. https://www.alaqsaumrahtransport.com/blog/ziyarat-places-madinah
2. https://www.alaqsaumrahtransport.com/umrah/routes/makkah-to-taif-taxi
3. https://www.alaqsaumrahtransport.com/umrah/routes/madinah-hotel-to-airport

I already live-tested all three against production and read the relevant code. Findings, so you don't have to re-derive them:

- URL 2 is already fixed. next.config.ts's redirects() already has `/umrah/:path*` → `/:path*` (permanent). It correctly 301s to /routes/makkah-to-taif-taxi with a correct title and canonical, no noindex. GSC's classification is stale. No code change needed for this URL — just re-validation once the other two are handled.

- URL 3's redirect also fires correctly (same rule), but it lands on /routes/madinah-hotel-to-airport, which I confirmed by direct fetch is currently serving THE WRONG PAGE'S CONTENT: title "Makkah Hotel to Taif and Return" and a canonical tag reading literally https://www.alaqsaumrahtransport.com/routes/undefined. The likely cause: src/app/(public)/routes/[slug]/page.tsx types `params` as a plain synchronous object (`{ slug: string }`) and reads `params.slug` directly, instead of the Next.js 15 async pattern (`params: Promise<{ slug: string }>`, `const { slug } = await params`) that src/app/(public)/blog/[slug]/page.tsx correctly uses. /routes/makkah-to-taif-taxi only looks fine because it has its OWN dedicated static folder (src/app/(public)/routes/makkah-to-taif-taxi/page.tsx) that shadows the dynamic [slug] route entirely — madinah-hotel-to-airport has no such folder, so it's the one hitting the buggy dynamic route.

- URL 1 (the blog post) does not currently exist: zero matches for "ziyarat-places-madinah" anywhere in src/data/blog-posts.ts, and the live page renders the code's own "Article Not Found" fallback (confirming getPost() returned null from both the static file and the BlogPost Mongo lookup in src/services/blogService.ts). There is no noindex-emitting code anywhere in the current codebase for this page — no robots field in its generateMetadata, no site-wide default in src/app/layout.tsx, and robots.ts doesn't disallow /blog. Since notFound() is called, this should be a real 404, so GSC's "noindex" bucket for it is most likely a stale, months-old snapshot from before the post was removed — but I have NOT been able to verify whether it was deliberately retired or lost by accident, since I don't have DB or git-history access from here.

OBJECTIVE
1. Fix the confirmed, live production bug in routes/[slug]/page.tsx that is serving wrong content under a broken canonical for madinah-hotel-to-airport (and possibly other slugs with no dedicated static folder).
2. Determine — with evidence, not a guess — whether the ziyarat-places-madinah blog post was deliberately removed or accidentally lost, and act accordingly.
3. Leave the already-working /umrah/* redirect logic untouched.

NON-NEGOTIABLES
1. Do not deploy automatically. Work on a branch — I review and approve before merge to production.
2. Do not modify next.config.ts's existing /umrah/* redirects() rules — they are already correct and working; touching them risks breaking a fix that's already live.
3. Do not touch booking, payment, pricing calculation, or admin-auth logic. This is scoped to the routes/[slug] dynamic page and the blog post investigation only.
4. Do NOT invent, write, or restore content for "Ziyarat Places in Madinah" on your own judgment. If you find no trace of the original post in git history or the database, stop and report that to me — restoring or writing that article is my decision, not yours.
5. Any fix to routes/[slug]/page.tsx must preserve its existing SEO output (title, description, keywords, JSON-LD Service schema, OpenGraph) for every slug that currently works correctly — this is a targeted bug fix, not a rewrite.

TASKS

1. Fix src/app/(public)/routes/[slug]/page.tsx:
   - Update the params typing to the Next.js 15 async pattern: `params: Promise<{ slug: string }>`, and `const { slug } = await params;` in both generateMetadata and the page component (mirror the working pattern in src/app/(public)/blog/[slug]/page.tsx exactly).
   - After the fix, run a full production build (`npm run build`) and specifically inspect the generated static output for /routes/madinah-hotel-to-airport to confirm it now contains ITS OWN correct title, content, and a canonical of https://www.alaqsaumrahtransport.com/routes/madinah-hotel-to-airport — not "undefined" and not another route's content.
   - Cross-check every slug in src/data/pricing.json's routes[] array against the folders under src/app/(public)/routes/ — any slug WITHOUT its own dedicated static folder was going through the same buggy dynamic route. List every such slug and confirm each one now renders correctly after the fix. Do not assume madinah-hotel-to-airport was the only one affected.

2. Investigate ziyarat-places-madinah — evidence only, no content creation:
   - Search git log / git blame across src/data/blog-posts.ts and any admin/blog-related commits for "ziyarat-places-madinah" or "Ziyarat Places" to see if it ever existed in this repo and, if so, when and how it was removed.
   - Query the BlogPost Mongo collection directly (read-only) for a document with slug "ziyarat-places-madinah", including soft-deleted/unpublished states if the schema tracks that.
   - Report back clearly: found evidence it existed and was removed (with the commit/date if available), found evidence it exists in the DB right now but isn't resolving (and why), or no trace anywhere. Do not proceed past this step without my direction.

3. Sanity-check: confirm the existing /umrah/:path* redirect rules in next.config.ts are unmodified and still present after your changes.

4. After your fix is merged and deployed to production, tell me explicitly: "This is now live at [production URL] — safe to re-run URL Inspection and Validate Fix in Search Console for all three URLs." Do not tell me to validate before confirming the deploy is live.

DELIVERABLE
- A single feature branch with the routes/[slug]/page.tsx fix
- The full list of route slugs that were affected by the same bug (not just madinah-hotel-to-airport), and confirmation each now renders correctly
- Your evidence report on ziyarat-places-madinah (git history + DB findings) — no content written, no post restored, without my sign-off
- Confirmation next.config.ts's /umrah/* redirects are untouched
- Explicit confirmation of what still needs my decision before merging
```

---

## One more thing

For URL 1, once Antigravity reports back what it found, you'll have one of two calls to make: republish the post (if you want that content live again — in which case say so and I can help you turn it back into a proper page, or Antigravity can restore it from git history if it finds it), or confirm it's gone for good, in which case the fix is simply to use GSC's "Removals" tool for a clean removal rather than leaving it to eventually self-resolve as a 404. Either way, don't click Validate Fix on any of these three until Antigravity confirms the routes/[slug] fix is live in production — the madinah-hotel-to-airport bug is a real content problem, not just a GSC quirk, and it's worth fixing on its own merits even beyond this validation.
