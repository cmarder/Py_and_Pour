# Py & Pour

Py & Pour is a cozy, café-themed web app for practicing Python in small,
story-driven exercises. Python runs directly in the browser, and progress is
saved on the learner's device.

## Getting Started

You need Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal. Changes made under `app/` will
appear while the development server is running.

## Commands to Remember

| Command | When to use it |
| --- | --- |
| **`npm run dev`** | Start the app for local development |
| **`npm run build:pages`** | Check that the GitHub Pages version builds |
| **`npm run deploy:pages`** | Build and publish the site to GitHub Pages |
| `npm run build` | Check the original Cloudflare/Sites build |

## Deploying to GitHub Pages

The live site is published from the `gh-pages` branch at:

<https://cmarder.github.io/Py_and_Pour/>

To publish the latest version:

```bash
NEXT_PUBLIC_SITE_URL=https://cmarder.github.io/Py_and_Pour/ npm run deploy:pages
```

After publishing, allow GitHub a minute or two to update the site. If an older
or unstyled version appears, perform a hard refresh in the browser.

### One-Time GitHub Setup

In the repository, open **Settings → Pages**, then choose:

- **Source:** Deploy from a branch
- **Branch:** `gh-pages`
- **Folder:** `/(root)`

The build is configured for the repository name `Py_and_Pour`. If the
repository is renamed, build with its new name:

```bash
GITHUB_PAGES_REPO=new-name npm run deploy:pages
```

## Project Notes

- Main interface and exercises: `app/page.tsx`
- Visual styling: `app/globals.css`
- GitHub Pages configuration: `next.config.ts`
- Social sharing image: `public/og.png`
- Learner progress is stored locally in the browser; there is no account or
  shared database.
