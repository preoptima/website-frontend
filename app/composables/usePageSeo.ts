import type { Ref } from 'vue'
import type { Page } from '~/types/sanity'

// Applies page-level SEO, falling back to the defaults in Site settings.
// Must stay synchronous: composables lose the Nuxt instance after an `await`.
export function usePageSeo(page: Ref<Page | null | undefined>) {
  const { data: settings } = useSiteSettings()
  const img = useImage()
  const { siteUrl } = useRuntimeConfig().public
  const canonical = computed(() => new URL(page.value?.isHome ? '/' : `/${page.value?.slug ?? ''}`, siteUrl).href)

  const seo = computed(() => ({ ...settings.value?.settings?.seo, ...stripEmpty(page.value?.seo) }))
  const imageRef = computed(() => seo.value.image?.asset?._ref)

  useSeoMeta({
    title: () => seo.value.title || page.value?.title,
    description: () => seo.value.description,
    ogTitle: () => seo.value.title || page.value?.title,
    ogDescription: () => seo.value.description,
    ogImage: () => (imageRef.value ? img(imageRef.value, {}, { preset: 'ogImage' }) : undefined),
    ogUrl: () => canonical.value,
    robots: () => (seo.value.noIndex ? 'noindex, nofollow' : undefined),
  })
  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}

function stripEmpty<T extends object>(value?: T) {
  return Object.fromEntries(
    Object.entries(value ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>
}
