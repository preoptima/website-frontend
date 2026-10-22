import type { Ref } from 'vue'
import type { Page } from '~/types/sanity'

// Applies page-level SEO, falling back to the defaults in Site settings.
// Must stay synchronous: composables lose the Nuxt instance after an `await`.
export function usePageSeo(page: Ref<Page | null | undefined>) {
  const { data: settings } = useSiteSettings()
  const img = useImage()
  const { siteUrl } = useRuntimeConfig().public
  const canonical = computed(() => new URL(page.value?.isHome ? '/' : `/${page.value?.slug ?? ''}`, siteUrl).href)

  // The site-wide title is the fallback for the home page only; every other
  // page is titled after itself. Without a description, the hero's opening
  // paragraph says what the page is about better than a site-wide default.
  const defaults = computed(() => settings.value?.settings?.seo ?? {})
  const pageSeo = computed(() => stripEmpty(page.value?.seo))
  const siteTitle = computed(() => settings.value?.settings?.title)
  const title = computed(() => pageSeo.value.title || (page.value?.isHome ? undefined : page.value?.title))
  const fullTitle = computed(() => (title.value ? `${title.value} | ${siteTitle.value}` : siteTitle.value))
  const description = computed(() =>
    pageSeo.value.description || truncate(page.value?.hero?.body?.[0]) || defaults.value.description,
  )
  const imageRef = computed(() => (pageSeo.value.image ?? defaults.value.image)?.asset?._ref)

  useSeoMeta({
    title: () => title.value,
    description: () => description.value,
    ogTitle: () => fullTitle.value,
    ogDescription: () => description.value,
    ogSiteName: () => siteTitle.value,
    ogType: 'website',
    ogImage: () => (imageRef.value ? img(imageRef.value, {}, { preset: 'ogImage' }) : undefined),
    ogUrl: () => canonical.value,
    twitterCard: 'summary_large_image',
    robots: () => (pageSeo.value.noIndex ?? defaults.value.noIndex ? 'noindex, nofollow' : undefined),
  })
  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}

// Search results show about 160 characters; cut at a word boundary.
function truncate(text?: string, max = 160) {
  if (!text || text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max - 1))}…`
}

function stripEmpty<T extends object>(value?: T) {
  return Object.fromEntries(
    Object.entries(value ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>
}
