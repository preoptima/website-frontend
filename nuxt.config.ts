// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

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
// writes to `_redirects`.
async function fetchRedirectRouteRules() {
  try {
    const redirects = await fetchFromSanity<{ source: string, destination: string, permanent?: boolean }[]>(
      `*[_type == "redirect" && defined(source) && defined(destination)]{source, destination, permanent}`,
    )
    return Object.fromEntries(
      redirects.map(({ source, destination, permanent }) => [
        source,
        { redirect: { to: destination, statusCode: permanent === false ? 302 as const : 301 as const } },
      ]),
    )
  }
  catch (error) {
    console.warn('[redirects] Could not fetch redirects from Sanity, continuing without them:', error)
    return {}
  }
}

// Every page is prerendered, not just the ones the crawler can reach from `/`.
async function fetchPageRoutes() {
  try {
    const slugs = await fetchFromSanity<string[]>(`*[_type == "page" && defined(slug.current)].slug.current`)
    return slugs.map(slug => `/${slug}`)
  }
  catch (error) {
    console.warn('[prerender] Could not fetch page slugs from Sanity, relying on the crawler:', error)
    return []
  }
}

export default defineNuxtConfig({

  modules: ['@nuxtjs/sanity', '@nuxt/image', '@nuxt/eslint'],
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2025-07-15',

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      vuetify({
        autoImport: true,
        styles: { configFile: resolve('./app/assets/styles/settings.scss') },
      }),
    ],
  },

  hooks: {
    async 'nitro:config'(nitroConfig) {
      nitroConfig.routeRules = {
        ...nitroConfig.routeRules,
        ...(await fetchRedirectRouteRules()),
      }
      nitroConfig.prerender ||= {}
      nitroConfig.prerender.routes = [
        ...(nitroConfig.prerender.routes ?? []),
        ...(await fetchPageRoutes()),
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
