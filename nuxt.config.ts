// https://nuxt.com/docs/api/configuration/nuxt-config
const sanityProjectId = process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'zfe5m87l'
const sanityDataset = process.env.NUXT_PUBLIC_SANITY_DATASET || 'production'

// Build-time queries go to the uncached API so a rebuild triggered by a publish
// webhook never picks up stale CDN data.
async function fetchFromSanity<T>(query: string): Promise<T> {
  const response = await fetch(
    `https://${sanityProjectId}.api.sanity.io/v2025-02-19/data/query/${sanityDataset}?query=${encodeURIComponent(query)}`,
  )
  if (!response.ok) {
    throw new Error(`Sanity responded with ${response.status}`)
  }
  const { result } = (await response.json()) as { result: T }
  return result
}

// Editor-managed redirects become Nitro routeRules, which the Netlify preset
// writes to `_redirects`. Redirect sources are never prerendered: Netlify serves
// a file at a path in preference to a `_redirects` rule for it.
async function fetchRedirectRouteRules() {
  try {
    const redirects = await fetchFromSanity<{ source: string, destination: string, permanent?: boolean }[]>(
      `*[_type == "redirect" && defined(source) && defined(destination)]{source, destination, permanent}`,
    )
    return Object.fromEntries(
      redirects.map(({ source, destination, permanent }) => [
        source,
        { redirect: { to: destination, statusCode: permanent === false ? 302 as const : 301 as const }, prerender: false },
      ]),
    )
  }
  catch (error) {
    console.warn('[redirects] Could not fetch redirects from Sanity, continuing without them:', error)
    return {}
  }
}

// Every page is prerendered, not just the ones the crawler can reach from `/`.
// The home page is served at `/` only; its own slug redirects there so it isn't
// published twice.
async function fetchPageRoutes() {
  try {
    const pages = await fetchFromSanity<{ slug: string, isHome: boolean }[]>(
      `*[_type == "page" && defined(slug.current)]{
        "slug": slug.current,
        "isHome": _id == *[_type == "siteSettings"][0].homePage._ref
      }`,
    )
    return {
      prerender: pages.filter(page => !page.isHome).map(page => `/${page.slug}`),
      routeRules: Object.fromEntries(
        pages.filter(page => page.isHome).map(page => [`/${page.slug}`, { redirect: { to: '/', statusCode: 301 as const }, prerender: false }]),
      ),
    }
  }
  catch (error) {
    console.warn('[prerender] Could not fetch page slugs from Sanity, relying on the crawler:', error)
    return { prerender: [], routeRules: {} }
  }
}

export default defineNuxtConfig({

  modules: ['@nuxtjs/sanity', '@nuxt/image', '@nuxt/eslint'],

  // Register components by file name only: blocks/BlockHero.vue is <BlockHero>,
  // ui/ButtonCta.vue is <ButtonCta>.
  components: [{ path: '~/components', pathPrefix: false }],
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        // The weights used above the fold: body, headings, nav and buttons.
        ...[400, 500, 600, 700].map(weight => ({
          rel: 'preload' as const,
          href: `/fonts/manrope-${weight}.woff2`,
          as: 'font' as const,
          type: 'font/woff2',
          crossorigin: '' as const,
        })),
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Netlify sets URL to the site's primary address at build time.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.URL || 'http://localhost:3000',
      // Dashed slots where an editor hasn't added an image yet. On for the
      // test host only; production hides the slot instead.
      showPlaceholders: process.env.NUXT_PUBLIC_SHOW_PLACEHOLDERS === 'true',
    },
  },
  compatibilityDate: '2025-07-15',

  hooks: {
    async 'nitro:config'(nitroConfig) {
      const pageRoutes = await fetchPageRoutes()
      nitroConfig.routeRules = {
        ...nitroConfig.routeRules,
        ...pageRoutes.routeRules,
        ...(await fetchRedirectRouteRules()),
      }
      nitroConfig.prerender ||= {}
      nitroConfig.prerender.routes = [
        ...(nitroConfig.prerender.routes ?? []),
        ...pageRoutes.prerender,
      ]
    },
  },

  eslint: {
    config: { stylistic: true },
  },

  image: {
    sanity: {
      projectId: sanityProjectId,
      dataset: sanityDataset,
    },
    presets: {
      ogImage: {
        // @ts-expect-error @nuxt/image only types presets against the default (ipx) provider
        provider: 'sanity',
        modifiers: { width: 1200, height: 630, fit: 'cover', format: 'jpg' },
      },
    },
  },

  sanity: {
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: '2025-02-19',
    // The site is statically generated, so queries only run at build time.
    useCdn: false,
  },
})
