# Building FastFox: A Firefox Profile From 33,000 Bookmarks to a Polished Apple Silicon Setup

**Published: June 23, 2026**

---

I've been using Firefox since version 1.0 (back when Phoenix was the codename). Over 20+ years, my profile accumulated 32,971 bookmarks, hundreds of `about:config` tweaks, and a pile of half-finished CSS experiments. Last week, I decided to clean house — and ended up building something worth sharing.

**FastFox** is the result: a git-tracked Firefox profile configuration that turns a fresh Firefox install into a privacy-first, performance-tuned, macOS-native browsing experience. It runs on the M4 Mac I use daily, but the approach applies to any modern Firefox on any platform.

This post covers what I learned in the process — bookmark archaeology, Firefox config engineering, and why CSS-only vertical tabs are a trap.

---

## The Bookmark Problem

32,971 bookmarks sounds absurd, because it is. I never deleted anything. Every tab I opened with intent became a bookmark. Every article I'd "read later" was saved. Every tool, every API doc, every random HN comment — all preserved.

The breakdown was brutal:

| Filter | Count | What went |
|---|---|---|
| Raw total | 32,971 | — |
| Non-HTTPS | 24,586 removed | Mostly `http://` links from the early 2010s — dead domains, blogspot blogs, university pages |
| Duplicates | 7,560 removed | Same URL bookmarked 3-12 times across folders like "Read Later", "Dev", "To Sort" |
| Truly dead | 17 removed | DNS resolution failures, 410 Gone, expired SSL |
| **Final** | **808** | Curated, tagged, sorted by visit frequency |

The toolchain was trivial — `sqlite3` on the Firefox `places.sqlite` database, a Python script for categorization, and a `bookmarks.html` export for portability. The actual work was defining the categories and deciding what to keep.

### What survived

The 808 survivors fall into 13 categories. The top tier is predictable:

- **AI & ML**: ChatGPT (181 visits) and Perplexity
- **Dev & Tech**: GitHub, Stack Overflow, AWS/GCP/Azure, Docker, Kubernetes
- **News**: Financial Times, Bloomberg, NLB eNewspapers
- **Social Media**: Reddit, LinkedIn, Instagram, X, WhatsApp

The "Other" category swallowed 559 links — the long tail of articles, tools, and random pages that didn't fit a neat box. These are the least-visited but hardest to let go.

---

## The `user.js`: 176 Preferences, Every One Explained

Betterfox by yokoffing is the gold standard for Firefox `user.js` configs, and FastFox builds directly on it. But applying a generic config to an M4 MacBook with 16 GB RAM requires specific tuning.

### What I changed from Betterfox

**Network:**

Betterfox disables disk cache ("SSD wear"). That advice traces back to the Intel/SATA era. On an M4 with a 512 GB NVMe controller, disk cache is functionally free. Enabled at 512 MB, it improved repeat-page-load times by 8-15% in my testing.

Betterfox sets `network.http.max-connections` to 2400. This is too aggressive — some consumer routers and corporate VPNs start dropping connections above ~1200. I settled on 1200, which saturates a gigabit link without overwhelming network hardware.

**Privacy:**

Betterfox sets `network.trr.mode` to 3 (always use DoH, never fall back to native DNS). This is dangerously brittle: if Cloudflare's resolver is down (it happens), or if a domain is blocked at the DNS level, the site is simply unreachable. Mode 2 (fall back to native) provides the same privacy benefit with dramatically better reliability.

**GPU:**

Betterfox leaves `gl.msaa-level` at default. On an M4 with WebRender enabled, forcing 4x MSAA wastes GPU cycles for zero visible benefit — WebRender has its own anti-aliasing pipeline. Set to 0.

**Video:**

Betterfox enables `media.ffvpx.enabled` (software VP9 decoder). On Apple Silicon, this competes with the system's VideoToolbox hardware decoder, increasing CPU usage and battery drain. Disabled it — the M4's media engine handles VP9, AV1, H.264, and H.265 in hardware.

**Process count:**

Betterfox sets `dom.ipc.processCount.web` to 4. The M4 has 4 performance cores and 6 efficiency cores. Running only 4 web processes leaves performance on the table — 6 is the right balance.

### The most controversial setting

`security.OCSP.enabled = 0`. This disables Online Certificate Status Protocol — Firefox won't check CAs for certificate revocation at request time. The companion setting `security.pki.crlite_mode = 2` enables CRLite, Mozilla's compact certificate revocation list. CRLite is more private than OCSP (no request-time leak of your browsing to CAs) and faster (local lookup vs. network fetch). But it's less comprehensive — not all certificates appear in CRLite. For most users, the privacy win outweighs the coverage gap.

---

## The UI: macOS-Native Styling Without Breaking the Browser

The biggest mistake I made was trying to force Firefox's XUL layout into a vertical tab sidebar using CSS. It sort-of works — until it doesn't. Firefox's internal DOM structure changes frequently, and a `position: fixed` on `#TabsToolbar` that works today will break on the next Nightly. I learned this the hard way when my beautifully styled vertical tabs rendered as a 40px invisible strip with overlapped window controls.

The fix was humbling: **don't restructure the layout. Style what's there.**

The current `userChrome.css` is 254 lines (down from 558) and does exactly zero `position: fixed`, `margin-left` offset, or flexbox reordering. It just applies macOS-native visual polish:

- System font (`-apple-system` / San Francisco Pro)
- 10px pill-shaped URL bar with accent-color focus ring
- Frosted glass popups via `backdrop-filter: blur(40px)`
- Hidden clutter (forward, home, library, sidebar buttons)
- Respects `prefers-color-scheme` for dark mode

For vertical tabs, I ship Sidebery integration CSS (commented out, ~8 lines). Sidebery is an extension that provides proper, stable vertical tabs with tab groups, snapshots, and container support. It doesn't break when Firefox updates.

### The sidebar styling I wish I'd written first

If you want vertical tabs, the reliable approach is:

1. Install Sidebery → Set layout to "Vertical"
2. Hide the native tab strip with `#TabsToolbar { visibility: collapse; }`
3. Style `#sidebar-box` with your desired width and background
4. Never touch it again

Pure CSS vertical tabs require patching Firefox internals that change every 6 weeks. It's not a project — it's a hobby.

---

## What I'd Do Differently

**Start with a fresh profile.** Applying `user.js` to a decade-old profile creates subtle conflicts from deprecated prefs in `prefs.js`. A `-CreateProfile "FastFox"` eliminates the variable.

**Tag bookmarks by folder, not tags.** Firefox's tag system is poorly integrated into the UI. Folders are better. Each of my 13 categories is a folder in the bookmark bar.

**Test the CSS on Nightly before shipping.** If I'd tested my first `userChrome.css` on Firefox 153, I'd have caught the `position: fixed` layout collapse immediately instead of learning about it from a user report.

---

## The Result

FastFox is now on GitHub at [github.com/irfancode/FastFox](https://github.com/irfancode/FastFox). To install on any Mac:

```bash
/Applications/Firefox.app/Contents/MacOS/firefox -CreateProfile "FastFox"
# Copy user.js, chrome/*.css, and bookmarks.html into the profile
/Applications/Firefox.app/Contents/MacOS/firefox -P FastFox
```

The repo contains:

- `user.js` — 176 prefs, each with rationale comments
- `chrome/userChrome.css` — macOS-native visual styling (254 lines)
- `chrome/userContent.css` — Clean new tab and settings pages
- `bookmarks.html` — 808 curated, categorized bookmarks
- `README.md` — Installation guide, file reference, pros/cons comparison

I use it as my daily driver on an M4 MacBook Pro with 16 GB RAM. Memory pressure stays under 50% with 20+ tabs open. Page loads feel instant. The privacy overhead is invisible — I've never noticed DoH or CRLite affecting page load times.

---

*FastFox is MIT-licensed. Built on Betterfox by yokoffing. Firefox is a trademark of the Mozilla Foundation.*

*[Discuss on HN](https://news.ycombinator.com) | [GitHub](https://github.com/irfancode/FastFox)*
