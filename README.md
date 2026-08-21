# Saver's Employee Hub

An installable web app (PWA) that puts every employee-facing tool
behind one home-screen icon on iOS and Android.

## What's inside
- index.html / styles.css / script.js — the app itself (Material Design 3)
- manifest.json — makes it installable ("Add to Home Screen")
- service-worker.js — caches the app shell so it opens instantly, even offline
- icons/ — app icons generated from your logo

## How employees install it
**Android (Chrome):** open the link -> tap "Install" on the banner, or
Chrome's menu -> "Add to Home screen".

**iPhone (Safari):** open the link -> tap the Share icon -> "Add to Home
Screen". (Safari doesn't support automatic install prompts — this is
Apple's standard PWA install flow, the banner in the app walks them
through it.)

## What you need to actually deploy this
Right now these files just sit on disk. To make the link real for your
team, you need HTTPS hosting. Cheapest/simplest options:
1. **GitHub Pages** (free) — push this folder to a repo, enable Pages
2. **Netlify or Vercel** (free tier) — drag-and-drop deploy, get an
   instant https:// URL
3. **Your own web server / subdomain** — e.g. hub.saverscostplus.com,
   if you want it on your own domain (recommended for a polished,
   trustworthy internal link employees will bookmark)

PWAs require HTTPS (localhost is the only exception), so whichever you
pick, make sure it serves over https.

## Customizing further
- **Brand colors**: each tool tile's color lives in `TOOLS` at the top
  of script.js — swap in exact hex codes from each vendor's brand kit
  if you have them.
- **Real logos**: currently each tile shows a colored initial (avoids
  using trademarked logo image files without permission). To use actual
  vendor logos, drop approved logo PNGs in icons/ and swap the
  `.tool-card__icon` div for an `<img>` per tool in script.js.
- **Adding/removing a tool**: edit the TOOLS array in script.js — no
  other file needs to change.
- **SSO**: right now each tile opens the vendor's own login page in a
  new tab. If your company has SSO (e.g. Okta, Azure AD) in front of
  any of these tools, point the url field at the SSO-protected link
  instead for one-tap sign-in.
