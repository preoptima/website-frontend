import type { Ref } from 'vue'
import type { Page } from '~/types/sanity'

// Applies page-level SEO, falling back to the defaults in Site settings.
export async function usePageSeo(page: Ref<Page | null | undefined>) {
  const settings = await useSiteSettings()
  const img = useImage()

  const seo = computed(() => ({ ...settings.value?.seo, ...stripEmpty(page.value?.seo) }))
  const imageRef = computed(() => seo.value.image?.asset?._ref)

  useSeoMeta({
    title: () => seo.value.title || page.value?.title,
    description: () => seo.value.description,
    ogTitle: () => seo.value.title || page.value?.title,
    ogDescription: () => seo.value.description,
    ogImage: () => (imageRef.value ? img(imageRef.value, {}, { preset: 'ogImage' }) : undefined),
    robots: () => (seo.value.noIndex ? 'noindex, nofollow' : undefined),
  })
}

function stripEmpty<T extends object>(value?: T) {
  return Object.fromEntries(
    Object.entries(value ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Partial<T>
}
