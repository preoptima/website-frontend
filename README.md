# Preoptima Frontend

Nuxt 4 marketing site for Preoptima. Content comes from Sanity; the studio lives in the sibling [`website-cms`](https://github.com/preoptima/website-cms) repo.

## Stack

- [Nuxt 4](https://nuxt.com): app code lives in `app/`
- [Vuetify 4](https://vuetifyjs.com) with SCSS variable overrides in `app/assets/styles/settings.scss` and the theme in `app/plugins/vuetify.ts`
- [@nuxtjs/sanity](https://sanity.nuxtjs.org) for querying content (`useSanityQuery`)
- [@nuxt/image](https://image.nuxt.com) with the Sanity provider (`app/components/SanityImg.vue`)
- [@portabletext/vue](https://github.com/portabletext/vue-portabletext) for rich text

## Getting started

```sh
cp .env.example .env   # optional: defaults point at the production dataset
npm install
npm run dev            # http://localhost:3000
```

The site needs content to render. In the studio, create a page, then open **Site settings** and set it as the home page. Until then every route returns a 404.

Other scripts: `npm run build`, `npm run generate`, `npm run preview`, `npm run lint`, `npm run typecheck`.

## Hosting

The site is fully static (`npm run generate` → `dist/`). It is tested on Netlify (see `netlify.toml`) and will move to static hosting on AWS (S3 + CloudFront) like the other Preoptima projects. Content changes only appear after a rebuild.

- Every page slug in Sanity is fetched at build time and prerendered, so pages don't need to be linked to get built.
- A page that errors while prerendering fails the build rather than deploying broken.
- Redirects are written to Netlify's `_redirects`. On AWS they will need re-implementing (e.g. a CloudFront Function), because S3 can't read that file.

## How it fits together

- `app/queries.ts`: all GROQ queries. Link references are dereferenced here.
- `app/types/sanity.ts`: hand-written types for the query results. Replace them with `sanity typegen` output once the schema settles.
- `app/pages/index.vue`: the home page set in Site settings.
- `app/pages/[...slug].vue`: every other page, looked up by slug.
- `app/components/PageBuilder.vue`: maps each block `_type` to a component in `app/components/blocks/`.
- `app/composables/usePageSeo.ts`: page SEO, falling back to the defaults in Site settings.
- Redirects managed in the CMS are fetched in `nuxt.config.ts` at build time and become Nitro route rules.
- Composables must call other composables before any `await`. After an `await` the Nuxt instance is gone (error `NUXT_E1001`). Only `<script setup>` restores it.

## Notes

- Vuetify 4 uses Material Design 3 type classes (`text-display-medium`, `text-headline-medium`, `text-body-large`, …). The old `text-h1` to `text-h6` classes are gone.
- With npm 10.9, `npm install` fails on this dependency tree with `Cannot read properties of null (reading 'edgesOut')`. Use npm 11 or later (`npx npm@11 install`).
