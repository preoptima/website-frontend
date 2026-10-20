import { siteSettingsQuery } from '~/queries'
import type { SiteSettings } from '~/types/sanity'

// Site settings, navigation and footer in one request, shared by app.vue, the
// header, footer and page SEO. Plain useAsyncData rather than useSanityQuery:
// calls with the same key share one data ref, so components that don't await
// still read the payload during hydration (useSanityQuery hands each caller a
// fresh ref that stays empty until its promise resolves).
export function useSiteSettings() {
  const sanity = useSanity()
  return useAsyncData('site-settings', () => sanity.fetch<SiteSettings>(siteSettingsQuery))
}
