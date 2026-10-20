# Preoptima Frontend

Nuxt 4 marketing site for Preoptima. Content comes from Sanity; the studio lives in the sibling [`website-cms`](https://github.com/preoptima/website-cms) repo.

## Stack

- [Nuxt 4](https://nuxt.com): app code lives in `app/`
- Plain Vue components and CSS built from the design handoff in the sibling `designs` folder. Design-system tokens live in `app/assets/css/tokens.css`, block tones in `app/assets/css/tones.css`
- [@nuxtjs/sanity](https://sanity.nuxtjs.org) for querying content (`useSanityQuery`)
- [@nuxt/image](https://image.nuxt.com) with the Sanity provider (`app/components/SanityImg.vue`)
- Manrope, self-hosted as subset WOFF2 files in `public/fonts`

## Getting started

```sh
cp .env.example .env   # optional: defaults point at the production dataset
npm install
npm run dev            # http://localhost:3000
```

The site needs content to render. The CMS repo has a seed script that loads the design fixtures (see its README). Set `NUXT_PUBLIC_SHOW_PLACEHOLDERS=true` to see dashed placeholders where images are missing.

Other scripts: `npm run build`, `npm run generate`, `npm run preview`, `npm run lint`, `npm run typecheck`.

## Hosting

The site is fully static (`npm run generate` → `dist/`). It is tested on Netlify (see `netlify.toml`) and will move to static hosting on AWS (S3 + CloudFront) like the other Preoptima projects. Content changes only appear after a rebuild.

- Every page slug in Sanity is fetched at build time and prerendered, so pages don't need to be linked to get built.
- A page that errors while prerendering fails the build rather than deploying broken.
- Redirects are written to Netlify's `_redirects`. On AWS they will need re-implementing (e.g. a CloudFront Function), because S3 can't read that file.

## How it fits together

- `app/queries.ts`: all GROQ queries. References are expanded and links resolved here, so components get flat props.
- `app/types/sanity.ts`: hand-written types for the query results.
- `app/pages/index.vue` and `app/pages/[...slug].vue`: fetch the page and render `PageView` (header, hero, blocks, footer). The page theme sets `data-family` on `<main>`.
- `app/components/BlockRenderer.vue`: maps each block `_type` to a component in `app/components/blocks/`. Unknown types are skipped.
- `app/components/ui/`: shared pieces (`ButtonCta`, `HeadingText`, `Placeholder`). Components register by file name, without folder prefixes.
- Each block takes a `tone`; `.tone--*` classes in `tones.css` set its background and text colours.
- `app/composables/useSiteSettings.ts`: settings, navigation and footer in one shared request.
- `app/composables/usePageSeo.ts`: page SEO, falling back to the defaults in Site settings.
- Redirects managed in the CMS are fetched in `nuxt.config.ts` at build time and become Nitro route rules.
- Composables must call other composables before any `await`. After an `await` the Nuxt instance is gone (error `NUXT_E1001`). Only `<script setup>` restores it.

## Notes

- `useSanityQuery` returns a fresh, empty ref to callers that don't `await` it, which breaks hydration. Shared data that components read without awaiting uses plain `useAsyncData` instead (see `useSiteSettings`).
- The 404 page is client-rendered and queries Sanity from the browser, so the site's domain must be in the Sanity project's CORS origins.
- With npm 10.9, `npm install` fails on this dependency tree with `Cannot read properties of null (reading 'edgesOut')`. Use npm 11 or later (`npx npm@11 install`).
