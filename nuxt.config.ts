// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

const sanityProjectId = process.env.NUXT_PUBLIC_SANITY_PROJECT_ID || 'zfe5m87l'
const sanityDataset = process.env.NUXT_PUBLIC_SANITY_DATASET || 'production'

// Fetches editor-managed redirects from Sanity and turns them into Nitro
// routeRules at build time, so they work whether the site is SSR or prerendered.
async function fetchRedirectRouteRules() {
  const query = encodeURIComponent(
    `*[_type == "redirect" && defined(source) && defined(destination)]{source, destination, permanent}`,
  )

  try {
    const response = await fetch(
      `https://${sanityProjectId}.apicdn.sanity.io/v2025-02-19/data/query/${sanityDataset}?query=${query}`,
    )
    if (!response.ok) {
      throw new Error(`Sanity responded with ${response.status}`)
    }

    const { result } = (await response.json()) as {
      result: { source: string, destination: string, permanent?: boolean }[]
    }

    return Object.fromEntries(
      result.map(({ source, destination, permanent }) => [
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
    useCdn: true,
  },
})
